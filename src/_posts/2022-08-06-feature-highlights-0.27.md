---
title: "Fyrox 0.27 Feature Highlights"
date: "2022-08-06"
description: "Fyrox 0.27 is a big release, that contains lots of improvements for existing functionality that makes game development much more comfortable."
categories: 
- General
---

I'm happy to announce that Fyrox 0.27 has been released! Fyrox is a modern game engine written in Rust, it helps
you to create 2D and 3D games with low effort using native editor. This release contains lots of improvements for 
existing functionality that makes game development much more comfortable. The list of changes is quite big, so let's get
started!

## Fish Folly

Before we start on "boring" text, take a look at this video, it captured from the new project based on the 
engine - [Fish Folly](https://github.com/mrDIMAS/FishFolly):

<YtVideo url="https://www.youtube.com/embed/RuoLInE34dM" />

Fish Folly is a 3D platformer that uses latest engine features at full capacity, it may be very helpful to learn how to build
relatively large game with scripts and plugins.

## Compile-Time Reflection

[@toyboot4e](https://github.com/toyboot4e) and [@mrDIMAS](https://github.com/mrDIMAS) implemented compile time reflection.
Reflection allows you to modify object properties using a value and name of a property. It's most common usage is to
build various editors, that allows you to change properties from GUI. Let's look at the code which should clarify
everything:

```rust
use fyrox::core::reflect::{Reflect, ResolvePath};

#[derive(Reflect)]
struct Foobar {
    abc: u8,
}

#[derive(Reflect)]
struct Bar {
    baz: u32,
    vec: Vec<Foobar>,
    array: [Foobar; 2],
}

#[derive(Reflect)]
struct Foo {
    foobar: f32,
    bar: Bar,
}

fn reflection() {
    let mut foo = Foo {
        foobar: 1.23,
        bar: Bar {
            baz: 123,
            vec: vec![Foobar { abc: 64 }],
            array: [Foobar { abc: 16 }, Foobar { abc: 8 }],
        },
    };

    // 1. Reading fields by path:
    assert_eq!(foo.get_resolve_path::<f32>("foobar"), Ok(&1.23));
    assert_eq!(foo.get_resolve_path::<u32>("bar.baz"), Ok(&123));

    // 2. Modifying fields by path:
    *foo.get_resolve_path_mut::<f32>("foobar").unwrap() = 3.21;
    *foo.get_resolve_path_mut::<u32>("bar.baz").unwrap() = 321;
    assert_eq!(foo.foobar, 3.21);
    assert_eq!(foo.bar.baz, 321);

    // 3. Access collections:
    assert_eq!(foo.get_resolve_path::<u8>("bar.vec[0].abc"), Ok(&64));
    assert_eq!(foo.get_resolve_path::<u8>("bar.array[1].abc"), Ok(&8));

    // 4. Modifying collections:

    // 4.1. Add item to collection
    foo.get_resolve_path_mut::<Vec<Foobar>>("bar.vec")
        .unwrap()
        .as_list_mut()
        .unwrap()
        .reflect_push(Box::new(Foobar { abc: 128 }))
        .unwrap();

    assert_eq!(foo.get_resolve_path::<u8>("bar.vec[1].abc"), Ok(&128));

    // 4.2. Removing item from collection
    foo.get_resolve_path_mut::<Vec<Foobar>>("bar.vec")
        .unwrap()
        .as_list_mut()
        .unwrap()
        .reflect_remove(0)
        .unwrap();

    assert_eq!(foo.get_resolve_path::<u8>("bar.vec[0].abc"), Ok(&128));
}
```

The feature is very powerful, it helped to refactor how the editor handles property modification of entities.
The editor uses Command pattern for undo/redo functionality, each action is encapsulated in an object and it 
has standard methods like "execute", "revert", "finalize". Before reflection, to change a property you was forced 
to create a command that will swap previous value with a new one. As you probably already understand, it resulted
in tons of boilerplate code that was hard to maintain. Reflection helper to remove 90% of boilerplate code by
adding universal command that simply gets new value, finds a field using its name and sets the value to it.

Scripts were the second place where it was used - `ScriptTrait::on_property_changed` method was removed. There is
no more manual handling of changed properties, reflection does everything for you.

Reflection is still lacks some functionality, which will be added in the future, but given the fact that it was
added in just a week is quite impressive.

## Plugin Refactoring

Fyrox 0.27 has significant changes in API for plugins. Previously, plugins execution flow was like this:

![flow](/assets/0.27/plugin_flow.svg)

This structure was an attempt to run a game directly inside the editor, but it failed for three main reasons:

- No isolation between a game and the editor. The game used the same engine instance as the editor and there were 
lots of conflicts because of that. It was possible to break the editor from the game.
- No proper stability - if a game is crashed, the editor will crash too which may potentially lead to a data loss.
- No access the user interface instance - if a game is running in the editor, it may break editor's UI if there'd
be access to it.

The only viable solution for this is to run a game as a child process of the editor. This solves all of the above
problems at once and significantly simplifies execution flow for plugins. Execution flow now is very straightforward:
`initialization -> update loop -> destruction`.

The only thing that is now a bit "weird" is plugin instantiation, it is now decoupled from the plugin itself. There
is a separate trait called `PluginConstructor` for that purpose, so typical plugin skeleton looks like this:

```rust
struct Game { }

impl Plugin for Game {
    fn update(&mut self, context: &mut PluginContext, _control_flow: &mut ControlFlow) { }

    fn id(&self) -> Uuid {
        GameConstructor::type_uuid()
    }
}

struct GameConstructor;

impl TypeUuidProvider for GameConstructor {
    fn type_uuid() -> Uuid {
        uuid!("f615ac42-b259-4a23-bb44-407d753ac178")
    }
}

impl PluginConstructor for GameConstructor {
    fn register(&self, context: PluginRegistrationContext) {
        // Register scripts here.
    }

    fn create_instance(
        &self,
        _override_scene: Handle<Scene>,
        _context: PluginContext,
    ) -> Box<dyn Plugin> {
        Box::new(Game {} )
    }
}
```

`PluginConstructor` is now responsible for script registration and plugin instantiation. Why this is needed? The editor
does not need an instance of a plugin, it only needs information about scripts. So the engine now does not create plugin
instances, until internal call of the `engine.enable_plugin(..)` method which in its turn will call `create_instance`. The editor
will just call `register` method from `PluginConstructor` and will get information about scripts.

## Script Refactoring and Improvements

Previous version (0.26) has major problems with scripts which are solved in 0.27:

- There was no ability to execute some code on script destruction. Well, there is standard `Drop` trait, but it does not have access
to engine and plugin contents, which prevents you from doing some additional actions in the engine when the script is
destroying (like removing some entities, etc.). This is now fixed: `ScriptTrait` now has `on_deinit` method which is executed 
right before script is destroyed.
- Scripts of newly created nodes were not initialized. This was a huge problem, because it means that there is no ability
to create entities with script at runtime. This is now fixed: all new script instances are correctly initialized.
- Script methods can be called before scene resources are fully loaded. This is a subtle problem, it means that you have
to block main thread until resources are fully loaded. This is now fixed: engine waits until every resources are loaded
and only then it is able to call script methods.
- Deleting a node from script methods was causing panic. The engine incorrectly assumed that script can outlive the node it
was assigned to.

Some other minor improvements includes dynamic typecasting for scripts, inner component providing and some other small fixes.

## High-DPI Screens Support

`fyrox-ui` now support high-DPI screens. This feature is now used in the editor, it was requested a lot of times and 
now it is available! Previously, the editor was too small on high-DPI screens and pretty much unusable, in this 
release editor's UI will scale using system UI scaling factor. This is how the editor looks with various UI scaling:

100% UI scaling:
![100% scaling](/assets/0.27/ui_scale_1.0.png)

150% UI scaling:
![150% scaling](/assets/0.27/ui_scale_1.5.png)

## Joint Improvements

Joints now use automatic binding, this means that joints use their global transform to automatically calculate local
frames for connected rigid bodies. It is a very intuitive way of creating joints. Here's a quick example:

![joint](/assets/0.27/joint.png)

The joint (revolute) is depicted as two blue lines, connected bodies will rotate around local X axis of the joint.
It is also possible now to disable collisions between connected bodies of a joint.

It is also possible to "rebind" connected bodies, this can be achieved simply by moving the joint.

## 2D Improvements 

`Rectangle` node now has an ability, that allows you to specify image portion for rendering - the property is called `uv_rect`.
It can be used to create sprite sheet animations or to animate textures on rectangles for some specific effects like 
waterfall, etc.

## UI Improvements

Button widget now has an ability to change its content via special message `ButtonMessage::Content`, it is now possible
to change button content at runtime.

A `BitField` widget was also added. `BitField` is a simple widget that shows numeric values a set of individual bits,
which makes it easier to switch separate bits. It is now used to show pair-wise collision filtering masks for colliders:

![debug](/assets/0.27/bitfield.png)

As you may have noticed already, Inspector widget is now much more compact. It now uses adaptive rows for each property,
which allows a row to "fit to content". This solved few issues when a row was clipped because of fixed row height.

`NumericUpDown` widget is now supports "read-only" mode. It prevents editing values, but allows you to select and copy them.

## Editor Improvements

### Debug Visualization

The editor now shows more information about scene nodes that does not have graphical representation, this includes light
sources, camera, joints, rigid bodies, colliders and so on. 

![debug](/assets/0.27/debug.png)

### Show Global Position of Selection

This may seem tiny improvement, but in some cases it helps a lot. The main issue is that scene nodes using only local 
coordinates, while global coordinates are derived - they're calculated using global transform of parents. Global transform
of a node is "packed" in a matrix and it is not shown in the Inspector.

### Cameras

Newly created cameras are now enabled by default, preview functionality was moved to the context menu of World Viewer.
Once you click on "Preview" menu item, the editor will disable all other cameras and will render currently loaded 
scene using the selected camera. To leave preview mode just click "Preview" again.

### Asset Previewer

Asset previewer now plays animations for selected 3D model. It helps you to quickly find required animation when you
don't remember its exact name.

Context menu for asset items allows you to open, delete, show-in-explorer items and also to copy file name and 
full file path to the clipboard.

![debug](/assets/0.27/asset_menu.png)

## `Framework` is Removed

`Framework` is now removed, it is replaced with plugins, because they now have exactly the same functionality. All book
sections that were using framework are removed too.

## Template Generator Improvements

`fyrox-template` is a simple CLI-tool that assists you in project skeleton generation. In Fyrox 0.27 it has two new features.

### Style

`--style 2d|3d` key allows you to select a scene of your new game, by default this parameter has `3d` value. Style does not
restrict your project at some particular game style, it just creates a scene with specific nodes:

1) `3d` - camera with perspective projection and a cube.
2) `2d` - camera with orthographic projection and a sprite.

