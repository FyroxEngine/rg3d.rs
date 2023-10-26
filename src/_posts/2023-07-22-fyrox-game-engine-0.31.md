---
title: "Fyrox Game Engine 0.31"
date: "2023-07-22"
description: "Fyrox 0.31 includes editor improvements, documentation improvements, overall usability improvements, bug fixes and more"
categories: 
- General
meta:
  - property: og:title
    content: Fyrox Game Engine 0.31
  - property: og:description
    content: Fyrox 0.31 includes editor improvements, documentation improvements, overall usability improvements, bug fixes and more.
  - property: og:type
    content: article
  - property: og:url
    content: https://fyrox.rs/blog/post/fyrox-game-engine-0-31/
  - property: og:image
    content: https://fyrox.rs/assets/0.31/plugin.gif
---

I'm happy to announce that Fyrox 0.31 has been released! Fyrox is a modern game engine written in Rust, it helps
you to create 2D and 3D games with low effort using native editor; it is like Godot, but in Rust. This release includes
editor improvements, documentation improvements, overall usability improvements, bug fixes and more. 

## Editor Improvements

The editor has the most amount of changes in this release. This includes custom plugins, ability to open multiple scenes,
ability to save and load docking manager layout, and many more.

### Editor Plugins

![layout](/assets/0.31/plugin.gif)

It is now possible to create plugins for the editor. The gif above shows a simple plugin that has a window with a single
button, that increases scale 2x on each click. It's source code is quite simple and straightforward:

```rust
use fyrox::{
    core::{log::Log, pool::Handle},
    gui::{
        button::{ButtonBuilder, ButtonMessage},
        message::UiMessage,
        widget::WidgetBuilder,
        window::{WindowBuilder, WindowTitle},
        Thickness, UiNode,
    },
};
use fyroxed_base::{
    plugin::EditorPlugin,
    scene::{commands::graph::ScaleNodeCommand, commands::SceneCommand, Selection},
    Editor, Message,
};

pub struct MyEditorPlugin {
    tool_window: Handle<UiNode>,
    increase_scale: Handle<UiNode>,
}

impl MyEditorPlugin {
    pub fn new(editor: &mut Editor) -> Self {
        let ctx = &mut editor.engine.user_interface.build_ctx();
        let increase_scale;
        let tool_window = WindowBuilder::new(WidgetBuilder::new())
            .with_title(WindowTitle::text("My Editor Plugin"))
            .with_content({
                increase_scale = ButtonBuilder::new(
                    WidgetBuilder::new().with_margin(Thickness::uniform(2.0)),
                )
                .with_text("Make Selection 2x Bigger")
                .build(ctx);
                increase_scale
            })
            .build(ctx);

        Self {
            tool_window,
            increase_scale,
        }
    }
}

impl EditorPlugin for MyEditorPlugin {
    fn on_start(&mut self, _editor: &mut Editor) {
        Log::info("Editor plugin successfully initialized!");
    }

    fn on_ui_message(&mut self, message: &mut UiMessage, editor: &mut Editor) {
        if let Some(ButtonMessage::Click) = message.data() {
            // Check if our plugin's button was clicked.
            if message.destination() == self.increase_scale {
                // Fetch current scene being edited.
                if let Some(editor_scene) = editor.scenes.current_editor_scene_ref() {
                    let engine_scene = &editor.engine.scenes[editor_scene.scene];
                    if let Selection::Graph(selection) = &editor_scene.selection {
                        // Increase scale of each selected node.
                        for node in selection.nodes() {
                            let old_scale =
                                **engine_scene.graph[*node].local_transform().scale();

                            // Put scaling command to the commands queue.
                            editor.message_sender.send(Message::DoSceneCommand(
                                SceneCommand::new(ScaleNodeCommand::new(
                                    *node,
                                    old_scale,
                                    old_scale.scale(2.0),
                                )),
                            ));
                        }
                    }
                }
            }
        }
    }
}
```

