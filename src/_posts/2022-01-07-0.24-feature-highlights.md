---
title: "rg3d 0.24 Feature Highlights"
date: "2022-01-07"
subtitle: "I'm happy to announce that rg3d 0.24 has been released! This release has major improvements in 2D support, 
physics, user interface, performance, resource system, book, etc. Let's briefly go over the most significant 
changes and improvements."
categories: 
- General
---

I'm happy to announce that rg3d 0.24 has been released! This release has major improvements in 2D support, 
physics, user interface, performance, resource system, book, etc. Let's briefly go over the most significant 
changes and improvements.

## Improved 2D support

Since the very beginning, the engine was focused on 3D games only, but in rg3d 0.23 the situation has changed 
a bit, a simple version of 2D scene was added. However, in this version, 2D scenes were completely deleted
from the engine and 2D functionality was integrated in standard 3D scene. Now, to create 2D game you just 
need to change projection mode of your camera to orthographic and put some objects in standard 3D scene.
Here is the very simple 2D scene made in the editor and imported in a simple 2D game:

![2d scene](/assets/2d_scene.png)

This is the same scene, but in the editor:

![2d scene in editor](/assets/2d_scene_in_editor.png)

All visual objects here are sprites (rectangles in engine terms), sprites using heavily optimized renderer
so you can put thousands objects in the scene with very little performance impact. Since 2D is actually 3D,
you can use standard 3D objects to create 2D games world with 3D objects in them, this is very flexible
approach that allows you to mix various approaches to achieve desired results.

Standard lighting system works with 2D objects as well as with 3D, however 2D objects cannot cast shadows,
this will be improved in future releases:

![2d lighting](/assets/2d_lighting.png)

The engine now has full-featured 2D physics, here is a simple example with three dynamic boxes and static ground:

![2d physics](/assets/2d_physics.gif)

## Book

The engine now has [guide book](https://rg3d-book.github.io/). It is still in early development stage, but 
should help you to start using the engine. It covers basic aspects of the engine, describes how various parts
of the engine works, how they should be used. It also has four tutorials that will guide you through game
development process from start to finish.

## Physics integration

Physics entities (rigid bodies, colliders, joints) were integrated in scene graph, this means that you can 
link such objects as other scene nodes. Look closely at the editor screenshot above, as you can see there is
`Rigid Body 2D` node with `Rectangle` and `Collider 2D` nodes. Previously physics was standalone and scene
nodes were linked with the hacky "physics binder".

## Inspector and lightweight reflection

One of the major improvements in this version is the new lightweight reflection and the Inspector widget made
with it. Reflection means the access to object's properties in runtime, rg3d does this via `Inspect` trait
with proc-macro:

```rust
#[derive(Inspect)]
struct Foo {
   bar: String,
   baz: u32
}
```

Proc-macro will generate property definitions for every field (unless it is marked with `#[inspect(skip)]` 
attribute), which can be accessed at once using `.properties()` method of `Inspect` trait. Keep in mind
that since this is lightweight reflection, it does not let you mutate property value nor call methods and such
stuff, only read information about structure fields, enum variants, etc. This may sound too restrictive, but
on practice it is not. This reflection was made specifically for the editor needs. The new `Inspector` widget
utilizes its at full capacity:

![Inspector](/assets/inspector.png)

`Inspector` widget shows you all available fields of an object, it supports nested structures, arrays, vectors,
enumerations, custom property editors and many more. The editor uses it at 110% capacity :)

## Performance

0.23 introduced custom material system which was quite unoptimized and had a bit disappointing performance. This 
release fixes that and improves performance by 2.5x times. 

The UI layout system was heavily optimized too, some performance optimizations gave 1000x (this is **not** a
typo) boost on complex visual trees. rg3d-ui now depends on invalidation, instead of checking everything every
frame. Now it is capable of handling up to 100000 widgets at once without any significant performance loss.
This is especially important when you're editing large maps with thousands of objects on them.

## Resource management

