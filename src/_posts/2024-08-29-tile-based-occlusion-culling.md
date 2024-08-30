---
title: "Tile-based Occlusion Culling"
date: "2024-09-29"
description: "This article explains the algorithm of tile-based occlusion culling."
categories: 
- General
meta:
  - property: og:title
    content: Tile-based Occlusion Culling
  - property: og:description
    content: This article explains the algorithm of tile-based occlusion culling.
  - property: og:type
    content: article
  - property: og:url
    content: https://fyrox.rs/blog/post/tile-based-occlusion-culling
  - property: og:image
    content: https://fyrox.rs/assets/occlusion/bits.svg
---

Occlusion culling is a visibility test, that determines if an object is visible or not. There are many different 
techniques for occlusion culling with their own pros and cons, and this article introduces another approach for 
occlusion culling. It is fast, efficient, and does not require compute shaders and could work on quite old hardware 
(including mobile devices).

## Short Explanation

TL;DR. The main idea is to split the screen into multiple tiles, find which object belongs to which tile, render bounding 
boxes into a frame buffer with depth buffer from previous frame, find bit index for every pixel in tile for every 
bounding box and merge them all using additive blending. Downscale this "visibility buffer" and read it back on CPU and 
cache the visibility info for the next frame.

## Algorithm Overview

Occlusion queries are well known occlusion culling mechanism, yet it has significant downsides that limits its usage:

1) Quite significant lag and visibility info could be obtained with *at least* one frame delay.
2) Cannot be used with instancing, thus requires separate draw call for each visibility test.

The latter is the major downside of occlusions queries, that could easily kill performance instead of improving it.
The tile-based occlusion query algorithm was designed specifically to bypass the lack of instancing and to reduce the lag
to guaranteed one frame. 

The major steps of the algorithm includes:

1) Perform the initial frustum culling to find objects on screen, that needs to be rendered.
2) Create a frame buffer with depth buffer from the previous frame and one `RGBA8` color target.
3) Divide the screen using a set tiles of fixed size (for example, 16x16 pixels). Sort the objects list from back-to-front 
and project bounding box (AABB) of each object onto the screen and write its index into the tiles it intersects.
4) Take the first 32 (more on that later) object indices from the list of each tile and upload them into special `R32UI`
texture buffer of `((1 + 32) * wTileCount, hTileCount)` in size. First element of each tile should contain the amount of objects
in it. 
5) Collect all the world-space matrices of each AABB into a buffer (could be a `RGBA32F` texture or, a vertex buffer, etc. 
depends on the target hardware).
6) Enable additive blending and render AABBs of every object using instanced rendering in the frame buffer.
7) In the fragment shader, find corresponding position (1 of 32) of the instance in respective tile buffer and raise one of 
32 available bits in pixel. Since we have additive blending enabled, this bit will be combined with all other bits from
other objects in the tile.
8) Create separate frame buffer with one color attachment of `R32UI` format of `(wTileCount, hTileCount)` in size and merge
all the bits from each pixel of corresponding tile into one pixel.
9) Read this optimized visibility buffer back on CPU and using the tiles, map each bit to object index and cache this 
visibility info for the next frame.

The next sections will explain each major step in details.

## Frustum Culling and Sorting

Frustum culling must be applied to the set of objects, to prevent GPU from doing unnecessary work and to prevent potential
issues when projecting AABBs of object on screen. Sort the list of visible objects from closest to farthest.

## Frame Buffers

There are two frame buffers used in this algorithm: 

1) Visibility buffer - full screen RGBA8 texture as a color attachment + depth/stencil texture with D24S8 format. The depth
buffer must be filled with the depth from previous frame.
2) Optimization buffer - `(wTileCount, hTileCount)` R32UI texture as a color attachment + no depth buffer.

## Tiles Preparation

When all the frame buffers are prepared, we can prepare the tiles. All we need to do is to uniformly fill the screen with tiles and
find a set of objects in each tile. It is very important to have the list of objects to be sorted back-to-front, this way the
tiles will be filled with object indices from closest to farthest. Since we'll be using axis-aligned bounding boxes for the 
visibility determination, all we need to do is to project the AABB of each object on screen plane and find the range of tiles 
that intersects with the projected bounds. To project an AABB on screen all we need to do is to project all 8 corners of it on 
the screen plane and find min and max points on the screen. This could be done like so:

```rust
fn screen_space_rect(
    aabb: AxisAlignedBoundingBox,
    view_projection: &Matrix4<f32>,
    viewport: &Rect<i32>,
) -> Rect<f32> {
    let mut min = Vector2::repeat(f32::MAX);
    let mut max = Vector2::repeat(f32::MIN);
    for corner in aabb.corners() {
        let clip_space = view_projection * Vector4::new(corner.x, corner.y, corner.z, 1.0);
        let ndc_space = clip_space.xyz() / clip_space.w.abs();
        let mut normalized_screen_space =
            Vector2::new((ndc_space.x + 1.0) / 2.0, (1.0 - ndc_space.y) / 2.0);
        normalized_screen_space.x = normalized_screen_space.x.clamp(0.0, 1.0);
        normalized_screen_space.y = normalized_screen_space.y.clamp(0.0, 1.0);
        let screen_space_corner = Vector2::new(
            (normalized_screen_space.x * viewport.size.x as f32) + viewport.position.x as f32,
            (normalized_screen_space.y * viewport.size.y as f32) + viewport.position.y as f32,
        );

        if screen_space_corner.x < min.x {
            min.x = screen_space_corner.x;
        }
        if screen_space_corner.y < min.y {
            min.y = screen_space_corner.y;
        }
        if screen_space_corner.x > max.x {
            max.x = screen_space_corner.x;
        }
        if screen_space_corner.y > max.y {
            max.y = screen_space_corner.y;
        }
    }
    let width = max.x - min.x;
    let height = max.y - min.y;
    Rect::new(min.x, min.y, width, height)
}
```

At first we transforming an AABB corner into clip space, then doing perspective divide using absolute value fourth component of 
the projected vector. Absolute value here is very important - when the point is behind near clipping plane we still need to know 
its projected position and if we'd use signed value, the projection would flip and the screen space rect would be incorrect.
It is also important to clamp the coordinates of the points in viewport bounds, because we'll use them to calculate indices of
the tiles.

Now when we know screen space rectangle of AABB, we need to find which tiles are intersecting with the rectangle. We could just 
iterate over each tile and check for intersection, but this is too slow and there's much faster solution. All we need to know 
position of tiles where min and max point of the rectangle are:

![interval](/assets/occlusion/interval.svg)

This could be calculated by simply dividing the coordinates of each point by the tile size. This way we're essentially transforming
screen space coordinates into tile space. All we need to do is to iterate in `min_y..max_y` and `min_x..max_x` ranges and write object
index and its average depth (more about this below) to the respective tiles:

```rust
 for (object_index, object) in self.objects_to_test.iter().enumerate() {
    let object_index = object_index as u32;
    let Some(node_ref) = graph.try_get(*object) else {
        continue;
    };

    let aabb = node_ref.world_bounding_box();
    let rect = screen_space_rect(aabb, &self.view_projection, viewport);

    if debug_renderer.is_some() {
        debug_renderer::draw_rect(&rect, &mut lines, Color::WHITE);
    }

    let min = self.screen_space_to_tile_space(rect.left_top_corner());
    let max = self.screen_space_to_tile_space(rect.right_bottom_corner());
    for y in min.y..=max.y {
        let offset = y * self.w_tiles;
        for x in min.x..=max.x {
            self.tiles.tiles[offset + x].add(object_index);
        }
    }
}
```

Once the tiles are filled, we need to sort object list of each tile by the average depth and put first 32 objects to plain array:

```rust
#[derive(Default)]
#[repr(C)]
struct GpuTile {
    objects: [u32; 32],
}

let mut gpu_tiles = vec![GpuTile::default; self.tiles.len()];

for (tile, gpu_tile) in self.tiles.iter_mut().zip(self.gpu_tiles.iter_mut()) {
    tile.objects
        .sort_by(|a, b| a.depth.partial_cmp(&b.depth).unwrap_or(Ordering::Less));

    gpu_tile.objects = tile
        .objects
        .iter()
        .map(|obj| obj.index)
        .chain([u32::MAX; MAX_BITS])
        .take(MAX_BITS)
        .collect::<ArrayVec<u32, MAX_BITS>>()
        .into_inner()
        .unwrap();
}
```

All that is left is to upload these `gpu_tiles` to a rectangular `R32UI` texture of `(32 * wTiles, hTiles)` size.

## Rendering

Now onto the core of the algorithm - how the visibility is actually determined. At first let's look at this image:

![interval](/assets/occlusion/bits.svg)

The idea is very simple - since each tile could contain only 32 objects, we could give each object its own bit mask
and combine the masks using additive blending when rendering AABBs of objects. We only need to find the appropriate 
bit mask in the fragment shader, it could be done like so:

```c
uniform int tileSize;
uniform usampler2D tileBuffer;
uniform float frameBufferHeight;

out vec4 FragColor;

flat in uint objectIndex;

void main()
{
    int x = int(gl_FragCoord.x) / tileSize;
    int y = int(frameBufferHeight - gl_FragCoord.y) / tileSize;

    int bitIndex = -1;
    int tileDataIndex = x * 33;
    int count = int(texelFetch(tileBuffer, ivec2(tileDataIndex, y), 0).x);
    int objectsListStartIndex = tileDataIndex + 1;
    for (int i = 0; i < count; ++i) {
        uint pixelObjectIndex = uint(texelFetch(tileBuffer, ivec2(objectsListStartIndex + i, y), 0).x);
        if (pixelObjectIndex == objectIndex) {
            bitIndex = i;
            break;
        }
    }

    if (bitIndex < 0) {
        FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    } else {
        uint outMask = uint(1 << bitIndex);
        float r = float(outMask & 255u) / 255.0;
        float g = float((outMask & 65280u) >> 8) / 255.0;
        float b = float((outMask & 16711680u) >> 16) / 255.0;
        float a = float((outMask & 4278190080u) >> 24) / 255.0;
        FragColor = vec4(r, g, b, a);
    }
}
```

At first, we're calculating the tile position the current fragment is in. Then fetching the size of the buffer of the tile
and start searching for the current object index in the buffer. The index of the object in the list will be the index of 
the corresponding bit. If the object index is found, we packing the mask in RGBA8 pixel using a bunch of bitwise operations.

## Optimization

Once the visibility buffer is rendered, we can optimize it before sending the data back to CPU side. Remember, that we have 
the buffer size equal to the size of the screen and since modern resolutions are quite high (4k+ in some cases) the amount
of data that needs to be transferred and processed on CPU is huge. What the optimization means? The visibility buffer contains 
visibility info of 32 objects per pixel - each bit of 32-bit integer could be either 0 (invisible) or 1 (visible). We also 
know that our tile have fixed size and it also can contain only 32 objects. Why not just collapse a bunch of pixels in each
tile into a single pixel? All we need to do is to apply `OR` logical operation for every pixel in a tile and essentially 
combine all of them into a single 32 bit unsigned integer. It could be done like so:

```c
uniform int tileSize;
uniform sampler2D visibilityBuffer;

out uint optimizedVisibilityMask;

void main()
{
    int tileX = int(gl_FragCoord.x);
    int tileY = int(gl_FragCoord.y);

    int beginX = tileX * tileSize;
    int beginY = tileY * tileSize;

    int endX = (tileX + 1) * tileSize;
    int endY = (tileY + 1) * tileSize;

    int visibilityMask = 0;
    for (int y = beginY; y < endY; ++y) {
        for (int x = beginX; x < endX; ++x) {
            ivec4 mask = ivec4(texelFetch(visibilityBuffer, ivec2(x, y), 0) * 255.0);
            visibilityMask |= (mask.a << 24) | (mask.b << 16) | (mask.g << 8) | mask.r;
        }
    }
    optimizedVisibilityMask = uint(visibilityMask);
}
```

`optimizedVisibilityMask` must be a `R32UI` texture and the `visibilityBuffer` is the full screen texture that was produced
by the previous step.

## Read the Results and Cache

The optimized visibility buffer can be transferred back to RAM using standard reading mechanism of your GAPI. All we need to do 
is to use that buffer to prepare the visibility cache.

Keep in mind, that we're always 1 frame behind and thus we must cache the results of visibility test somewhere, so it can be
used in the next frame. A good option is to use a hash map, but what if there's no visibility info for an object? In this
case it must be considered visible. It is needed because if an observer moves or rotates, some objects will inevitably get on
the screen and we must renderer them. Usually this is not an issue, because two adjacent frames keeps some level of coherency 
and in vast majority of cases it is more than 90%.

## Limitations and Possible Improvements

The described occlusion culling algorithm has some issues, but all of them aren't critical and could be solved:

1) In some cases 32 objects per pixel is not enough - this could lead to popping effects in distant objects when multiple
objects occupy the same tiles. This issue could be fixed in two major ways: either consider all the objects outside of the range
as visible, or add more precision. The first option could lead to redundant draw calls and thus may decrease performance.
The second option could be implemented in a few ways: either change pixel format to `RGBA16` and this will effectively double
the maximum amount of objects or add "depth peeling" and create 1 or more additional layers. These two approaches could 
be combined. There's no best approach - adding more layers or increasing precision will lead to higher memory usage and also
could lead to memory bandwidth pressure, which is an issue on low-end PCs and always an issue on mobile platforms. As a last
potential fix to this issue is to simply change the tile size, but keep in mind that it has its own downsides - too small tile
will lead to increased load of the CPU and too large will lead to even worse popping.
2) VRAM -> RAM data transfer - this always has some performance penalty, but it must be measured. If it overweighs the speedup 
of occlusion culling, then you could use the visibility buffer directly on GPU, but it could be done on modern hardware only. 