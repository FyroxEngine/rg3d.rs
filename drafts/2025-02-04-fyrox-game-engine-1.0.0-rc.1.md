---
title: "Fyrox Game Engine 1.0 Release Candidate"
date: "2025-09-30"
description: "Fyrox 1.0.0-rc.1 is intermediate release intended for beta testing before releasing stable 1.0"
categories: 
- General
meta:
  - property: og:title
    content: Fyrox 1.0.0-rc.1
  - property: og:description
    content: Fyrox 1.0.0-rc.1 is intermediate release intended for beta testing before releasing stable 1.0
  - property: og:type
    content: article
  - property: og:url
    content: https://fyrox.rs/blog/post/fyrox-game-engine-1.0.0-rc.1/
  - property: og:image
    content: https://fyrox.rs/assets/1.0.0-rc.1/particle_system.gif
---

I'm happy to announce that Fyrox 1.0.0-rc.1 was released! Fyrox is a modern game engine written in Rust, it helps you to create 2D and 3D games with 
low effort using native editor; it is like Unity, but in Rust. 

This is an intermediate release intended for beta testing before releasing stable 1.0. The testing includes the engine, the editor, the docs and 
the book. If you find a bug, confusing or incomplete documentation please file an issue or propose a solution by creating a pull request.

The list of changes in this release is huge, there's a ton of fixes and new functionality.



## What's Next?

The next major goal for the project is to release Fyrox 1.0, which is planned for December 2025. 

## Support

