---
title: "Fyrox 0.28 Feature Highlights"
date: "2022-10-10"
subtitle: "Fyrox 0.28 continues a series of improvements and fixes to make game development much more convenient."
categories: 
- General
---

I'm happy to announce that Fyrox 0.28 has been released! Fyrox is a modern game engine written in Rust, it helps
you to create 2D and 3D games with low effort using native editor. This release continues a series of improvements
and fixes to make game development more convenient. 

## Improved Scripts Pipeline

Scripts is the major part of the engine, it is keeps getting improvements and fixes. Fyrox 0.28 has lots of 
significant changes starting from scripts API and ending by support for saved games.

### API Changes

Some methods of the `ScriptTrait` were removed and some added. `on_remap_handles` was removed because node handle
mapping is fully automatic (see [Automatic Handle Mapping](#automatic-handle-mapping) section for more info). 
`on_start` method was added to execute some logic after every script instance is already initialized.

Every script method is now accepts `ScriptContext` parameter by mutable reference due to performance reasons. 
Previously, it was passed by value and it was more or less ok, but it grew in size and it became inefficient.

`ScriptContext` now also have `elapsed_time` field which contains the time that passed since start of your game
in seconds. This field could be useful for some procedural animations.

### Strict Order of Execution

Script processing was rewritten entirely to guarantee execution order of script methods. Now execution order is 
the following:

1) Call `on_init` for every script.
2) If there is any new script added go to 1.
3) Call `on_start` for every script.
4) If there is any new script added go to 1.
5) Call `on_update` for every script.
6) If there is any new script added go to 1.
7) Destroy all script instances marked for deletion (`on_deinit`).

It looks quite convoluted, let's try to understand why. At first, every script method is able to spawn other objects
to a scene (instantiate a prefab or create objects procedurally), this complicates update loop significantly. 
If a new object was added in any of `on_init`, we must do another iteration of initialization, because we can't 
call `on_start` - it must be called only when every script is initialized. `on_start` in its turn can also spawn 
something and we can't simply go to `on_update`, because new instances are not initialized yet! Once everything is
initialized and started, we can do `on_update` - and again it can spawn something... That's why we need multi-pass
init/start/update loops. This is the only way to ensure that everything will be updated on current frame and there 
won't be 1-frame lag. Every inner loop is "fused" - it is protected from infinite loops, that might be caused by incorrect
scripts. A script could spawn an object, that in its turn spawn another object, and so on.

The last step is destruction of script instances. It is deferred to the end of the frame mostly due to inability to 
provide wide context at the point of destruction request. What does that mean? When you delete a node or its script,
`ScriptTrait::on_deinit` should be called, by its definition it requires access to plugins attached to the engine, current scene,
etc. It is very problematic to provide such info at every call site, so it just deleted at the end of the frame.

### Support for Saved Games

Scripts now fully support standard approach for saved games. Standard approach is to just save current scene to file
and load it when there's a need to load saved game. Previously it was quite problematic, because scripts didn't track
their start (whether they initialized or not) and call `on_init` method after a saved game was loaded. Now it is fixed,
and `on_init` is ignored for initialized script instances. `on_start` method is still called leaving an opportunity to
do some actions after a saved game was loaded.

### Scene Nodes

Scene nodes now have new helper methods - `Base::has_script`, `Base::try_get_script`, `Base::try_get_script_mut` that 
makes fetching scripts on a scene node less tedious.

## User Interface

Fyrox uses its own UI system, that provides strong foundation for the editor and every game made with the engine. This
release contains lots of small improvements that makes life easier.

### TextBox Widget Improvements

TextBox widget is improved in many ways. Now it supports text scrolling, it is possible to select text word-by-word
using `Ctrl+Shift+Arrow` shortcut, it is possible to skip words by `Ctrl+Arrow` shortcut. Double click on a word (or
whitespace span) selects it. In other words, text box widget now is closer to standard implementations of such widget.

There's also support for optional visual effect - shadows. It can be used to make text readable in any conditions.
For example, white text with black shadow will still be readable even in bright scenes. It is very useful to create
subtitles.

## Misc

It is now possible to expand or collapse trees by double-click. Previously you had to click on small arrow and this
was quite annoying when you have to traverse large trees.

Node handles property editor now shows node names as well as their handles. Invalid node handles are now highlighted 
in the Inspector:

![Node Handle Editor](/assets/0.28/node_handle_editor.png)

## Asset Preview

Previous versions of the engine allowed you to instantiate a prefab by drag'n'drop it from Asset Browser to a scene,
but every instance was placed at `(0, 0, 0)` and there was no preview for an instance being created. Now it is fixed and
it significantly improves workflow in the editor - you can see where your object will be created. Here's a small gif
that shows how it works:

![Prefab Preview](/assets/0.28/preview.gif)

## Property Inheritance

At first let's understand what is property inheritance. Property inheritance is used to propagate changes of unmodified 
properties from a prefab to its instances. For example, you can change scale of a node in a prefab and its instances will 
have the same scale too, unless the scale is set explicitly in an instance. Such feature allows you to tweak instances,
add some unique details to them, but take generic properties from parent prefabs.

Property inheritance works for prefab hierarchies of any depth, this means that you can create something like this: a room 
prefab can have multiple instances of various furniture prefabs in it, while the furniture prefabs can also be constructed
from other prefabs and so on. In this case if you modify a property in one of the prefabs in the chain, all instance will 
immediately sync their unmodified properties. 

This mechanism was available in previous versions, but it was based on manual handling of `InheritableVariable<T>` fields. 
Fyrox 0.28 changes this - now it is fully automatic, all you need to do is to wrap a field of your script in 
`InheritableVariable<T>` wrapper and the engine do inheritance automatically based on the state of.

## Automatic Handle Mapping

The next thing that was improved is node handle mapping. What is this anyway? When you save a handle to some node in your
script it must be mapped to respective copy when you cloning the node with the script. If you don't do this, the handle 
will point to initial object, from what the copy was made. In most cases this is undesired effect and mapping should be 
done. 

As an example why node mapping is important let's imagine that you have a door script that is applied to some sci-fi door. 
The script controls door movement as well as behavior of lights on the door. To control lights, the script must know their
handles. Now what will happen with handles if you clone a door with the script? If there wouldn't be handle mapping, handles
of light sources would be copied as is and multiple door instances would control few light sources of initial door. But we 
need each door to control its own set of lights, that's when node handle mapping comes into play. When your copy an object,
the engine maps handles stored in cloned objects to their respective copies.

As with property inheritance, this mechanism was available in previous versions of the engine. You might remember 
`ScriptTrait::remap_handles` method, it forced you to do tedious manual work for every handle. Such manual work was a constant
source of bugs, and it is now replaced with fully automatic solution based on reflection.

## Sprite Sheet Animation for 2D

Sprite sheet animation is a simple technique that allows you to keep frames of an animation in a single source (file in most
cases). Instead of having a texture per each frame, you have a single texture and to perform actual animation you
just change texture coordinates on a sprite. This is much more effective approach in terms of performance. Typical sprite sheet
could look like this:

![Sprite Sheet](/assets/0.28/sprite-sheet.png)

This functionality was requested dozens of times already and now it is available. However, there is no dedicated sprite sheet
editor, so it is a bit tedious to fill frames for sprite sheet animations in the editor. For now you need to calculate
offsets manually for each frame. This will be improved in next version of the engine.

![Editing Sprite Sheet](/assets/0.28/edit-sprite-sheet.png)

It is also possible to attach signals to specific frames in an animation. This functionality could be useful if you want to 
"attach" some action(s) to specific key frame. For example, you may have a `walk` animation and want to emit sound on every
key frame where feet touch ground. In this case you just need to add a signal to these frames and then process events from
the animation to emit sounds.

## Multi-Borrow Context

From the very beginning, the engine didn't let you to borrow multiple objects from a pool simultaneously. Now it is fixed by
adding a special fixed-sized multi-borrow context. It is a fixed sized storage for borrowed handles, that enforces borrowing
rules at runtime. It is now possible to borrow multiple mutable references to unique objects at the same time. The same is
applied to `Graph`, it now has `Graph::begin_multi_borrow` method.

## Editor Improvements and Fixes

The editor is a major part of the tool set and it has quite a lot of improvements itself.

### Update Loop

The editor is a "game" that is built using the engine, so it has its own update loop for inner events. Previously, the update
loop implementation suffered from 1-frame delay that resulted in annoying "flashing" of the UI. The new update loop implementation
fixes these issues, by introducing multi-pass update loop to ensure that everything will be updated correctly on a current frame.

### World Viewer

Search functionality in the World Viewer is now case-insensitive, which makes filtering much more user-friendly. 

It is now possible to change type of existing scene node. This functionality is very useful if you want to change type of 
the root node of your scene. By default, its type is `Pivot`, but in some cases you may want to make it `Rigid Body`. This
could be useful if you're making some character prefab and want the root node to be root node of the instance. To use 
this functionality, just right-click on a node in the World Viewer and select `Replace With`:

![Replace Node](/assets/0.28/replace.png)

### Recent Files

Fyrox 0.28 adds a list of recent scenes to `File` menu in the editor. It makes switching between scenes much easier. Future
versions of the engine will also add support for editing of multiple scenes at once without a need to switch between them.

### Settings