Such plugin can be registered in your `editor` project (if you use standard project structure generated by the 
`fyrox-template` tool) like so:

```rust
...
let plugin = MyEditorPlugin::new(&mut editor);
editor.add_editor_plugin(plugin);
```

Editor plugins allows you extending the editor as you want, adding any missing (yet) functionality, creating tools of any 
complexity that can save heaps amount of time by removing tedious parts from your work. You can also share your plugins
with other people as a standard Rust crate, if they operate only on engine entities (or introduce their own).

Editor plugins are still somewhat experimental, but they already can save a lot of time and make the editor fully 
configurable.

### Ability to Focus Editor's Camera on an Object

![layout](/assets/0.31/focus.gif)

It is now possible to focus the editor camera on an object either by double-clicking it in the World Viewer or by `[F]`
hotkey. This feature helps you find a selected object very quickly, and very useful in case of complex scenes with 
lots of objects.

### Ability to Open Multiple Scenes at Once

![multiscene](/assets/0.31/multiscene.gif)

For a long time, the editor was able to open only one scene at a time, which slowed down the work if you use lots of 
prefabs and switching between them very often. Now it is fixed, and you can open multiple scenes at once. Keep in mind, 
that only one scene can be edited at a time, you can't undock scene tabs and see/edit multiple scenes at once.

### Ability Save Docking Manager Layout

![layout](/assets/0.31/layout.gif)

It is now possible to save and load the layout of editor panels. It is a huge usability improvement which saves a lot
of time if you use custom combination of windows and the default layout is not suitable for you. For example, if you're
working with the animation editor, it is undocked and hidden by default so before, you had to open and dock it every time 
you restarting the editor, losing time for nothing.  

### Additional Ways to Open Editor Scenes

![open](/assets/0.31/open.png)

Previously, to open a scene you was forced to go to `File -> Load Scene` menu, find you scene in the file selector and
click "load". In some cases that was enough, but in many cases it is very tedious and now it possible to open scenes 
from the asset browser by simply right-clicking on it and pressing `Open`.

![open 2](/assets/0.31/open2.png)

It is also possible to open parent prefab of a scene node in the world viewer, which also saves time in some cases.

### Camera Preview

![camera](/assets/0.31/camera.gif)

Camera preview is now done via separate preview panel. This panel automatically shows up when you select a camera,
it allows you to turn the preview mode on or off. Previously you was forced to right-click on camera now in the 
world viewer, click "Preview" and then click do it again to exit the preview mode.

### Other Editor Improvements

Newly created objects are now automatically selected. This saves extra clicks and makes scene creation smoother.

## 9-slice Widget