If you want to support the development of the project, click [this link](https://fyrox.rs/sponsor.html). Also, you can help by 
fixing one of the ["good first issues" ](https://github.com/FyroxEngine/Fyrox/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22),
adding a desired feature to the engine, or making a contribution to the [book](https://github.com/fyrox-book)

## Full List of Changes

The list is split into four sections for ease of reading and finding particular information.

## Fixed

- Fixed performance issues when deleting an object in the editor
- Use ambient occlusion from material info in ambient lighting shader
- Fixed skybox editing in scene settings
- Fix build window (handle stderr and stdout in different threads)
- Fixed ssao rendering
- Exit build mode after successful build
- Prevent loss of piped data due to BufReader dropping
- Fixed cube texture to use only one size parameter instead width+height
- Fixed layout of resource property editor
- Fixed reflection probe rendering with fxaa enabled
- Add details to FieldTypeDoesNotMatch error to improve warnings
- Check if a property can be cloned/pasted in the inspector
- Fixed box selection in the editor
- Improved selection order in the editor
- Context menu handling for various inspectors
- Fixed smart placement for move interaction mode
- Fixed grid blending issues
- Fail-safe shader/material handling when rendering
- Fixed incorrect sampler params
- Prevent clamping for infinite available size in UI
- Fixed axes colors for grid shader
- Adjust grid cell size to match grid snapping options
- Support all three major plane orientations (oXZ,oXY,oYZ) in grid shader
- Improved selection in the editor
- Fixed incorrect viewport handling for camera render targets
- Do not crash if render data couldn't be created, return an error instead
- Filter out editor-specific scene nodes when using camera preview
- Remove render data for destroyed cameras
- Use separate render target for camera preview in the editor
- Added missing tab labels for 'Settings' and 'Navmesh' panels
- Added missing interaction modes shortcuts for terrain and navmesh
- Fixed terrain holes incorrect command name
- Making relative paths for loading and saving scenes
- Remove redundant BrushMacro method remove_cell
- Highlight allowed types better in the node selector
- Use typed_ref/mut methods in graph indexing impl
- Show/hide camera preview image
- Fixed interaction mode order in the toolbar to follow indices: 1..6
- Fixed distance sorting for meshes
- Collect only supported resources + ignore resources from excluded dirs
- Fixed render order to be back-to-front for correct blending
- Improved gizmo and exposed scale in editor settings
- Prevented the camera frustum in debug draw from being scaled
- Improved camera focus distance to be less close to the object
- Correcting make_relative_path and scene saving logic.
- Allowing make_relative_path to accept non-existing files
- Improving error reporting for missing InspectorEnvironment
- Fixed scene gizmo lighting
- Fixed crash when an invalid asset is drag-dropped onto a surface field
- Fixed crash when an empty string is used in the asset browser search
- Fixed crash when CSM near and far values are superimposed
- Fixed documentation for VisitError::NotSupportedFormat
- Made "Show in explorer" work on other OS's
- More concise naming for Reflect methods
- Handle UI scaling in Screen Widget
- Fixed potential crash in the editor
- Improved performance of dynamic drawing methods
- Fixed resource registration
- Fixed deadlock when loading a resource
- Preserve global transform when reparenting scene nodes
- Fixed misleading docs
- Fixing minimization for windows.
- Fixed distance sorting
- Reset editor camera rotation when in 2d mode
- Fixed matrix2 deserialization
- Fixing cut-off text in tooltips
- Protecting against resource deadlock
- Hold mutex locks as short as possible to prevent deadlocks
- Use blocking resource registry updating where possible
- Correcting terrain hole mask bug
- Fixed asset item context menu not showing on rmb click
- Do not try to reload unsupported resources.
- Moving plugin and script handling to before node handling, to fix teleportation glitch
- Print error message instead of silently writing an error to the resource
- Use trait upcasting and remove `as_any` for `ResourceData`
- Fixed usages of ResourceKind
- Fixed asset preview generation
- Fixed built-in resource handles deserialization
- Ability to create metadata files
- Proper headless mode
- Hide asset preview if there's no actual preview data for it
- Fixed gltf shader
- Fixed incorrect syncing of modified flag in property editor
- Prevent annoying message spam when import options is missing for asset
- Fixed ambient lighting in case of non-skybox lighting
- Render overlay icons only in the scene preview
- Hide "revert" button for inheritable properties when no parent object
- Improved performance of visual transform calculation in ui
- Improved ui performance
- Fixed blending issues when batching multiple rectangles
- Fixed fitting for asset preview
- Fixed visual glitch for scaling, rotation, movement gizmos
- Fixed update loop state in the editor
- Fixed deletion of gl vao/gpu programs/textures
- Fixed incorrect caching/binding of gl framebuffer
- Handle invalid aabb/division by zero when doing camera fitting
- Fixed menu item content alignment + `make_menu_splitter` helper
- Reset visual state of a selected option in the dropdown list on select
- Fixed asset preview update when a resource changes
- Significantly reduced annoying visual lag when generating asset previews
- Correctly detach content of control panels of various entities
- Fixed text alignment in various places in the editor
- Fixed asset preview
- Do not stop deserialization on invalid resource refs
- Fixed inability to add animation track for a node
- Better lighting for asset preview
- Fixed torus faces orientation
- Fixed deferred preview generation for assets in asset selector
- Fixed `Option::None` serialization
- Fixed camera picking issues
- Do not change resource uuid when moving it in the editor
- Log window improvements + fixes
- Fixed crash when trying to select text in the text box via double click
- Fixed resource movement in the asset browser
- Fixed incorrect position of dragndrop preview when dpi scaling is used
- Update asset preview if the asset changes
- Properly handle added/removed resources to/from the resource registry
- Use correct material in `MaterialFieldEditor`
- Fixed crash in case of invalid material resource used in ui renderer
- Fixed request of built-in resources in the resource manager
- Fixed incorrect color space in standard forward pass of standard shaders
- Fixed black screen bug when saving a scene with active camera preview
- Prevent deadlock when trying to get a debug name for gpu texture
- Fixed incorrect ambient lighting calculation
- Reduced memory usage when generating asset previews
- Clamp anisotropy in `[1.0; 16.0]` range to prevent video driver errors

## Added

- Added image-based lighting (IBL)
- Name for gpu buffers
- Named gpu textures
- Ability to specify mip level for frame buffer attachments
- `GraphicsServer::create_cube_render_target`
- Added runs to FormattedText
- `Texture::new_cube_render_target`
- Environment mapping
- Reflection probe node
- `fyrox_widgetData` built-in property group
- Ability to specify custom shaders for widgets
- Documentation and helper methods for colliders
- Implementing Debug and Display for BitMask.
- Brdf lut generator
- Ability to copy/paste values in the editor setting's inspector
- `UserInterface::has_descendant_or_equal`
- `Inspector::handle_context_menu_simple`
- `GpuShader` entity
- `Reflect::try_clone_box`
- Ability to copy/paste values in inspector
- Added `is_significant` method for editor commands
- Show grid in 2d mode in the editor
- Docking manager for asset browser
- Echo popup messages
- `Copy Value` + `Paste Value` options in context menu of `Inspector`
- Collect property paths in the inspector widget
- `UserInterface::send_messages` to send multiple messages at once
- Implemented `BorrowAs` trait for widget handles
- Enhanced tile set editing, copying pages
- Debug impl for NodeHandleMap
- Movable scene tabs
- `GraphicsServer::generate_mipmap`
- `RendererResources` with pre-loaded resources
- Ability to specify the face of the cube map in frame buffer attachment
- Environment cube map prefilter shader
- Blanket impl for ScriptMessagePayload replaced with derive macro
- Print allowed type name in the node selector + do type checking
- Ability to set derived handle types in the handle editor
- Dynamically typed script messages
- Added a setting to modify editor camera's mouse sensitivity
- `Reflect::fields_info_mut` + optimizations
- More methods for handles accessed via reflection
- Improvements to autotiling
- Multithreaded wave function collapse
- Adding empty tiles to tile map brush
- Render target for cameras
- Thread sleep in headless executor
- `ResourceLoader::convert` impl for native scenes
- Added `ResourceIo::copy_file` method
- Added visitor version number
- Added option to use %MANIFEST_DIR% to open IDE in project manager
- Add render mask to Base node
- Docs improvements for serialization
- Universal `Visitor::load_from_memory` with format autodetection
- Tests for `move_resource`
- Integration tests for fyrox-resource
- Adding support for kinematic physics
- `RG16F` texture format
- Allow user to change editor icon and customize window title
- Tooltip for material resources in the material editor
- Ability to fetch memory usage by the graphics server
- Ability to disable asset convertion when exporting a project
- Convert ui scenes to binary format when exporting a project
- Print warning messages in the log when setting terrain height map
- Resource registry `ResourceManager::register` + `ResourceManager::uuid_to_path` methods
- Introducing multi-window docking tiles
- Resource registry
- `ResourceIo::write_file` + rename `FileLoadError->FileError`
- `ResourceLoadersContainer::is_supported_resource`
- Show selected path in the main window of the asset browser
- Uuids for resources
- Ascii reader and writer for visitor
- Added `#[inline]` attributes for ui drawing methods
- Configurable fadeout margin for particle systems
- Fyrox-graphics documentation
- Ability to disable picking restriction for popup widget
- Ability to create gpu program from shaders
- Ability to reset widget's visual state via respective message
- Ability to reset editor layout
- Cell property editor
- Placeholder icon for resources without preview generator
- Added placeholder icon for asset items whose preview is being generated
- Loading scenes list window when loading scenes in the editor
- Async loading for game and ui scenes in the editor
- Ability to specify special title for root item in the filebrowser widget
- Ability to paste properties in resource inspector
- Ability to inspect and edit supported assets in inspector
- Footer attachment point for inspector plugin
- `AssetSelection` + inspect asset import options in standard Inspector
- Helper methods for selection downcasting
- Ability to move a folder with resource in the resource manager
- Configurable depth for `walk_directory` method
- Asset rename dialog improvements
- Ability to rename assets in the asset browser
- Add small margin for asset preview
- Skybox api improvements
- Added folder icon for file browser
- Ability to select environment light source for scenes
- `Brush` helper methods
- Better navigation in the asset browser
- Ability to enable or disable debug names for GPU objects
- Added confirmation dialog for asset deletion
- Use checkerboard background for asset preview tooltips
- Improved texture property editor
- Increased size of material preview
- Preview for surface data editor
- Preview for material property editor
- Magnified asset preview for resource property editor
- Show asset preview in resource field editor
- Texture property editor improvements
- `AssetSelectorWindowBuilder::build_for_type_and_open`
- Ability to disable size sync of `Image` widget with its texture
- Helper function `make_pick_button`
- Generate preview for items in asset selector
- Asset selector
- Helper methods for `ResourceState`
- Direct immutable access to underlying container for ResourceRegistry
- `ResourceManager::can_resource_be_moved`
- Highlight asset item when it accepts drop
- Check for drop content in the file browser to show correct cursor icon
- Custom `accepts_drop` for `AssetItem` that checks if drop is possible
- Allow to define custom drop response method on ui widgets
- Improved visual style of `AssetItem`
- Ability to move a folder when dropping it to some other folder
- Ability to move a resource by dropping it to a folder asset item
- Ability to move a resource by path without loading it
- `impl Display for FileError`
- `ResourceRegistry::remove_metadata`
- `ResourceIo::delete_file+delete_file_sync`
- `UntypedResource::type_uuid_non_blocking`
- Ability to specify pre and post visit method calls for visitor codegen
- Ability to try get resource manager state lock for the given time period
- Style api improvements
- Ability to re-bind styled properties of widgets in the editor
- Joint motors
- Show graphics server memory usage in the editor's rendering statistics

## Changed

- Use scene skybox if there's no specific environment map
- Do not prevent building without the opened scene
- Remove dependency on status code 101 (which is cargo specific, while built-tool has tool-agnostic design)
- Detached renderer from scene's `Camera`
- Moved sky box to scene from camera
- Enable seamless cube map filtering by default
- Include breadcrumb into VisitError:RegionDoesNotExist
- Moved all shaders into a centralized storage
- Moved opengl-specific code to `fyrox-graphics-gl`
- Build tool now streams both stdout and stderr
- Increased window size and inspector name column width in settings
- Smart selection of corner arc subdivision when drawing borders
- Recalculate clip bounds only for changed widgets
- Allow engine user control default editor settings
- Use `MaterialResource` in widgets instead of `UntypedResource`
- Refactored ui renderer to use materials
- Documented keyboard focus
- Separate brush for highlighting widgets with keyboard focus
- Prevent selection of asset items while holding alt
- Moved material/shaders to `fyrox-material` crate
- Use separate struct for args for `InspectorContext::from_object` func
- Include all nodes that produces render data in camera picking in editor
- Convert assets to their most efficient version when exporting a project
- Reducing dependencies of fyrox-autotile
- Use sampler+texture pair instead of old-fashioned combined texture
- Migrate to latest winit/glutin/rapier
- Disable texture lod bias for wasm builds
- Moved `set_panic_hook` to engine initialization for wasm builds
- Disable picking restriction for menus and context menus
- Change layout of command stack panel
- Save ui scenes in ascii mode by default
- Normalize paths before passing them to `ResourceManager::request`
- Close a menu by clicking on the menu item.
- Improved docs of `Resource::data_ref`
- Split `FieldInfo` into two parts `FieldInfo` + `FieldMetadata`
- Moving control panels to inspector head
- Merged `DerivedEntityListProvider` trait into `Reflect` trait
- Refactored node handle property editor to accept typed handles
- Register property editors for scene/ui node handles
- Refactored `NodeHandlePropertyEditorDefinition` to accept generic type
- Use typed handles in 2d joints
- Less bright icons for scene nodes
- Do not recreate render target for asset preview if preview is collapsed
- Explicitly disabled unsupported render passes in standard widget shader
- Reduced contrast of the text/images in the default dark theme
- Do not save `NEED_SYNC` flag when serializing an inheriable variable
- Correcting how ScriptPropertyEditorDefinition accesses environment
- Refactor resource manager to use hash map for resources
- Use stable ids when serializing rc/arc
- Isolated visitor's reader and writer into separate entities
- Reversing generate_free_handles to match spawn
- Refactored resource system to use uuids instead of path where possible
- Track vertex/fragment shader line location
- Tidy up menus in the editor
- Vector flattened structure for serialization
- Close dropdown lists on selection
- Open context menus on rmb-up event instead of rmb-down
- Beautifying bitfield widget
- Adding adjustable warning messages to autotile failures
- Select asset item by rmb click
- Expose instance id in the inspector
- Use doc comment for property description
- Expose more properties in the inspector
- Unhide node's global transform in the inspector
- Keep the editor active until it loads all the queued scenes
- Use special root title for project's root folder in the asset browser
- Override title for the root item in the asset browser
- Only show folders that in the registry in the asset browser's dir viewer
- Show only content from the resource registry in the asset browser
- Use command-based approach when editing resources in the inspector
- Use respective command to change selection in the asset browser
- Save the resource data on change in the inspector
- Hide asset previewer for assets without a preview
- Moved asset preview to the inspector
- Moved selection-specific code to selection itself
- Show pretty type name in resource creator
- Search in resource registry when searching in the asset browser
- Better validation for file name when doing move
- Do not allow to delete built-in resources
- Improved FormattedText
- Use flat gray color background for asset previews
- Green color for `add resource` button
- Disable `duplicate` and `dependencies` context menu items for folders
- Use calculated local instead of screen position when setting new desired position after toggling of a view
- Bring selected item into view in the list view when arrow navigating
- Use texture property editor for texture bindings in material editor
- Use helper methods in resource property editor
- Increased margin on `Stop` button in build window
- Improved validation when moving a resource
- Check if a resource can be moved when moving an asset in asset browser
- Moved tooltip from asset item to its text field
- Make paths os-independent and canonical when moving a resource
- Do not allow to create a resource outside of the data folder
- Allow to use build tool with executable that doesn't expect "--" as passthrough marker
- Build tools: delegate stderr to Log
- Removed redundant empty impls of InteractionMode trait
- Share fbx materials as much as possible
- Store a style handle in the widget

## Removed

- removed resource duplicates
- removed invalid assertions
- removed redundant `ResourceLoaderAsAny` trait
- removed wasm-unsupported `set_border_color` of gpu texture
- removed `get_image+read_pixels` methods from gpu texture
- removed impls for `field/field_mut`
- removed redundant codegen for field/field_mut methods
- removed `Relfect::fields/fields_mut` methods
- removed `owner_type_id` field from `FieldInfo`
- removed redundant `type_name` field from `FieldInfo`
- removed `Downcast` trait, replaced with `define_as_any_trait` macro