---
feature_text: |
  <div style="background-color:black;color:white;padding:4px;font-size:40px">Fyrox Game Engine</div>
  <div style="background-color:black;color:white;padding:4px;font-size:18px">A feature-rich and easy-to-use game engine written in the Rust programming language</div>  
feature_image: "assets/light.jpg"
excerpt: "A feature-rich and easy-to-use game engine written in the Rust programming language"
---

{% include button.html text="Github" icon="github" link="https://github.com/FyroxEngine/Fyrox" color="#0366d6" %} {% include button.html text="Join Discord" link="https://discord.com/invite/xENF5Uh" color="#0366d6" %} {% include button.html text="Sponsor ♥" link="https://www.patreon.com/mrdimas" color="#0366d6" %} {% include button.html text="Read The Book" link="https://fyrox-book.github.io/" icon="github" color="#0366d6" %} 

## Features

- **High quality volumetric lighting** (directional, point, spot) with soft shadows.
- **PC (Windows, Linux, macOS) and Web (WebAssembly)** support.
- **Deferred shading** - use tons of lights with small overhead.
- **Built-in save/load** - save or load entire state of the engine in one call.
- **Full-featured scene graph** with various nodes (pivot, camera, mesh, light, particle system, sprite).
- **High quality binaural sound** with Head-Related Transfer Function (HRTF) support.
- **Standalone scene editor** - make scenes in native engine format using the power of rusty-editor.
- **Advanced physics**: rigid bodies, rich set of various colliders, joints, ray casting, etc.
- **Advanced user interface** with lots of widgets, the editor is made using this UI.
- **Advanced animation system** with animation blending machines (similar to Mecanim) and animation retargetting.
- **Multi-camera rendering** - allows you to create picture-in-picture effects, make split-screen games
and more.
- **Async asset management** - load textures, models, sound buffers asynchronously and utilize all available CPU power.
- **Skinning** with flexible animation system.
- **Multiple scenes** support - allows you to have separate scenes for game menu, levels and so on.
- **Normal, parallax, environment** mapping - classic techniques that tremendously improves quality of graphics.
- **Level-of-detail (LOD)** support - allows you to change details of distant models to improve performance.
- **Screen-Space Ambient Occlusion** (SSAO) - add "volume" to your scenes at a low cost.
- **Fast Approximate AntiAliasing** (FXAA) - old, but good antialiasing.
- **Geometry instancing** - render lots of objects with low overhead.
- **Render in texture** - render scene in a texture and use it later in other scene.
- **Sky box** - add details for outdoor scenes.
- **Lightmap generator** - bake static lights into texture to improve runtime performance.
- **Particle systems** with soft particles - flexible particles system allows you to build complex effects.
- **Navmesh with `A*` pathfinder** - build navigation mesh for pathfinding and search paths on in.
- **FBX Loader** - allows you to load models of any complexity from industry-standard FBX format.
- **TTF/OTF fonts** support.
- **Support of various texture formats**, such as: png, jpg, dds (including compressed), tga, bmp, etc.
- **Powerful core library** with lots of commonly used algorithms.
- **Fast iterative compilation**: ~3 seconds in Debug, ~8 seconds in Release.
- **Lots of examples** covering various aspects of the engine.
- **Production ready** - it is possible to build almost any kind of game.
- **Documentation and tutorials** - it's easy start making your own game!
- **Hierarchical model resources** - combine multiple assets in prefabs and engine will do the rest of the work.

## [Fyroxed](https://github.com/FyroxEngine/Fyrox/tree/master/editor)

The engine comes with an editor: Fyroxed (**Fyrox** + **ed**itor) is a native scene editor for the Fyrox Game Engine.

![rusty_editor](assets/rusty_editor.jpg)

Timelapse of editing process:

<div class="video">
  <iframe src="https://www.youtube.com/embed/74VGnf69yDI" frameborder="0" allowfullscreen title="Timelapse"></iframe>
</div>

## Showcase

[Check online example!](./assets/webexample/index.html)

#### [Station Iapetus](https://github.com/mrDIMAS/StationIapetus)

