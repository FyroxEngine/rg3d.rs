---
title: "Fyrox Game Engine 0.32"
date: "2023-10-25"
description: "Fyrox 0.32 includes lots of editor improvements, graphics improvements, quality-of-life improvements, documentation and book improvements, overall usability improvements, bug fixes and more."
categories: 
- General
meta:
  - property: og:title
    content: Fyrox Game Engine 0.32
  - property: og:description
    content: Fyrox 0.32 includes lots of editor improvements, graphics improvements, quality-of-life improvements, documentation and book improvements, overall usability improvements, bug fixes and more.
  - property: og:type
    content: article
  - property: og:url
    content: https://fyrox.rs/blog/post/fyrox-game-engine-0-32/
  - property: og:image
    content: https://fyrox.rs/assets/0.32/camera.gif
---

I'm happy to announce that Fyrox 0.32 has been released! Fyrox is a modern game engine written in Rust, it helps
you to create 2D and 3D games with low effort using native editor; it is like Unity, but in Rust. This release includes
lots of editor improvements, graphics improvements, quality-of-life improvements, documentation and book improvements, 
overall usability improvements, bug fixes and more. 

## How to Update

At first, update the `fyrox-template` by using `cargo install fyrox-template --force` and then execute the following
command in your project root directory: `fyrox-template upgrade --version=latest`.

## Scene Loading

In the previous version of the engine, you have to load scenes manually using an instance of `AsyncSceneLoader` and 
this was quite confusing. Now it is changed - scene loading is now managed by the engine and game plugins now have
three methods: `on_scene_begin_loading`, `on_scene_loaded`, `on_scene_loading_failed`. All these methods have 
self-descriptive names. To load a scene all you need to do is to request it in the loader:

```rust
pub struct Game {
    scene: Handle<Scene>,
}

impl Game {
    pub fn new(scene_path: Option<&str>, context: PluginContext) -> Self {
        // Request a new scene.
        context
            .async_scene_loader
            .request(scene_path.unwrap_or("data/scene.rgs"));

        Self {
            scene: Handle::NONE,
        }
    }
}

impl Plugin for Game {
    fn on_scene_begin_loading(&mut self, path: &Path, context: &mut PluginContext) {
        // Remove previous one (if any).
        if self.scene.is_some() {
            context.scenes.remove(self.scene);
        }
    }

    fn on_scene_loaded(
        &mut self,
        path: &Path,
        scene: Handle<Scene>,
        data: &[u8],
        context: &mut PluginContext,
    ) {
        self.scene = scene;
    }
}
```

As you can see, current approach is much cleaner than previous and less bug-prone.

## Standard Scripts

Fyrox now offers a library (`fyrox-scripts`) with a set of standard scripts. For now there's only one script for flying 
camera controller, which is used in variety of examples, however the amount will be increased over time. If you have
any game-ready script, you can create a pull request on GitHub. 

## Editor Improvements

The editor has lots of improvements in this release.

### Power-Saving Mode

For a long time the editor was always active, no matter if you use it or not, even when minimized it was consuming heaps
of CPU and GPU resources. Now it is changed and the editor is "sleeping" most of the time, it activates only to process
your actions. This mode is especially useful for laptop users to prevent them from overheating and sound like a turbine.

### Orbital Camera

![camera](/assets/0.32/camera.gif)

Orbital camera rotation is very helpful to look at an object at different angles. Previously it was quite tedious to
do so: you need to use WSAD keys, hold right mouse button and fly around the object. Orbital camera rotation by default
bound to middle mouse button (can be changed in the editor settings).

### Improved Searching

Searching the in the World Viewer is now fuzzy, search query does not need to be exact. It makes the search less 
confusing. 

### Node Handle Property Editor

![node handle](/assets/0.32/node_handle.png)

Node handle property editor now has an ability to select a node handle using node selector (green button), which seems
to be less confusing that the assignment via drag'n'drop from the world viewer. Also, it now has `Make Unassigned` button
(red one), which can be used to make the handle unassigned. The last two buttons are used to locate the object in the
world viewer and to select it respectively.

