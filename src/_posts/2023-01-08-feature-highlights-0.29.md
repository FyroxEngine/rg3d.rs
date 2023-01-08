---
title: "Fyrox 0.29 Feature Highlights"
date: "2023-01-08"
description: "Fyrox 0.29 added new animation editor, reworked animation system and lots of smaller improvements."
categories: 
- General
---

I'm happy to announce that Fyrox 0.29 has been released! Fyrox is a modern game engine written in Rust, it helps
you to create 2D and 3D games with low effort using native editor. The safety and speed of Rust makes game 
development a true joy. Fyrox 0.29 now have reworked animation system, new animation editor and tons of smaller 
improvements and fixes.

## Animation System Rework

Animation system of the engine was reworked. So what's wrong with the animation system of the engine so it needs 
to be reworked? The core of it is fine, however the fact that all animations and animation blending state machines
(ABSM) were "living" in their own separate containers was adding a lot of headache when managing them. 

The next problem is that animations and ABSMs were stored as resources. This was complicating relations between scene
nodes they animate and actual animations. The most significant problem was animation copying. Imagine that you
have a character with a bunch of animations and a state machine that blends all these animations to get a final
pose. Before the rework, everything was stored in different places and to create an animation, you was needed to 
create a resource (or find one in the internet) and then instantiate it. The instance itself is responsible for 
actual animation, while resource is just holding key frames. Now you need to clone your character... and that's 
where you'd get a lot of troubles. At first: you need to copy character nodes, then you need to copy all respective
animations (remember - they were stored in a separate container), then you also need to copy the state machine. That's not 
all: next you need to ensure that animation copies works with respective node copies, the same must be done for 
state machines. As you can see, it is very tedious and error prone. 

What's the solution to these problems? Store animations and state machines in respective scene nodes. The engine
now has two new nodes:

- `AnimationPlayer` - this node is a container for animations, it can play the animations it contains and apply
them to the parent scene graph.
- `AnimationBlendingStateMachine` - this node is a container for a state machine that is used to blend multiple
animations into one. It uses specified `AnimationPlayer` node as a source of animations (it does not play any
animations itself).

Now to clone animated character all you need to do is to call `Graph::copy_node` and the rest of work will be 
done for you. The engine will copy `AnimationPlayer` and `AnimationBlendingStateMachine` nodes, remap handles
from originals to their respective copies. In addition, property inheritance will also work for these nodes,
which will allow you to create a prefab with all nodes and animations prepared and all its instances will sync
their state if the prefab is changed.

These two new nodes are now has respective editors, check the next sections for more info.

### Reflection-based Animation System

For a long time, animation system in the engine was capable to animate only position, rotation, and scale of
scene nodes. Now it's changed - you can animate pretty much any numeric property using reflection. Property
values are now stored using parametric curves to describe complex laws of change for the property. While 
reflection is good for generic cases, for efficiency, the engine uses special bindings for position, rotation, 
and scale because they're three most commonly animated properties.

## Animation Editor

![Editor](/assets/0.29/editor.png)

Animation Editor is a new editor that allows you to animate **any** numeric properties (`f32/f64/integers/
vectors/bool`) in any kind of scene nodes and scripts. It can also be used to create simple cut-scenes using
the engine. Here's how it looks in action:

![anim editor](/assets/0.29/anim_editor.gif)

The editor has three main parts: toolbar, track list and curve editor. Toolbar is used to create and edit 
animation properties. Track list is used to bind to properties of scene nodes. Curve editor allows you to
define how property values will change over time.