A 3rd person shooter in a very early development phase. 
This is commercial project that will eventually be released on Steam.
Also, the project is meant to be proof that Fyrox Game Engine is ready for commercial production.

[![si](assets/station_iapetus_27_02_21_01.jpg)](https://github.com/mrDIMAS/StationIapetus)

Gameplay video:

<div class="video">
  <iframe src="https://www.youtube.com/embed/O_ETjSkVBME" frameborder="0" allowfullscreen title="Gameplay video"></iframe>
</div>

#### [rusty-shooter](https://github.com/mrDIMAS/rusty-shooter)

rusty-shooter is a first-person shooter, which is a big demo for the engine.

[![rusty_editor](assets/rusty_shooter.jpg)](https://github.com/mrDIMAS/rusty-shooter)

Gameplay video:

<div class="video">
  <iframe src="https://www.youtube.com/embed/UDn8ymyXPcI" frameborder="0" allowfullscreen title="Gameplay video"></iframe>
</div>

## [Learning materials](https://fyrox-book.github.io/)

[Read the official Fyrox book here.](https://fyrox-book.github.io/) It is in early development stage, but it should
help you start using the engine, also the book contains a series of tutorials that should help you to create your
first game.

## Examples

Fyrox has lots of examples covering various aspects of the engine, they can be found
[here](https://github.com/FyroxEngine/Fyrox/tree/master/examples)

<style type="text/css">
	.wrapper {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-column-gap: 10px;
		grid-row-gap: 10px;
		border-radius: 5px;
		grid-auto-rows: 200px;
	}
	.inner {
		display: grid;
		border-radius: 5px;
		background: #73AD21;
	}
	.cell {
		display: grid;
		padding: 2px;
		text-align: center;
	}
	.round_image {
		border-radius: 5px;
	}
</style>

<div class="wrapper">
   <div class="inner">
		<div class="cell">
			<a href="https://github.com/FyroxEngine/Fyrox/blob/master/examples/simple.rs">
				<img class="round_image" src="assets/example01.jpg"/>
			</a>
		</div>
		<div class="cell">Simple Scene</div>  
   </div>
   <div class="inner">
		<div class="cell">
			<a href="https://github.com/FyroxEngine/Fyrox/blob/master/examples/async.rs">
				<img class="round_image" src="assets/example02.jpg"/>
			</a>
		</div>
		<div class="cell">Async Loading</div>  
   </div>
   <div class="inner">
		<div class="cell">
			<a href="https://github.com/FyroxEngine/Fyrox/blob/master/examples/3rd_person.rs">
				<img class="round_image" src="assets/example03.jpg"/>
			</a>
		</div>
		<div class="cell">Walking Simulator</div>  
	</div>
	<div class="inner">
		<div class="cell">
			<a href="https://github.com/FyroxEngine/Fyrox/blob/master/examples/ui.rs">
				<img class="round_image" src="assets/example04.jpg"/>
			</a>
		</div>
		<div class="cell">User Interface</div>  
	</div>
	<div class="inner">
		<div class="cell">
			<a href="https://github.com/FyroxEngine/Fyrox/blob/master/examples/scene.rs">
				<img class="round_image" src="assets/example05.jpg"/>
			</a>
		</div>
		<div class="cell">Scene</div>  
	</div>
	<div class="inner">
		<div class="cell">
			<a href="https://github.com/FyroxEngine/Fyrox/blob/master/examples/lightmap.rs">
				<img class="round_image" src="assets/example06.jpg"/>
			</a>
		</div>
		<div class="cell">Lightmap</div>  
	</div>
	<div class="inner">
		<div class="cell">
			<a href="https://github.com/FyroxEngine/Fyrox/blob/master/examples/instancing.rs">
				<img class="round_image" src="assets/example07.jpg"/>
			</a>
		</div>
		<div class="cell">Instancing</div>  
	</div>
		<div class="inner">
		<div class="cell">
			<a href="https://github.com/FyroxEngine/Fyrox/blob/master/examples/lod.rs">
				<img class="round_image" src="assets/example08.jpg"/>
			</a>
		</div>
		<div class="cell">Level of detail</div>  
	</div>
</div>

## Sponsors

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

## About

The engine was created in the January 2019 as a hobby project to learn Rust.