![9slice](https://upload.wikimedia.org/wikipedia/commons/7/7a/Traditional_scaling_vs_9-slice_scaling.svg)

9-slice image widget (kudos to [@DrAlta](https://github.com/DrAlta)) allows you to divide an image into 9 segments where 
corners aren't distorted, while other parts can be distorted. It is used for scaling of 2D images, such as buttons, or 
anything else that has some sort of border that shouldn't be distorted when applying arbitrary scaling.

## Behaviour trees

Behaviour trees now has support of `Inverter` node, that inverses the result of its child node. It is useful
to inverse the result of logical nodes, so you don't need to have two versions of logical nodes. It also has useful 
shortcuts to create behaviour tree nodes.

## Documentation Improvements

This release contains lots of documentation improvements. This is mostly related to the UI docs, however some of the
other parts of the engine were documented too. In total, more than 20 widgets and scene entities were fully documented
with code examples.

## Book Improvements

The book was improved as well. It also includes chapter for various UI widgets, proofreading, corrections, removal of 
outdated information.

## Full List of Changes in Random Order

- Multi-scene editing
- Docs for `Window` widget
- Fixed opengl es usage when opengl is not supported
- Docs for `Decorator` widget
- Added `crv` extension for `CurveLoader`
- Basic editor plugins support
- Updated dependencies
- Expose all editor fields so they can be accessible outside
- Docs for `UuidEditor` widget
- Use user_data field of physics entities to store handle to engine entity
- Ability to encode/decode handles to/from u128
- Ability to fetch all contact pairs from 2d/3d physics worlds
- Docs for `MessageBox` widget
- `Graph::aabb_of_descendants`
- Aabb api improvements
- Ability to open asset of a node from the world viewer
- Improved `impl_component_provider` macro to accept `field.foo.ab` chains
- Docs for navmesh node
- Useful shortcuts for behaviour trees
- Fixed standard materials for new serialization format
- Inverter node for behaviour trees
- Docs and examples for `VertexBuffer`
- Added `VertexTrait` to prevent using a vertex type with different layout
- Improved `surface` mod docs
- Added `elapsed_time` in `PluginContext`
- Use all texture channels in sprite fragment shader
- Load editor's docking manager layout on reconfiguration
- Open window of a tile when restoring docking manager layout
- Ability to save/load editor's docking manager layout
- Prevent panic in ui search methods
- Ability to apply saved docking manager layout + improved layout saving
- Ability to save docking manager layout
- Changed error to warning when unable to load missing options file
- Fixed crash when exiting the editor
- Fixed opening arbitrary files from asset browser
- Ability to open scenes from asset browser
- User-defined data for tabs
- Ability to add and remove tabs in the `TabControl` widget via messages
- Added a nine patch widget
- Fixed tab control's content alignment
- `can_be_closed` flag for `TabControl` tabs
- Ability to close tabs in `TabControl` widget
- Docs for `TabControl` widget
- Ability to catch the moment when the active tab of `TabControl` changed
- Docs for `ScrollBar` widget
- Docs for `Popup` widget
- Docs for `NumericUpDown` widget
- Ability to change `StackPanel`'s orientation via message
- Ability to change `WrapPanel`'s orientation via message
- Docs for `WrapPanel` widget
- Docs for `CheckBox` widget
- Docs for `Widget`
- Docs for `TextBox` widget
- Docs for `StackPanel` widget
- Docs for `Grid` widget
- Docs for `Image` widget
- Docs for `Text` widget
- Fyrox-ui docs
- Docs for `Button` widget
- Access to current transform of `TransformStack`
- Docs for `Border`
- Ability to pass doc comments in `define_constructor` macro
- Docs for `BuildContext`
- Docs for `UiNode`
- Iterative font atlas packing.
- Docs for `Thickness`
- Docs for widget alignments
- Docs for `BaseControl`
- Update hierarchical data when instantiating a prefab
- Docs for `trait Control`
- Hotkey to focus editor's camera on a selected object
- Helper methods for `Frustum`
- Ability to focus editor's camera on an object
- Helper methods for `TextureKind`
- Camera fitting functionality
- Aabb helper methods
- Save editor settings only if they were modified by user
- `Camera::frustum` method.
- Fixed camera preview + added camera preview control panel
- Automatically select newly created scene nodes in the editor

## SemVer Importance

This release is slightly out of schedule because of breaking changes in `nalgebra` crate, that were published as a patch.
These changes broke backward compatibility in serialization, which in its turn caused the engine to 
[panic](https://github.com/FyroxEngine/Fyrox/issues/472) on attempt to load standard shaders. This situation clearly 
shows why following [SemVer rules](https://semver.org/) is important.

## Support

If you want to support the development of the project, click one of the links below. Preferable way is to use 
[Boosty](https://boosty.to/fyrox) - this way the money will be available for the development immediately. 
Alternatively you can use [Patreon](https://www.patreon.com/mrdimas), but in this case the money will
be on-hold for unknown period of time ([details are here](https://github.com/FyroxEngine/Fyrox/issues/363)).

Also, you can help by fixing one of the ["good first issues" ](https://github.com/FyroxEngine/Fyrox/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22),
adding a desired feature to the engine, or making a contribution to the [book](https://github.com/fyrox-book)