This article is already quite big, so learn more how to use the editor 
[here](https://fyrox-book.github.io/fyrox/animation/anim_editor.html).

## Animation Blending State Machine Editor

![Editor](/assets/0.29/absm_editor.png)

Animation blending state machine editor allows you to blend multiple animations into one. This is not new 
editor (it was available in [Fyrox 0.25](https://fyrox.rs/blog/post/feature-highlights-0-25/)), but it was
significantly reworked. It does not work with resources anymore (ABSM resource was removed), instead it works
directly on `AnimationBlendingStateMachine` scene nodes. It does not contain or play any animations itself, 
instead it uses animations from some animation player. This is how it looks in action:

![absm editor](/assets/0.29/absm_editor.gif)

Learn more how to use the editor [here](https://fyrox-book.github.io/fyrox/animation/absm_editor.html)

## Animation Layers

Animation blending state machine now support multiple layers. Each layer is has its own state machine inside 
and all layers blends into a final animation which is then applied to a model. Such layering allows you to animate 
parts of models independently. For example lower layer can contain running and idling animations, upper layer in 
its turn contains animations for aiming, running, idling. In such configuration you can get any combination of 
animations: running while aiming, idling while aiming, etc. This is how the animation works in most of modern games.

![layer mask](/assets/0.29/layer_mask.png)

To animate only specific nodes (bones in most cases), all you need to do is to specify layer mask. Layer mask is 
simply a hash set that allows the engine to quickly understand whether or not it is needed to animate a node. Layer
mask contains handles of nodes that won't be animated, it is just a sort of black-list. To fill a layer mask, you
need to click on "sink" icon and select all the nodes that needs to be excluded from the layer.

## Sprite Sheet Editor

![sprite sheet editor](/assets/0.29/sprite_sheet_editor.png)

Sprite sheet editor should help you to select desired frames for animation based on a series of frames, packed
into a single texture. Such animations are used in many 2D games, they're very cheap and quite easy to create.

In action the editor looks like so:

![sprite sheet editor in action](/assets/0.29/sprite_sheet.gif)

## Scene Settings

![scene settings](/assets/0.29/scene_settings.png)

It is now possible to edit scene settings, which includes physics (2D and 3D) integration parameters, ambient
lighting color, whether the scene is enabled or not and some more.

## Improved WebAssembly Support

Previously, WebAssembly builds suffered from tons of issues - starting from simple compile errors and ending 
with various runtime issues related to lack of blocking execution of async methods. Let's briefly highlight 
major issues that were fixed:

### Scene Loading

Lack of blocking execution of async methods was fixed in several ways. Scene loading is now done with 
`AsyncSceneLoader` which executes loading task differently depending on platform: on PC it just spawns a thread
and loads scene there. On WebAssembly it spawns a micro-task using `wasm_bindgen_futures` and it handles 
loading for us. To get a scene from the loader you should use `fetch_result` method, just call it each frame
(or with some other period) in your update loop. Here's a small code snippet that illustrates new approach to 
scene loading.

```rust
use std::path::Path;
use fyrox::event_loop::ControlFlow;
use fyrox::plugin::{Plugin, PluginContext};
use fyrox::scene::loader::AsyncSceneLoader;
use fyrox::utils::log::Log;

struct Game {
    loader: Option<AsyncSceneLoader>,
}

impl Game {
    // Step 1. Call this method once when you need to "kick off" scene loading.
    fn load_scene(&mut self, path: &Path, context: &mut PluginContext) {
        // Request asynchronous scene loading.
        self.loader = Some(AsyncSceneLoader::begin_loading(
            path.into(),
            context.serialization_context.clone(),
            context.resource_manager.clone(),
        ));
    }
    // Step 2. Call this method in your game loop to continuously check loading progress.
    fn check_loading_progress(&mut self, context: &mut PluginContext) {
        if let Some(loader) = self.loader.as_ref() {
            if let Some(result) = loader.fetch_result() {
                // Loading could end in either successfully loaded scene or some error.
                match result {
                    Ok(scene) => {
                        // Add the scene to the engine, so it will be included in engine processing pipeline.
                        context.scenes.add(scene);
                    }
                    Err(err) => Log::err(err),
                }
                // Discard the loader once it is finished its job.
                self.loader = None;
            }
        }
    }
}
impl Plugin for Game {
    fn update(&mut self, context: &mut PluginContext, _control_flow: &mut ControlFlow) {
        // Check whether the scene is loaded or not. While it is loading, we can show progress bar
        // or even loading screen with useful information.
        self.check_loading_progress(context)
    }
}
```

What's good about it is that scene loading is non-blocking, which means that you can show loading screen with some
progress bar and tips while the scene is loading.

### Resource Awaiting

The next major problem was the fact that you should wait until all resources are loaded before you run scripts logic.
Previously it was done by simple blocking execution and this was causing panic on WebAssembly. Now it is fixed, the
engine now checks if all pending resources were loaded and only if they're loaded, starts (or continues) scripts
update. This is not ideal solution, because some resources can be used later when they're loaded, but current solution
forces the engine to wait until all resource are loaded.

### WebAssembly Executor

There's more good stuff in this release - `fyrox-template` (a simple tool that generates game project and script
templates) is now able to generate separate version of executor for your game to create WebAssembly builds of 
your game almost effortlessly. Separate executor is needed because WebAssembly builds requires the crate to be 
`lib` type, while standard executor is `bin`. Also, WebAssembly executor adds custom panic hooks to print panic info
when your game panics.

WebAssembly deployment is also now much easier - you need to run `wasm-pack build --target web --release`, bundle 
produced binaries with some JS, HTML and add your game data folder to it and you're pretty much ready for deployment.

## Customizable Graph Update Pipeline

The engine now has a way to enable/disable steps of graph update pipeline, this includes: 3d physics, 2d physics, sound.
Also it is now possible to set a list of nodes for update, and when set - only the nodes from the list will be updated.
This customization mainly needed for the editor. The editor needs to have an ability to preview the result of updating
scene nodes (this includes preview for animations, particle systems, etc) and the changes made in the preview mode must 
never sneak into the edited scene.

## Reflection

`Inspect` trait's functionality was merged into `Reflect` trait, it is now possible to query fields metadata while
iterating over its fields:

```rust
use fyrox::core::reflect::prelude::*;

#[derive(Reflect, Debug)]
struct Foo {
    #[reflect(
        description = "A bar property. This attribute will be show in tooltip for the property in the Inspector",
        display_name = "Hello",
        min_value = 0.0,
        max_value = 100.0
    )]
    bar: u32,
    #[reflect(description = "Some other property.")]
    baz: String,
}

fn iterate_properties() {
    let foo = Foo {
        bar: 0,
        baz: "".to_owned(),
    };

    for (field, field_info) in foo.fields().iter().zip(foo.fields_info()) {
        println!(
            "Field name: {}\nDescription: {}\nValue: {:?}",
            field_info.name, field_info.description, field
        )
    }
}
```

## Ability to Enable/Disable Scene Nodes

The new feature allows you to completely disable scene nodes. Disabled scene nodes won't be updated and rendered, 
their scripts won't be updated too. Disabling some of the nodes (rigid bodies, colliders, sound sources) will result 
in less memory consumption, mainly because backend entities that backs the nodes will be removed. This feature could 
be used for optimizations. For example you can disable distant scene nodes, so they won't consume precious CPU and GPU 
resources.

## User Interface

User interface system of the engine has some major improvements too.

### `Copy Value as String` for Inspector

`Inspector` widget now allows you to copy property value as string. It uses the output of standard `Debug` trait. It 
is very useful for extracting data from fields that does not have any editable fields. For example you can copy contents 
of an array use it somewhere. To use the functionality, right-click on a property in the Inspector and click 
`Copy Value as String`.

### Curve Editor Improvements

Curve editor is a major part of the animation editor, it is used to define how value changes over time. In this
release it got an ability to zoom non-uniformly via shift or ctrl pressed during zooming. Also it got an ability 
to add zones for highlighting - this is useful when you need to visually highlight some zone. It is now possible 
to show values for different axes separately (for example, you might want to show only Y axis values). Grid size 
is now configurable too, as well as zoom limits. The other changes includes:

- Non-uniform zoom - allows you to zoom differently on different axes. Default binding is mouse wheel - it
changes the zoom uniformly as before. To zoom on X axis separately you need to hold `Shift` key while rotating
the wheel, to zoom on Y axis - hold `LeftCtrl`. This feature is important for cases where you have major
differences in values on different axes and you want to fit one axis while keep seeing the rest of the data.
- View bounds restriction - allows you to set a particular rectangle to restrict view position in the editor.
Its main usage is to restrict curve editing in the animation editor to right half-space with positive times 
(negative time have no meaning).
- `Zoom-to-fit` functionality is now works as intended, the bug was causing incorrect view positioning and 
zoom calculation.

### Windows

It is now possible to maximize UI windows by pressing rectangle sign at the top bar of the window. It behaves like
standard maximization functionality in many OSes.

### Other

`DropDownList` widget now correctly updates preview for selected item when changing its items. Previously you'd have
old preview for new items. 

`NumericUpDown` widget is now have an ability to change min, max, step and precision values at runtime using
respective messages.

`VectorImage` UI widget now supports two more primitives: `Rectangle` and `RectangleFilled` which can be used for some
specific cases. 

## Project Template Generator

`fyrox-template` (a small project generator) is now checks for reserved Rust keywords before trying to create a 
project. Previously an attempt to generate a project with a keyword as a name would result in crash in the tool. 
Also, the tool now prints much more user-friendly error messages.

## Node Selector Widget

![node selector](/assets/0.29/node_selector.png)

Node selector helps you to select a node in scene, it could be a node for `Handle<Node>` fields in your script,
or a node for some further actions (see below). You can find a node by its name, confirm or cancel selection via
respective buttons.

## Property Selector

![property selector](/assets/0.29/property_selector.png)

Property selector allows you to select a property path from any object that implements `Reflect` trait, it's
main usage is in new animation editor. The path then can be used to set a new value for a property the path 
leads to. The selector allows you to find a property by its name, config or cancel selection via respective 
buttons.

## Particle System Preview Mode

![particle system](/assets/0.29/particle_system.gif)

Particle Systems now does not update in the editor by default, only when selected. This saves CPU 
resources when editing large scenes and removes visual clutter. Also there's a new panel that allows you
to control preview behavior of particle systems (play, pause or stop).

## Smart Placement Mode for Move Gizmo

![smart move gizmo](/assets/0.29/smart_move_gizmo.gif)

Move Gizmo now have smart placement mode. It automatically follows the geometry under cursor and helps you place 
objects on top of some other objects.

## World Viewer

![world viewer](/assets/0.29/world_viewer.png)

World Viewer now has improved parenting (via drag'n'drop) - it now correctly re-parents the entire selection, 
instead of just a node being dragged. Breadcrumbs (flat path to a selected node) is now smaller and located
at the bottom of the world viewer; unlike before, they're now wraps in World Viewer's bounds and every 
breadcrumb is visible.

## Editable Key Bindings

![key bindings](/assets/0.29/key_bindings.png)

It is now possible to change editor controls in `File -> Editor Settings` window. Just click on a binding and 
press either a combination of keys on the keyboard or just a single key.

## Inspector

![type](/assets/0.29/type.png)

Inspector now shows the type of first selected entity. Type is provided by the reflection system, which just
wraps `std::any::type_name`.

## Book and Documentation

Animation system is now fully documented; a few usage examples were added. The code examples are quite large, 
and it is advised to use the editor all the time to create animations and animation blending state machines.

The [book](https://fyrox-book.github.io/) has some improvements too:

1) [Animation Editor Overview](https://fyrox-book.github.io/fyrox/animation/anim_editor.html)
2) [Animation Blending State Machine Overview](https://fyrox-book.github.io/fyrox/animation/absm_editor.html)
3) [Camera Picking](https://fyrox-book.github.io/fyrox/scene/camera_node.html#picking) - a way to select an object
by mouse in a scene.

## Other

Previously it was impossible to set sound status via editor's Inspector due to missing property editor for the `Status`
type, now it is fixed. Also, there was a chance, that at the moment of changing sound buffer of a sound source and 
setting a playback position the engine would panic, because of incorrect playback position. The reason why it might
happen is that sound buffer was set _after_ the playback position.

It is now possible to serialize `HashSet` using standard engine's serializer. 

## Side Projects

[Station Iapetus](https://github.com/mrDIMAS/StationIapetus) is sci-fi shooter that is built using the engine. Recently it was 
partially migrated to the reworked animation system. While it is still in very early development stage, it could be a good 
example of how to use the engine in a large project.

## Full List of Changes in Random Order

- Animation system rework.
- Animation Editor.
- Animation Blending State Machine Editor.
- Fixed potential crash when joint was initialized earlier than connected rigid bodies.
- Model instantiation scaling now used for prefab preview.
- Fixed lots of potential sources of panic in perspective and ortho projections.
- Fixed editor's camera movement speed setting for 3D mode.
- Standard "two-side" shader - useful for foliage and grass.
- Sprite sheet editor
- Support for `Vector(2/3/4)<f32/f64/u8/i8/u16/i16/u32/i32/u64/i64>` types in serializer.
- Sprite sheet animation now uses frames coordinates instead of explicit uv rectangles for each frame.
- Sprite sheet animation now has a texture associated with it.
- Fixed reflection fallback in case of missing field setter.
- Ability to set uv rect for Image widget
- Scene settings window for the editor - gives you an ability to edit scene settings: change 
physics integration parameters, ambient lighting color, various flags, etc.
- Prevent crash when adding a new surface to a Mesh node in the editor
- Fixed directory/file duplicates in file browser widget when double-clicking on an item.
- Show use count for materials in Inspector
- Replace `Arc<Mutex<Material>>` with `SharedMaterial` new-type.
- Ability to assign a unique copy of a material to an object.
- Replace `Arc<Mutex<Material>>` with `SurfaceSharedData`
- Clear collections before deserialization
- Property inheritance for collections
- Fixed incorrect material replacement when loading a scene with an FBX with custom materials.
- Added Blender material slots names in FBX loader
- Access to `procedural` flag for `SurfaceData`
- Property editor for mesh's surface data.
- Validation for scene nodes
  - Helps to find invalid cases like:
  - Missing joint bodies or invalid types of bodies (i.e. use 2d rigid body for 3d joint)
  - Wrongly attached colliders (not being a child of a rigid body)
  - Shows small exclamation mark if there's something wrong with a node
- Share tooltip across widgets on clone
- Fixed color picker: brightness-saturation grid wasn't visible
- Added support for Collider intersection check (kudos to [@Thomas Hauth](https://github.com/ThomasHauth))
- Animation system refactoring
  - Use curves for numeric properties.
  - Ability to animate arbitrary numeric properties via reflection.
- Prevent crash in case of invalid node handle in animation
- `Curve::value_at` optimization - 2x performance improvement of using binary search for spans.
- `Curve::add_key` optimized insertion using binary search.
- Node Selector widget - allows you to pick a node from a scene.
- Merge `Inspect` trait functionality into `Reflect` trait - it is now possible to obtain fields metadata
while iterating over them.
- Property Selector widget - allows you to pick a property path from an object that supports `Reflect` trait.
- `Reflect` implementation for `Uuid`
- `fyrox::gui::utils::make_cross` - small helper to create a vector image of a cross
- `FieldInfo::type_name` - allows to get type name of a field without using unstable 
`std::any::type_name_of_val`
- `PathVertex::g_score` penalty for A* pathfinding (kudos to [@cordain](https://github.com/Cordain))
- Added `Default`, `Debug`,`Clone` impls for `RawMesh`
- Name and uuid for `Curve`
- Send curve when adding new keys in the `CurveEditor` widget
- Preserve curve and keys id in the curve editor widget
- Correctly wrap `Audio Panel` in docking manager tile (kudos to [@iRaiko](https://github.com/iRaiko))
- `AsyncSceneLoader` - cross-platform (wasm included) asynchronous scene loader
- Added support for wasm in fyrox-template - now fyrox-template generates `executor-wasm` crate which is a special 
version of executor for webassembly
- Non-blocking resource waiting before processing scene scripts
- Added missing property editor for sound status
- Sync sound buffer first, then playback position
- Property editor for `Machine` type.
- Rectangle+RectangleFilled primitives for `VectorImage` widget
- Draw x values in curve editor widget at the top of the view
- Ability to show/hide axes values in the curve editor widget
- Use messages to modify view position and zoom in the curve editor (helps to catch the moment when zoom or view 
position changes)
- Fixed UI messages not being passed to plugins based on when they happened during frame (kudos to 
[@bolshoytoster](https://github.com/bolshoytoster))
- Ability to explicitly set animation time slice instead of length.
- Cloning a node now produces exact clone.
- Ability to set min, max values, step, precision for numericupdown widget
- Prevent panic when trying to iterate over pool items using reflection
- Split `Model::retarget_animations` in two separate methods
- Smart movement move for move gizmo (kudos to [@Zoltan Haindrich](https://github.com/kgyrtkirk))
- `Reflect::set_field_by_path`
- Ability to add zones for highlighting in the `CurveEditor`
- Ability to zoom non-uniformly via shift or ctrl pressed during zooming in the `CurveEditor` widget
- Animation signals rework
  - uuid instead of numeric identifier
  - added name for signals
  - removed getters/setters
  - added more signal management methods
- `Animation::pop_signal`
- Refactored animation blending state machine to support animation layers
- `Visit` impl for `HashSet`
- Ability to set layer mask in the absm editor
- Added animation system documentation.
- `Graph::try_get_of_type+try_get_mut_of_type`
- Rename `InheritableVariable` methods to remove ambiguity
- `Model::retarget_animations_to_player`
- Use correct property editor for `PoseWeight`
- Show handles of absm entities in the editor
- Show more info on absm nodes
  - PlayAnimation nodes shows name of the animation
  - blend nodes shows the amount of animations blended
- `AnimationContainer::find_by_name_ref/mut`
- Ability to search various animation entities by their names
- Add more information to panic messages in `fyrox-template` (kudos to [@lenscas](https://github.com/lenscas))
- Check for reserved names in `fyrox-template` (kudos to [@TheEggShark](https://github.com/TheEggShark))
- Ability to enable/disable scene nodes
- Basic support for headless mode for server part of games (kudos to [@martin-t](https://github.com/martin-t))
- Removed `Scene::remove_node`
- Rename `NodeTrait::clean_up` -> `NodeTrait::on_removed_from_graph`
- Fixed colorization in the world viewer
- Ability to disable steps of update pipeline of the graph
- Preview mode for animation player, animation blending state machine, particle system nodes.
- Rename colliding `ParticleSystem::set_enabled` method to `play`
- Particle system preview control panel
- Property editor for `Uuid` type.
- Restrict `Reflect` trait on `Debug`.
- Optional ability to `Copy Value as String` for properties in `Inspector` widget
- Pass animation signal name to animation event - makes much easier to respond to multiple animation events with the 
same name
- Ability to maximize ui windows
- `Animation::take_events`
- `Reflect::type_name`
- Show type name of selected object in the inspector
- Fixed multiple nodes parenting in the world viewer
- Apply grid snapping when instantiating a prefab
- Added range selection for tree widget (Shift + Click)
- Docking manager now collapses tiles when closing a docked window
- Improved search bar style in the world viewer
- Improved breadcrumbs in the world viewer
- `HotKey` + `KeyBinding` + respective property editors
- Ability to change editor controls.

## What's Next?

The next big feature will be adding Android support, it was requested [many times already](https://github.com/FyroxEngine/Fyrox/issues/175).
Animation editor still needs a dope sheet mode, animation system lacks root motion support which is a must-have feature
for more natural animation. As usual, the main "consumer" of new features are various games being made with the
engine. So the engine tries to fulfill the needs of practical game development, without "[yak shaving](https://en.wiktionary.org/wiki/yak_shaving)",
[bikeshedding](https://en.wiktionary.org/wiki/bikeshedding) and other useless stuff.

## Support

If you want to support the development of the project, click one of the links below. Preferable way is to use 
[Boosty](https://boosty.to/fyrox) - this way the money will be available for the development immediately. 
Alternatively you can can use [Patreon](https://www.patreon.com/mrdimas), but in this case the money will
be on-hold for unknown period of time ([details are here](https://github.com/FyroxEngine/Fyrox/issues/363)).

Also, you can help by fixing one of the ["good first issues" ](https://github.com/FyroxEngine/Fyrox/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22),
adding a desired feature to the engine, or making a contribution to the [book](https://github.com/fyrox-book)