The editor now saves position and orientation of preview camera in settings - this is very handy when you switching between
scenes and the camera restores its position when a new scene is loaded. 

`Track Selection` option is now saved in the settings file too, this option is used to keep selected node in view in the World
viewer.

### Misc

Interaction modes (the left tool bar in the Scene Preview window) are now correctly highlighted. Previously it was quite hard
to tell which mode is currently active. Navmesh and terrain edit modes now have their own hotkeys (`[5]` and `[6]` respectively).

In 0.27.1 there was an issue with inability to assign scripts for nodes in some cases, this is now fixed. A script that have
any resource field (`Model`, `Texture`, etc.) could crash the editor in previous version, this is now fixed too.

## Book

The [book](https://fyrox-book.github.io/) has some improvements too - it was restructured, added info about property inheritance
terrains, particle systems, etc. Tutorials were updated to use latest engine version.

## Side Projects

[Station Iapetus](https://github.com/mrDIMAS/StationIapetus) is sci-fi shooter that is built using the engine. Recently it was 
fully migrated to scripting system. While it is still in very early development stage, it could be a good example of how to use
the engine in a large project.

## Full List of Changes in Random Order

- Preview for prefab instantiation.
- Drag preview nodes are now input-transparent.
- Expand/collapse trees by double click.
- Fixed move/rotate/scale gizmo behaviour for mouse events.
- Fixed fallback to defaults when editor's config is corrupted. 
- Save `Track Selection` option in the editor's config.
- Clear breadcrumbs when changing scene in the editor.
- Fixed 1-frame delay issues in the editor. 
- Emit MouseUp message before Drop message.
- Fixed UI "flashing" in the editor in some cases.
- Do not silently discard UI messages from nodes that were already be deleted.
- Show node handle in breadcrumbs in the editor.
- Provide direct read-only access to current dragging context in UI.
- Fixed crash when trying to select a node by invalid handle in the editor.
- Highlight invalid handles in the Inspector.
- Discard "leftover" debug geometry when undoing actions in the editor.
- Some menus in the editor now more intuitive now.
- Fixed critical bug with incorrect unpack alignment for RGB textures - this causes hard crash in some
cases.
- Do not try to reload a resource if it is already loading.
- Ability to set desired frame rate for `Executor` (default is 60 FPS).
- Ability to paste editor's clipboard content to selected node (paste-as-child functionality).
- Ability to render into transparent window while keeping the transparency of untouched pixels (see
`transparent` example).
- Ability to specify custom window builder in `Executor` + a way to disable vsync in `Executor`.
- `MultiBorrowContext` for `Pool` and `Graph::begin_multi_borrow`, helps you to borrow multiple mutable
references to different items.
- Speed up code generation in proc-macros.
- Correctly map handles in instances after property inheritance (fixed weird bugs when handles to nodes
in your scripts mapped to incorrect ones)
- Refactored script processing:
  - Added `ScriptTrait::on_start` - it is guaranteed to be called after all scripts in scene are initialized, useful 
  when a script depends on some other script
  - Script processing is now centralized, not scattered as before.
  - More deterministic update path (`on_init` -> `on_start` -> `on_update` -> `on_destroy`)
- Fixed crash when modifying text in a text box via message and then trying to type something.
- `ButtonBuilder::with_text_and_font` 
- Show node names in for fields of `Handle<Node>` fields of structs in the editor.
- Fixed crash in the editor when a script has resource field. 
- Ability to clone behaviour trees.
- Automatic node handle mapping via reflection.
- Removed `ScriptTrait::remap_handles` method.
- Pass elapsed time to scripts.
- Do not call `ScriptTrait::on_os_event` if scene is disabled.
- Make world viewer filtering case-insensitive.
- Correctly set self handle and sender for graph's root node.
- `#[inline]` attributes for "hot" methods.
- Fixed panic when rigid body is a root node of a scene.
- `Base::has_script` + `Base::try_get_script` + `Base::try_get_script_mut` helper methods, it is now easier
to fetch scripts on scene nodes.
- Ability to change selected node type in the editor (useful to change scene root type).
- Optimized script trait parameter passing, script context now passed by reference instead of value.
- Script context now have access to all plugins, which makes possible create cross plugin interaction.
- Removed requirement of scripts api to provide parent plugin's uuid.
- There is no more need to define uuid for plugins.
- Do not update scene scripts if it is disabled.
- `Graph::find_first_by_script` - helps you find a node by its script type.
- Added missing property editors for `Inspector` widget.
- Save editor's scene camera settings (position, orientation, zoom, etc.) per scene.
- Skip-chars list to be able to treat some chars like white space.
- Optional text shadow effect.
- Ctrl+Shift+Arrow to select text word-by-word in text box widget.
- Added navmesh settings to editor's settings panel.
- Make text box widget to accept text messages + special messages for text box widget.
- Set 500 ms double click interval (previously it was 750 ms).
- Fixed text selection in case of custom ui scaling.
- Fixed `TextBox::screen_pos_to_text_pos` - incorrect usage of `char_code` as index was leading to incorrect screen 
position to text position mapping.
- Ability to scroll text in the text box widget.
- `Rect::with_position` + `Rect::with_size` methods.
- Fixed caret position when removing text from text box in specific cases.
- Fixed crash when typing spaces at the end of text box with word wrap.
- Fixed caret position when adding text to the multiline text box widget.
- Fixed new line addition in the text box widget.
- Ability to select words (or whitespace spans) in the text box by double click.
- Emit double click after mouse down event (not before).
- Fixed caret blinking in the text box widget for various scenarios.
- Ctrl+LeftArrow and Ctrl+RightArrow to skip words in the text box widget.
- Allow setting caret position in the text box widget by clicking outside of line bounds.
- `raycast2d` example.
- Fixed text deletion in text box by `Delete` key + selection fixes.
- Fixed selection by Ctrl+Home, Ctrl+End in the text box widget.
- Fixed selected text highlighting in the text box widget.
- Fixed panic when Ctrl+C in a text box when selection is right-to-left.
- Ability to focus/unfocus a widget by sending a message.
- Added `TextBox` example.
- Removed `is_modified` flag from `PropertyInfo`.
- Ability to revert inherited property to parent's prefab value.
- Replaced manual property inheritance with reflection.
- Added `fields` and `fields_mut` for `Reflect` trait.
- Property inheritance for scripts.
- Ability to extract selection as a prefab.
- Fixed tooltips for complex properties in `Inspector` widget.
- Allow selecting build profile when running a game from the editor.
- `NodeHandle` wrapper to bypass some limitations of `Inspector` widget.
- Return result instead of unwrap and panic in `make_relative_path` - fixed some issues with symlinks in the
editor.
- Added missing `Reflect` implementation for scripts made in `fyrox-template`.
- Added dependencies optimization for projects generated in `fyrox-template`.
- Provided access to some sound engine methods to plugins (`set_sound_gain` and `sound_gain`)
- Fixed style for ArrayPropertyEditor widget.
- Do not emit events for disabled animation signals.
- Sprite sheet animations with signals.
- Fixed terrain rendering - there's no more seams between layers with skybox content.
- Ability to set blending equation in draw parameters in the renderer.
- Ability to set blend function separately for RGB and Alpha in the renderer.
- Ignore invisible menus when closing menu chain by out-of-bounds click.
- Make some buttons in the editor smaller and less bright, add more tooltips.
- Use images for `Expand all`, `Collapse all`, `Locate Selection` buttons in world viewer.
- Fixed potential infinite loops when performing some math operations.
- Smoothing for cascaded shadow maps.
- Fixed script property editor - no more weird bugs in the editor when setting/editing/removing scripts from
a node.
- Fixed cascaded shadow maps for directional lights.
- Added `Frustum::center` method.
- Fixed list of panels in `View` menu in the editor.
- Create tool tips for interaction modes hidden by default.
- Reload settings when reconfiguring the editor.
- Added list of recent scenes to `File` menu in the editor - makes easier to switch between most used scenes.
- Ability to add, remove, set items for `MenuItem` widget
- Correctly highlight selected interaction mode button
- More hotkeys for the editor 
  - `[5]` - activate navmesh edit mode
  - `[6]` - activate terrain edit mode
- Ability to set `Selected` flag to `Decorator` widget on build stage
- Added `Invert drag` option for camera settings in the editor.
- Fixed incorrect rendering of `Luminance` and `LuminanceAlpha` textures.
- Fixed closing menus by clicking outside them.
- Direct access to all fields in all widgets.
- Force `TextBox` widget to consume all input messages, this fixes hot keys triggering in the editor while
typing something in text fields.

## Support

If you want to support the development of the project, click one of the links below. Preferable way is to use 
[Boosty](https://boosty.to/fyrox) - this way the money will be available for the development immediately. 
Alternatively you can can use [Patreon](https://www.patreon.com/mrdimas), but in this case the money will
be on-hold for unknown period of time ([details are here](https://github.com/FyroxEngine/Fyrox/issues/363)).

Also, you can help by fixing one of the ["good first issues" ](https://github.com/FyroxEngine/Fyrox/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22),
adding a desired feature to the engine, or making a contribution to the [book](https://github.com/fyrox-book)

## What's Next?

There are few new features planned for the next version of the engine: sprite sheet animation editor, ability to
edit multiple scenes at once, generic animation editor. As usual, the engine will be improved in terms of 
usability and quality.
