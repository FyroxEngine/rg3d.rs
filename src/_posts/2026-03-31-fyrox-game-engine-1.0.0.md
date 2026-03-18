---
title: "Fyrox Game Engine 1.0.0"
date: "2026-03-31"
description: "Fyrox 1.0.0 is the first stable release of the engine"
categories:
  - General
meta:
  - property: og:title
    content: Fyrox 1.0.0
  - property: og:description
    content: Fyrox 1.0.0 is the first stable release of the engine
  - property: og:type
    content: article
  - property: og:url
    content: https://fyrox.rs/blog/post/fyrox-game-engine-1.0.0/
  - property: og:image
    content: https://fyrox.rs/assets/1.0.0/light_map.png
---

I'm happy to announce that after 7 years in development the first stable Fyrox 1.0.0 was released! Fyrox is a modern
game engine written in Rust, it helps you to create 2D and 3D games with low effort using native editor; it is like
Unity, but in Rust.

If you find a bug, confusing or incomplete documentation,
please [file an issue](https://github.com/FyroxEngine/Fyrox/issues)
or propose a solution by [creating a pull request](https://github.com/FyroxEngine/Fyrox/pulls).

# Release-Candidate Release Notes

Make sure to also check release notes for the two release-candidates for 1.0.0, which essentially summarizes all the
changes in 1.0.0 compared to 0.36.2.

- [Release Candidate 1](https://fyrox.rs/blog/post/fyrox-game-engine-1-0-0-rc-1/)
- [Release Candidate 2](https://fyrox.rs/blog/post/fyrox-game-engine-1-0-0-rc-2/)

# Installation

Use [the link](https://fyrox.rs/download.html) to download page to learn how to install this release.

# What's Next?

The release of 1.0.0 was very labor-intensive and Fyrox Dev Team needs some rest. The devs will continue fixing bugs,
but new major features will be on-hold for a few months.  

# Support

If you want to support the development of the project, click [this link](https://fyrox.rs/sponsor.html). Also, you can
help by fixing one of
the ["good first issues"](https://github.com/FyroxEngine/Fyrox/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22),
adding a desired feature to the engine, or making a contribution to the [book](https://github.com/fyrox-book)

# Full List of Changes

The list is split into four sections for ease of reading and finding particular information.

## Fixed

Fixed title
Fixed crash when switching scenes after selecting an audio bus
Fixed incorrect shape editing for cuboid shapes
Fixed debug rendering in 2d
Do not offset a collider when changing its size via shape editing
Fixed position reset when moving multiple objects at once
Fixed crash when attempting to bring a destroyed widget into view
Fixed terrain multilayer rendering
Fixed prefab hot reloading
Fixed heightfield collider not working (fix for rapier3d regression)
Fixed view jumping when selecting large tree view items in world viewer
Fixed incorrect id for default animation tracks data container
Fixed crash when undoing asset instantiation
Fixed root field name
Fixed inability to delete text in text box in some cases
Fixed camera preview being cutoff from the bottom
Fixed inability to copy built-in resources without a data source
Fixed height for search bar in property selector
Correctly leave preview mode when closing absm editor
Correctly leave preview mode when closing animation editor
Fixed asset selector style
Fixed text trimming in check box
Fixed warning from material field
Fixed tab control style
Fixed layout for bit field
Fixed text alignment for infinite constraints
Fixed incorrect descender calculation in case of infinite constraints
Fixed checkbox style
Fixed crash when loading a prefab with hierarchy modified in the base
Fixed infinite message loop in quat property editor
Fixed absm editor not working properly for game scenes
Fix naming for inspector actions
Fix naming some more
Fixed `already borrowed` panic
Fixed absm buttons
Fixed bitfield style
Fixed curve editor coordinate space
Fixed incorrect behavior of `open recent scene`
Fixed incorrect project name for `export-cli`
Fixed incorrect resource path fetching in material field editor
Fixed style for `add` and `remove` buttons for collections
Include `core` module in `fyrox` docs
Fix for macos fast scroll when pixel delta is received (#898)
Style fixes for material editor

## Added

CLI for project export
Ability to trim text with ellipsis
Input box widget
Tooltip with track property name
`UserInterface::try_send_response` helper
Ability to disable background curves in the animation editor
Ability to disable background curves for curve editor widget
Add built-in light style resource
Add exit confimation dialog for project manager
Added `donate` button for project manager
Added colors for scene item icons
Added missing code for surface data resource saving
Added more methods for `ImageButtonBuilder`
Added shadow for the text in the asset item
`BehaviorResult` alias + test fixes
`Color::hex`
`ImageButtonBuilder` helper + replaced `make_button_xxx`
`PluginContext::load_scene_or_ui` + fixed project template
`dispatch_behavior_variants` macro
`locate` button for material field
`locate` button for surface field
`make_image_toggle_with_tooltip` helper
Corner radius for text box
Property editor for triangle buffer
Property editor for vertex buffer
Ability to add keys for any numeric properties in the animation editor
Ability to add keys for selected nodes in the animation editor
Ability to minimize all editor panels
Ability to search for a loader for specific resource data type

## Changed

Absm editor improvements
Migrate to rapier 0.32
Do not echo sync-only messages
Improved validation for rigid bodies
Increase ambient lighting for asset preview
Update libloading dep
Do not try to use hole mask if `holes enabled` flag is off
Print info messages in automated tests only if `visual_debug == true`
Prevent message spam when executing editor tests
Do not reset camera state when doing any changes on it
Wrap asset title by word, not by letter
Improved log filtering in the editor
Improved numericupdown widget style
Improved style for docking anchor
Improved surface data editor style
Improved visual style for signals in animation editor
Improvements for animation editor
Improvements for audio preview panel
Moved build targets list to editor settings
Moved project build tools to `fyrox-build-tools` crate
Refactor window dragging logic to use local coordinates and clamp size/position (#899)
Refactored animation renaming + adding new animation
Refactored export cli to be a part of the game workspace
Refactored log filtering
Refactored scene loading to use plugin tasks
Print current version in the project manager window's title
Print warning message if backtrace capture is enabled
Disable info logging by default in project manager
Disable layer-related buttons when no layer is selected
Disable word wrap for node type
Adjust "open docs" button style
Adjust byte gap
Adjust default height map size for terrains to prevent warning message
Automatically enter preview mode when selecting a camera
Automatically zoom in on the new animation
Accept `NumpadEnter` on `Button` widget
Use bitmap image for check box instead of vector
Use correct resource for `locate` button in material field editor
Use correct resource for `locate` button in surface field editor
Use default style for new ui
Use image for `locate` button in resource field editor
Use toggle buttons for preview and loop options in animation editor
Use ui style when drawing keyboard focused widget bounds
Show animation player name in the window title
Show currently selected absm name
Send message box messages back
Save triangle buffer as a binary blob
Unify naming for built-in assets
Editor style improvements
Always show display name of the property if the doc is empty
Build target for project export options
Configurable constraint for dropdown list
Convert project name to standard format
Correctly handle dyn types on hot reloading
Correctly mark property editors when loading a dynamic editor plugin
Deactivate "add key" button if nothing is selected
Default ui for project manager
Defaults + docs for project exporter cli
Diagnostic messages when adding keys
Do not create a default user interface
Do not rebuild formatted text when visual transform changed
Draw keys on background curves
Helper methods for `HotKey`
Keep message flags when responding to changes in ScrollBar widget
Keep track of an assembly from which a dyn type originates from
Make keyboard shortcut text for menu item less bright
More efficient render data copying
More visual improvements for animation editor
Offload vertex transform to gpu when drawing widgets
Prevent highlighting rectangle of a focused widget to draw outside
Prevent redundant memory allocations during widgets drawing
Rename default name of the scene root to `SceneRoot` from `__ROOT__`
Reorganized log and command stack panel buttons
Save log filter state to the editor settings
Shuffle icon for uuid property editor
Simplified trait bounds for `load_ui`
Split animation editor toolbar in a top and bottom parts
Support `FrameworkError` in `GameError`
Unified scene/ui loading + refactored async script/plugin tasks

## Removed

Remove `Mobility` because it does nothing
Removed context menu from texture field, replace with buttons
Removed redundant tree traversal in widgets drawing
Removed unused import
Removed useless message when saving settings