### Script Generator

Now it is able to generate script skeletons too, which makes adding new script much easier. Adding new script is very easy:

```shell
fyrox-template script --name my_script
```

Executing this command will generate `my_script.rs` in `game/src` folder with following content:

```rust
use crate::GameConstructor;
use fyrox::{
    core::{inspect::prelude::*, uuid::{Uuid, uuid}, visitor::prelude::*},
    engine::resource_manager::ResourceManager,
    event::Event, impl_component_provider,
    scene::{graph::map::NodeHandleMap, node::TypeUuidProvider},
    script::{ScriptContext, ScriptDeinitContext, ScriptTrait},
};

#[derive(Visit, Inspect, Default, Debug, Clone)]
struct MyScript {
    // Add fields here.
}

impl_component_provider!(MyScript);

impl TypeUuidProvider for MyScript {
    fn type_uuid() -> Uuid {
        uuid!("7dde8369-2974-4844-8bce-75fc0c18d75e")
    }
}

impl ScriptTrait for MyScript {
    fn on_init(&mut self, context: ScriptContext) {
        // Put initialization logic here.
    }

    fn on_deinit(&mut self, context: ScriptDeinitContext) {
        // Put de-initialization logic here.
    }

    fn on_os_event(&mut self, event: &Event<()>, context: ScriptContext) {
        // Respond to OS events here.
    }

    fn on_update(&mut self, context: ScriptContext) {
        // Put object logic here.
    }

    fn remap_handles(&mut self, old_new_mapping: &NodeHandleMap) {
        // Remap handles to other scene nodes here.
    }

    fn restore_resources(&mut self, resource_manager: ResourceManager) {
        // Restore resource handles here.
    }

    fn id(&self) -> Uuid {
        Self::type_uuid()
    }

    fn plugin_uuid(&self) -> Uuid {
        GameConstructor::type_uuid()
    }
}    
```