rg3d slowly improving resource management, one of the major improvement in it is _import options files_. Previously
you have to specify _how_ to load textures, models, sounds, etc. from code, now import options were moved to 
`.options` files. Let's check a simple example: for example you want to change filtering from bilinear to blocky
for your 2D pixel game, you can make it like so (assuming you have `sprite.jpg` file)

```text
(
    minification_filter: Nearest,
    magnification_filter: Nearest,
    s_wrap_mode: Repeat,
    t_wrap_mode: Repeat,
    anisotropy: 1.0,
    compression: NoCompression,    
)
```

And save that to `sprite.jpg.options`, the engine will read this file and configure the texture accordingly. Every
field in options files is optional.  

The engine is now able to hot-reload textures, this is especially useful for making 2D games. The engine generates
mip-maps for textures using Lanczos filter, which gives you excellent results.

## Sound

Sound engine (rg3d-sound) has improved samples interpolation for cases when sample rate != 1.0, previuosly it
used simplest nearest interpolation, not it is linear which sounds much better and has must fewer harmonics.

This is the previous resampling algorithm for 1 kHz sine wave:

![Nearest resampling](/assets/nearest_resampling.png)

This is the new for the same signal:

![Linear resampling](/assets/linear_resampling.png)

As you can see the new algorithm produces much fewer harmonics.

## Miscellaneous

The editor repository was merged into engine's repository, this means that you no longer need to download both
projects to run the editor.

## Full list of major changes

- 2D games support (with 2D physics as well)
- Three new scene nodes was added: RigidBody, Collider, Joint. Since rigid body, collider and joint are graph nodes
  now, it is possible to have complex hierarchies built with them.
- It is possible to attach rigid body to any node in scene graph, its position now will be correct in this case (
  previously it was possible to have rigid bodies attached only on root scene nodes).
- New `Inspector` widget + tons of built-in property editors (with the ability to add custom editors)
- `Inspect` trait + proc macro for lightweight reflection
- UI now using dynamic dispatch allowing you to add custom nodes and messages easily
- rg3d-sound optimizations (30% faster)
- Linear interpolation for sound samples when sampling rate != 1.0 (much better quality than before)
- Color fields in material editor now editable
- Window client area is now correctly filled by the renderer on every OS, not just Windows.
- NumericRange removal (replaced with standard Range + extension trait)
- Sort files and directories in FileBrowser/FileSelector widgets
- RawStreaming data source for sound
- Renderer performance improvements (2.5x times faster)
- UI layout performance improvements
- Prevent renderer from eating gigabytes of RAM
- Use `#[inline]` attribute to enable cross-crate inlining
- `ImmutableString` for faster hashing of static strings
- `SparseBuffer` as a lightweight analog for `Pool` (non-generational version)
- Support diffuse color in FBX materials
- Frustum culling fixes for terrain
- Shaders don't print empty lines when compiles successfully.
- `Pool` improvements
- Impl `IntoIterator` for references to `Pool`
- Cascaded shadow maps for directional light sources
- `spawn_at` + `spawn_at_handle` for `Pool`
- Preview for drag'n'drop
- `Grid` widget layout performance optimizations (**1000x** performance improvement - this is not a typo)
- `query_component` for UI widgets
- Curve resource
- Remove all associated widgets of a widget when deleting the widget (do not leave dangling objects)
- World bounding box calculation fix
- Heavy usage of invalidation in UI routines (prevents checking tons of widgets every frame)
- Migrate to `parking-lot` synchronization primitives
- Migrate to `FxHash` (faster hashing)
- `Log::verify` to log errors of `Result<(), Error>`
- Custom scene node properties support
- `Alt+Click` prevents selection in `Tree` widget
- Ability to change camera projection (Perspective or Orthographic)
- Smart position selection for popups (prevents them from appearing outside screen bounds)
- High-quality mip-map generation using Lanczos filter.

## Editor improvements

Aside already mentioned Inspector, the editor now has an ability to search for scene items by their names:

![Editor search](/assets/editor_search.gif)

Asset browser now allows you to edit asset import options and hot-reload assets:

![Hot reload](/assets/hot_reload.gif)

Here is the full list of major changes:

- `Inspector` widget integration, which allowed to remove tons of boilerplate code
- Middle mouse button camera dragging
- Q/E + Space to move camera up/down
- Working directory message is much less confusing now
- Ability to edit sound sources in the editor
- Checkerboard colorization fix in the world viewer
- Search in the world viewer
- Floating brush panel for terrain editor
- Editor camera has manual exposure (not affected by auto-exposure)
- Curve editor
- Automatically select an newly created instance of a scene node
- Grid snapping fix
- Angle snapping
- Edit properties of multiple selected objects at once.
- Context menu for scene items in world viewer
- `Create child` for scene item context menu
- Import options editor for asset browser
- Hot reload for textures.

## Migration guide

It can be found in the [changelog](https://github.com/FyroxEngine/Fyrox/blob/master/CHANGELOG.md#breaking-changes-and-migration-guide).

## Support the project

If you like the project and want to see it alive, please consider doing either a monthly donation on 
[Patreon](https://www.patreon.com/mrdimas) or do a one-time donation via
[BuyMeACoffee](https://www.buymeacoffee.com/mrDIMAS). 

## Contributors

Huge thanks for [all the contributors](https://github.com/FyroxEngine/Fyrox/graphs/contributors) who helped to improve 
the engine!

## Community

[Join the Discord server](https://discord.gg/xENF5Uh)

## Special thanks

The engine is supported by very generous people, their donations provides sustainable development of the engine:

### Bronze patrons

[Brandon Thomas](https://www.patreon.com/user?u=34951681)  
[Taylor C. Richberger](https://www.patreon.com/user/creators?u=60141723)  

### Patrons

[Avery Wagar](https://www.patreon.com/user?u=41863848)
[George Atkinson](https://www.patreon.com/user?u=61771027)
[Erlend Sogge Heggen](https://www.patreon.com/amethystengine/creators)  
[Mitch Skinner](https://www.patreon.com/user/creators?u=60141723)  
[ozkriff](https://www.patreon.com/ozkriff)  
[Taylor Gerpheide](https://www.patreon.com/user/creators?u=32274918)  
[zrkn](https://www.patreon.com/user/creators?u=23413376)  
[Aleks Row](https://www.patreon.com/user/creators?u=51907853)  
[Edward L](https://www.patreon.com/user/creators?u=53507198)  
[L.apz](https://www.patreon.com/user/creators?u=5448832)  
[Luke Jones](https://www.patreon.com/flukejones)  
[toyboot4e](https://www.patreon.com/user/creators?u=53758973)  
[Vish Vadlamani](https://www.patreon.com/user/creators?u=42768509)  
[Alexey Kuznetsov](https://www.patreon.com/user?u=39375025)  
[Daniel Simon](https://www.patreon.com/user/creators?u=43754885)  
[Jesper Nordenberg](https://www.patreon.com/jesnor)  
[Kornel](https://www.patreon.com/user?u=59867)  
[Parham Gholami](https://www.patreon.com/user?u=33009238)  
[Yuki Ishii](https://www.patreon.com/user/creators?u=9564103)  
[Joseph Catrambone](https://www.patreon.com/user?u=4738580)  
[MGlolenstine](https://github.com/MGlolenstine)  
[zamar lomax](https://www.patreon.com/user?u=65928523)
[Gheorghe Ugrik](https://www.patreon.com/user?u=54846813)
[Anton Zelenin](https://www.patreon.com/user?u=62378966)
[Barugon](https://www.patreon.com/user?u=11344465)

### Former patrons

[Tom Leys](https://www.patreon.com/user?u=222856)
[Jay Sistar](https://www.patreon.com/user?u=284041)
[tc](https://www.patreon.com/user?u=11268466)  
[false](https://www.patreon.com/user?u=713537)  
[BlueSkye](https://www.patreon.com/EmotionalSnow)  
[Ben Anderson](https://www.patreon.com/user/creators?u=14436239)  
[Thomas](https://www.patreon.com/user?u=317826)
[Iulian Radu](https://www.patreon.com/user?u=8698230)
[Vitaliy (ArcticNoise) Chernyshev](https://www.patreon.com/user?u=2601918)  