### Ragdoll

![ragdoll](/assets/0.32/ragdoll.png)

The editor offers a new ragdoll wizard that could be used to create ragdolls with just a few clicks. Currently, 
autofilling of it works only with 3D models from mixamo.com. Check the following video see how it works:

<YtVideo url="https://www.youtube.com/embed/TxSlqGhCxYc" />

### Scene Gizmo

![scene gizmo](/assets/0.32/scene_gizmo.gif)

Scene gizmo is used to show current camera orientation and to quickly switch between various point of views (as well
as projection mode). 

### Terrain Editor Hotkeys

Terrain editor now has a bunch of useful shortcuts to activate various drawing modes and to change brush options. By
default, the hotkeys are the following:

- `F1` - switch to height map drawing mode.
- `F2` - switch to mask drawing mode.
- `F3` - switch to slope flattening mode.
- `[` and `]` - decrease and increase brush size.
- `;` and `'` - decrease and increase brush opacity.
- `,` and `.` - switch to previous/next layer.

### Curve Property Editor

![curve editor](/assets/0.32/curve_editor.png)

It is now possible to edit `foo: Curve` fields in the inspector. It could be useful to create complex laws of change
for some processes in your game. For example, the curves on the screenshot above are used to define acceleration and
deceleration laws.

### Node Deletion Dialog

![node deletion](/assets/0.32/node_deletion.png)

The editor now checks if a node that is about to be deleted is referenced in some other scene nodes or scripts. This is
useful to prevent accidental deletion of something that is currently in use.

### Resource Field

![show in asset browser](/assets/0.32/show_in_ab.gif)

Resource property editors now have a special button, that shows the currently selected resource in the Asset Browser.
This change could save an extra clicks when you need to find an asset and change its import options.

### Lightmaps

![light map](/assets/0.32/lightmap.png)

Lightmap generation in the editor is now asynchronous, which does not hang the main thread, instead it shows a progress
bar and allows you to cancel the generation. 

### Other

The editor now saves the collapsed/expanded state of scene nodes in the world viewer. It is now impossible to open a
scene multiple times - instead of loading it, the editor will show its tab in the scene preview. Only currently active
scene will be updated in preview mode.

## Saved Games