All you need to do manually, is to add the script to module tree using `mod my_script` somewhere. Comments should help you
to understand what code should be where.

## Book

The [book](https://fyrox-book.github.io/) has lots of improvements too, it now covers plugins, scripts, joints, logging, ray 
casting, renderer quality settings, custom render passes. Tutorials were updated to use latest engine version.

## Full List of Changes in Random Order

- Added compile-time reflection (huge thanks to [@toyboot4e](https://github.com/toyboot4e))
- Most editor commands were removed and replaced by universal command based on reflection. 
- Backward compatibility for native engine data formats was dropped - use FyroxEd 0.13 to convert your scenes to newer
version.
- Fixed panic when loading an FBX model with malformed animation curves (when there is only 1 or 2 components animated
instead of 3, X and Y, but not Z for example).
- ABSM editor now have smaller default size and fits on small screens.
- Asset previewer now plays model animations
- Fixed critical FBX importer bug, that caused malformed animations.
- Ability to define "playable" time slice for animations.
- Fixed editor update rate, previously it was very high and that caused some weird issues.
- Proper support for all resource types in Inspector
- Show ABSM resources in the asset browser
- Ability to edit sound import options in the asset browser
- Dynamic type casting for script instances
- Provide access to parameters in ABSM
- Fixed transition instantiation in ABSM - it incorrectly handled "invert rule" flag.
- Prevent panic when deleting a node from script methods.
- Dynamic type casting for plugin instances
- Two-step ABSM instantiation - at first step you load all animations in parallel (async) and on second step you
create actual ABSM instance.
- Wait for all resources to load before initialize scripts - this prevents panicking when trying to access
not yet loaded resource in script methods.
- Default instantiation scaling options for 3D models - allows you to scale 3D models automatically on instantiation.
- Graph event broadcaster - allows you to receive `Added` and `Removed` events for nodes.
- Correctly initialize scripts of nodes that created at runtime.
- Component provider for scripts - allows you to provide access to inner script components via unified interface.
- Disable automatic texture compression - having compression enabled for all kinds of textures is not good, because
there could be some textures with gradients, and they'll have significant distortion.
- `Pool::drain` - allows you to remove all objects from a pool while processing every object via closure.
- `Script::on_deinit` - allows you to execute any code for cleanup.
- Added `NodeHandleMap` - a small wrapper over map that have some methods that makes node handle mapping much 
shorter.
- Correctly handle missing properties in Inspector for various objects.
- Provide access to main application window from plugins.
- Allow chaining `ScriptConstructorContainer::add` calls
- Ability to remove render passes.
- Run the game in a separate process from the editor.
- Provide access to default engine's user interface instance for plugins.
- `--override-scene` parameter for Executor
- `ButtonContent` improvements - it is now possible to re-create button's text field using `ButtonMessage::Content`
- Provide access to control flow switch for plugins.
- `Plugin::on_ui_message`
- Two-step plugins initialization:
  - `PluginConstructor` trait defines a method that creates an instance of `Plugin` trait, instance of plugin
    constructor is used to create plugins on demand. It is needed because engine has deferred plugin initialization.
- `Framework` is removed, its functionality was merged with plugins.
- Simplified `ScriptConstructorContainer::add` definition, there were redundant generic parameters that just add
visual clutter.
- Implemented `Clone+Debug` traits for `NavmeshAgent`
- Fixed spam in log in the editor when any file was changed.
- High DPI screens support for the editor.
- Newly created cameras in the editor are now enabled by default.
- Added "Preview" option for cameras in world viewer.
- Refactored joints:
  - Joints binding now is fully automatic and it is based on world transform of the joint, no need to manually
    set local frames.
  - Rebinding happens when a joint changes its position
  - Joints editing in the editor is now much more intuitive
- Improved debug visualization for physics.
- Read-only mode for NumericUpDown and Vec2/Vec3/Vec4 widgets
- Show global coordinates of current selection in the scene previewer
- BitField widget - it helps you to edit numbers as bit containers, allowing you to switch separate bits
- More compact editors for properties in Inspector
- NumericUpDown widget does not use word wrapping by default anymore
- CheckBox widget can now be switched only by left mouse button
- Ability to disable contacts between connected bodies of a joint
- `style` parameter for project template generator - it defines which scene will be used by default - either `2d` 
or `3d`
- Ability to select portion of the texture to render in `Rectangle` nodes.
- Ability to generate script skeleton for template generator
- HSL color model
- Ability to copy log entries to the clipboard
- `Log` API improvements
- Visualize cameras in the editor
- Context menu for asset items, it is now possible to open, delete, show-in-explorer items and also
to copy file name and full file path to the clipboard.
- Visualize point and spot lights in the editor.

## What's Next?

Next version (0.28) will focus mainly on polishing the existing functionality, which means add missing methods to the API,
ensure that all parts are working together and nothing is getting in a way of completing a game. Good documentation is 
the key to understand how the engine works and how a particular task can be solved using it, so the docs and the book
will be also improved. There're quite a lot of functionality already implemented which is not easy to use, such as light 
mapping, the next release will make sure that most of the features are good in terms of usability. 

The engine still missing one important part - animation editor, now when reflection is added to the engine, it is possible
to implement the editor. Since it is a huge tool itself, it probably won't get in 0.28, but 0.29 will have it for sure.