---
feature_text: |
  <div style="background-color:black;color:white;padding:5px;font-size:40px">RG3D</div>
  <div style="background-color:black;color:white;padding:5px">A feature-rich and easy-to-use game engine written in Rust programming language</div>  
feature_image: "assets/light.png"
excerpt: "A feature-rich and easy-to-use game engine written in Rust programming language"
---

{% include button.html text="View on Github" icon="github" link="https://github.com/mrDIMAS/rg3d" color="#0366d6" %} {% include button.html text="Join Discord" link="https://discord.gg/nGhjVBU9" color="#0366d6" %} {% include button.html text="Sponsor ♥" link="https://www.patreon.com/mrdimas" color="#0366d6" %} 

## Features

- **High quality volumetric lighting** (directional, point, spot) with soft shadows.
- **Built-in save/load** - save or load entire state of the engine in one call.
- **Full-featured scene graph** with various nodes (pivot, camera, mesh, light, particle system, sprite).
- **High quality binaural sound** with Head-Related Transfer Function (HRTF) support.
- **Standalone scene editor** - make scenes in native engine format.
- **Multi-camera rendering** - allows you to create picture-in-picture effects, make split-screen games
and so on.
- **Skinning** with flexible animation system.
- **Multiple scenes** support - allows you to have separate scenes for game menu, levels and so on.
- **Normal and environment** mapping.
- **Level-of-detail (LOD)** support - allows you to change details of distant models to improve performance.
- **Screen-Space Ambient Occlusion** (SSAO).
- **Geometry instancing** - render lots of objects without any overhead.
- **Render in texture** - each scene can be rendered into separate texture which, for example, allows you to build "screens" in your game.
- **Sky box** - add details for outdoor scenes.
- **Lightmap generator** - bake static lights into texture to improve runtime performance.
- **Particle systems** with soft particles - flexible particles system allows you to build complex effects.
- **Navmesh with `A*` pathfinder** - build navigation mesh for pathfinding and search paths on in.
- **FBX Loader** - allows you to load models of any complexity from industry-standard FBX format.
- **TTF/OTF fonts** support.
- **Support of various texture formats**, such as: png, jpg, dds (including compressed), tga, bmp, etc.
- **Advanced user interface** with lots of widgets.
- **Advanced animation system** with animation blending machines (similar to Mecanim) and animation retargetting.
- **Async asset management** (textures, models, sound buffers).
- **Advanced physics**: rigid bodies, rich set of various colliders, joints, ray casting, etc.
- **Powerful core library** with lots of commonly used algorithms.
- **Fast iterative compilation**: ~3 seconds in Debug, ~8 seconds in Release.
- **Lots of examples** covering various aspects of the engine.
- **Production ready** - it is possible to build almost any kind of game.
- **Documentation**

## [rusty-editor](https://github.com/mrDIMAS/rusty-editor)

rusty-editor is a native scene editor for the rg3d game engine.

![rusty_editor](assets/rusty_editor.png)

## Showcase

#### [rusty-shooter](https://github.com/mrDIMAS/rusty-shooter)

rusty-shooter is a first-person shooter, which is a big demo for the engine.

[![rusty_editor](assets/rusty_shooter.jpg)](https://github.com/mrDIMAS/rusty-shooter)

Gameplay video

{% include video.html id="UDn8ymyXPcI" title="Gameplay video" %}

## Examples

rg3d has lots of examples covering various aspects of the engine, they can be found [here](https://github.com/mrDIMAS/rg3d/tree/master/examples)