Fyrox now has a "standard" way of managing saved games, which allows you to create save files in a few lines of code and
load them in a single line. Check the [respective chapter](https://fyrox-book.github.io/fyrox/serialization/save.html) 
in the book to learn more.

## UI

It is now possible to close tabs in `TabControl` widget using middle mouse button. Added context menu to the file 
browser to be able to create folders and remove files.

## Sound

Sound system of the engine has some improvements and fixes as well. It is now possible to fetch duration of sound
buffer, and it is now infallible (previously it could return `None` for some decoders). HRIRs are now resources,
and can be loaded via standard resource manager. The new method `Sound::try_play` will only play the sound if it is not 
already playing. HRTF renderer is now taking sound source gain into account (previously only 2D part was using gain).

## Resource Management

Textures now have `Flip green channel` option in import options: this adds an ability to flip green channels for
normal maps made in OpenGL Y+ format.

Hardcoded list of supported resource extensions was removed from the asset browser, and now it uses a list of extensions
from resource loaders. This allows the asset browser to show custom resources.

Non-modified inheritable variables now do not save their info, which saves heaps of disk space in derived assets.

## Rendering

This release contains major fixes for the rendering in the engine. For a long time, binormal vector of TBN basis 
was calculated incorrectly, thus leading to some weird lighting artifacts. The book has a 
[separate chapter](https://fyrox-book.github.io/fyrox/rendering/normal_maps.html) about normal maps used in the engine.

Parallax mapping is also fixed in this release, it includes two additional properties for standard materials -
`parallaxCenter` and `parallaxScale`. `parallaxCenter` defines a baseline value that is used as zero and `parallaxScale`
defines "strength" of the parallax.

Shadows now does not pop up out of nowhere, instead they're slowly fading in and out. This solves annoying graphical 
artifacts, which previously could be solved only by increasing shadow rendering distance which in its turn led to 
worse performance.

Previous versions of the engine had a bug with texture compression - mip levels weren't correctly compressed, which
led to graphical artifacts. This is now fixed as well.

Camera scene node now has built-in skybox which replaces the black void that was previously "used". Light scattering 
shader now takes light intensity into account. Deferred lighting shaders correctly transfers frame alpha, which fixes
rendering with transparent background.

## Reflection

There are some improvements in the reflection system. The new method `Reflect::enumerate_fields_recursively` allows you 
to iterate over descendant fields of an object while getting info about each field. Another new method 
`Reflect::apply_recursively` for recursive iteration over the descendant fields of an object.

## Examples

Engine examples from `examples` directory are now considered obsolete and were removed. They're now replaced with 
[new examples](https://github.com/FyroxEngine/Fyrox-demo-projects). You can also run all examples in your web-browser
from the [examples page](https://fyrox.rs/examples.html) on the website.

## Documentation Improvements

This release contains lots of documentation improvements. This is mostly related to the UI docs, however some of the
other parts of the engine were documented too. In total, more than 20 widgets and scene entities were fully documented
with code examples.

## Book Improvements

The book was improved as well. It also includes chapters for various UI widgets, ragdoll wizard, saved games, 
proofreading, corrections, removal of outdated information and more.

## Tutorials

RPG tutorial was updated to the latest version of the engine. You can find it 
[here](https://fyrox-book.github.io/fyrox/tutorials/rpg/tutorial-1/tutorial-part-1.html).

## Full List of Changes in Random Order

- Do not call `Script::on_os_event` if script is not started yet.
- Borrow instead of move in `Visitor::load_from_memory`.
- Ability to load scenes in two modes - derived and raw.
- Fixed selection issues in the animation editor.
- Fixed path fixer.
- Ability to set resource path.
- `ResourceManager::unregister` to unregister loaded resources.
- Refactored scene loading + plugin interface improvements.
- Bring currently selected node into view when clearing filter in the world viewer.
- Fixed searching in the property selector.
- Bring current selection into view in node selector when clearing filter text.
- Fixed `zoom to fit` in the curve editor when there's no keys.
- Fixed node name formatting in the animation editor's track list.
- Fixed tooltips in the inspector.
- `EditorPlugin::on_post_update` that invoked after any other update methods.
- Fixed selection syncing in node selector.
- `TreeRootMessage::ItemsChanged` to catch the moment when tree root items changes.
- Improved visual style of node handle property editor.
- Ability to set scene node handle via node selector.
- `Sound::try_play` method that will only play the sound if it is not already playing.
- `Flip green channel` option for texture import options: this adds an ability to flip green channels for
  normal maps made in OpenGL Y+ format.
- Resource manager improvements: added base trait with auto-implementation to reduce boilerplate code, mandatory
  `ResourceLoader::data_type_uuid` method to fetch actual data type produced by resource loader,
  `ResourceManager::try_request` - returns an optional resource handle, returns `None` if `T` does not match the
  actual data id (`request` just panics in this case).
- Print an error message to the log when unable to load a resource.
- Resource field property editor improvements: emit transparent geometry to improve mouse picking,
  added margins for elements.
- Exposed resource manager reference to plugin registration context to be able to register custom resource
  loaders that will be used in both the game and the editor.
- `Material::sync_to_shader` method to sync material properties with its shader.
- `parallaxCenter` + `parallaxScale` property for standard shaders.
- Fixed TBN-basis visualization in mesh debug drawing.
- Make all gizmo's X axis match the actual coordinate system's X axis.
- Fixed tooltip in asset browser to show full path without clipping.
- Fixed parallax mapping.
- Fixed binormal vector calculation.
- Added missing `tif` extension for texture loader.
- Fixed build window output in the editor.
- Added fade in/fade out for shadows, that prevents them from popping out of nowhere.
- Added scene gizmo.
- Keep frame alpha when applying lighting for transparent background rendering.
- Rewind sound sources before stopping them.
- Improved camera focusing on a scene object.
- Changed orbital camera controls: drag camera was moved to `Shift+RMB`, added configurable zoom range.
- Added orbital camera mode for editor camera (can be activated by middle mouse button).
- Use `f32` instead of `Duration` for scene sound source's playback time.
- Fixed terrain brush bounds visualization.
- Hotkeys for terrain editor.
- Use `workspace.dependencies` in the projects generated by `fyrox-template` to simplify dependency change.
- Improved editor settings handling.
- `Curve::bounds` + ability to `Zoom to fit` with delay for the curve editor.
- Property editor for `Curve` fields.
- New `fyrox-scripts` crate + flying camera controller script.
- Ability to map ui key back to winit + change key binding property editor.
- Fallback to root directory if `fyrox-template script` cant find `game/src`.
- Added debug impls for gpu texture.
- Fixed seams between terrain chunks.
- Removed obsolete examples and replaced them with [new examples](https://github.com/FyroxEngine/Fyrox-demo-projects).
- Fixed curve editor compatibility with scrolling regions.
- Fixed clipping issues in curve editor.
- Save expanded state of the scene items in the world viewer in the editor settings.
- Fixed invalid keys positioning in the curve editor when selecting them.
- Fixed box selection in the curve editor when mouse is outside.
- Focus currently selected entity when clearing filter text in animation editor.
- Fixed a bunch of potential crashes in the `CurveEditor` widget.
- Fixed HiDPI issues on WebAssembly.
- Removed hardcoded list of supported resource extensions from the editor and use ones from resource loaders.
- `Hrir` resource + async HRTF loading for HRTF sound renderer.
- Fixed texture compression.
- Do not use `glCheckError` in release builds since it has bad performance.
- Set nearest filtration for floating-point textures in the renderer (WebAssembly fix).
- Switch a resource without a loader into error state to prevent infinite loading in some cases.
- Fixed resource loading in WebAssembly.
- Do not render anything if screen size is collapsed into a point.
- Split light map generation in two steps + added async generation for the editor.
- Do not allow to create game projects with a number in beginning of its name.
- Optimized light map data serialization (breaking change, regenerate your lightmaps).
- `BinaryBlob` wrapper to serialize arbitrary sets of data as bytes.
- Print an error to the log instead crashing when unable to generate a lightmap.
- Moved light map into `Graph` from `Scene`.
- Fixed light map internal handles mapping when copying a graph.
- `PathEditor` widget + property editor for `PathBuf` for Inspector.
- Reduce default amount of texels per unit for lightmapper in the editor.
- Ability to specify vcs for a new project in `fyrox-template`
- Set `resolver = 2` for workspaces generated by `fyrox-template`
- Improved joints computational stability.
- `Make Unassigned` button for node handle property editor.
- Do not save invalid window attributes of the main editor window.
- Fixed joints binding.
- Joint rebinding is now optional.
- Fixed potential infinite loop when constructing quaternion from a matrix.
- Ability to set custom name to group command in the editor.
- `Ragdoll` scene node.
- Improved mouse picking for node handle property editor.
- Ragdoll wizard to create ragdolls with a few clicks.
- Power-saving mode for the editor. Editor pauses its execution if its window is unfocused or there's no OS events
  from the main window. This change reduces CPU/GPU resources consumption down to zero when the editor is non-active.
- Do not create a separate region for inheritable variables on serialization if non-modified. This saves quite a
  lot of disk space in derived assets (including saved games).
- Property editors for inheritable vec collections of resources.
- Clamp input time to the actual duration of the buffer when setting sound source's playback time.
- Fixed inability to fetch stream length of ogg/vorbis.
- `GenericBuffer::duration` is now using integer arithmetics which does not suffer from precision
  issues (unlike floating point numbers).
- Decoders now returns channel duration in samples, not in seconds.
- Send text box message on changes only if its commit mode is immediate.
- Fixed severity for messages from inability to load editor settings.
- Added vec property editors for collections of resources.
- Property editor for `Vec<T>` will now use appropriate property editor for `T` instead of implicit usage
  of `InspectablePropertyEditor`.
- Fixed incorrect focusing of an asset in the asset browser.
- Fixed emitted message direction for `TextBox` widget.
- `Show in Asset Browser` button for resource fields in the inspector.
- Take sound source gain into account when using HRTF renderer.
- Fixed visualization of bones list of a surface in the editor.
- Reduced HRTF sound renderer latency.
- Fixed animation events collection for blend-by-index ABSM nodes.
- Improved ABSM events collection API.
- Ability to fetch animation events from ABSM layers.
- Fixed property reversion: now it reverts only modified ones.
- Ability to revert all inheritable properties at once of a scene node.
- `Reflect::enumerate_fields_recursively` allows you to iterate over descendant fields of an object
  while getting info about each field.
- Update only currently active scene in the editor.
- Navmesh path smoothing improvements and fixes. Prevent smoothing from cutting corners.
- `A*` path finder API improvements.
- Debug drawing for NavMesh scene node.
- Light scattering now takes light intensity into account.
- Prevent loading the same scene multiple times.
- Clear UI in the editor when changing scenes to prevent potential visual desync.
- Fixed potential panic when handling UI messages with invalid target widget handle.
- Fixed doubling of the text when printing text in `TextBox` widget on some platforms.
- Ability to duplicate animation tracks in the animation editor.
- Ability to set an ID of animation tracks.
- Fixed potential panic on invalid handles of `Rapier` entities when fetching contacts.
- Ability to close tabs in `TabControl` widget using middle mouse button.
- Visualize directional lights as arrows in the editor.
- Ability to draw arrows in scene debug drawing context.
- Migrated to `winit 0.29`.
- Fixed `Rect::clip_by` method.
- Removed `VecExtensions` trait, because its functionality was already added in the standard library.
- `Popup` widget improvements: `Placement::target` method, ability to create popups without adding them
  to the UI.
- Fixed potential infinite loop in the `Menu` widget.
- Added context menu to the file browser to be able to create folders and remove files.
- Significantly improved test coverage for `fyrox-core` and `fyrox-resource` crates (kudos to
  [@san-smith](https://github.com/san-smith))
- Optional node deletion dialog to warn if a node is referenced somewhere in the graph.
- Fixed potential double free issue in the vertex buffer.
- Fixed unsoundness of type-erasure in the vertex buffer.
- `Graph::find_references_to` to search for node references in the graph.
- `Reflect::apply_recursively` for recursive iteration over the descendant fields of an object.
- Added `try` reserved keyword for `fyrox-template`.
- Built-in sky box for `Camera` scene node.
- Improved search in the World Viewer.
- Make `TriangleDefinition` trivially-copyable.
- Major UI documentation improvements.
- Docs for `VectorImage`, `ScrollPanel`, `RectEditor`, `RangeEditor`, `ProgressBar`, `ListView`, `Canvas`,
  `SearchBar`, `ScrollViewer`, `Expander`, `KeyBindingEditor`, `HotKeyEditor`, `Tree`, widgets.
- Major book improvements.

## Support

If you want to support the development of the project, click one of the links below. Preferable way is to use 
[Boosty](https://boosty.to/fyrox) - this way the money will be available for the development immediately. 
Alternatively you can use [Patreon](https://www.patreon.com/mrdimas), but in this case the money will
be on-hold for unknown period of time ([details are here](https://github.com/FyroxEngine/Fyrox/issues/363)).

Also, you can help by fixing one of the ["good first issues" ](https://github.com/FyroxEngine/Fyrox/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22),
adding a desired feature to the engine, or making a contribution to the [book](https://github.com/fyrox-book)