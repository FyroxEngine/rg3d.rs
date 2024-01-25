---
title: "Fyrox Game Engine 0.33"
date: "2024-01-24"
description: "Fyrox 0.33 includes new UI editor, rendering improvements, various editor improvements, 
script API improvements, async tasks, book improvements and more."
categories: 
- General
meta:
  - property: og:title
    content: Fyrox Game Engine 0.33
  - property: og:description
    content: Fyrox 0.33 includes new UI editor, rendering improvements, various editor improvements, script API improvements, async tasks, book improvements and more.
  - property: og:type
    content: article
  - property: og:url
    content: https://fyrox.rs/blog/post/fyrox-game-engine-0-33/
  - property: og:image
    content: https://fyrox.rs/assets/0.33/highlight.gif
---

I'm happy to announce that Fyrox 0.33 has been released! Fyrox is a modern game engine written in Rust, it helps
you to create 2D and 3D games with low effort using native editor; it is like Unity, but in Rust. This release includes
new UI editor, rendering improvements, various editor improvements, script API improvements, async tasks, book improvements 
and more.

## Introduction

Before we begin, check out [demo projects](https://fyrox.rs/examples.html) of the engine - it is a set of applications
and games made with the engine. You can also check [games](https://fyrox.rs/games.html) section of the website to 
see which games are made using the engine.

## How to Update

At first, update the `fyrox-template` by using `cargo install fyrox-template --force` and then execute the following
command in your project root directory: `fyrox-template upgrade --version=latest`. There will be some compilation 
errors, but Rust compiler should help you to fix them. There are a lot of _small_ breaking changes that could be 
fixed pretty easily. Data compatibility was preserved in 99% of cases, so your previous assets should load fine.

## UI Editor

<YtVideo url="https://www.youtube.com/embed/qQTxEK5TTxM" />

This is the most important part of the new release. The UI editor was requested by the community quite a long time ago 
and now it's basic version is finally added. It still incomplete in some places, but despite that, very useful. 

The editor can edit special kind of scene called UI-scene. UI scenes have pretty much nothing in common with 
standard game scenes and completely isolated from them. There's a number of reasons why UI widgets are not 
classic scene nodes and you can read about this [here](https://fyrox-book.github.io/ui/editor/editor.html).

To load a UI scene like in the video above and do some actions when buttons clicked, you can do the following:

```rust
pub struct Game {
    new_game: Handle<UiNode>,
    exit: Handle<UiNode>,
}

impl Game {
    pub fn new(_scene_path: Option<&str>, ctx: PluginContext) -> Self {
        // Spawn async task that will load the UI.
        ctx.task_pool.spawn_plugin_task(
            UserInterface::load_from_file("menu.ui", ctx.resource_manager.clone()),
            |result, game: &mut Game, ctx| {
                let ui = ctx.user_interface;
                *ui = result.unwrap();
                game.new_game = ui.find_by_name_down_from_root("NewGame");
                game.exit = ui.find_by_name_down_from_root("Exit");
            },
        );

        Self {
            new_game: Handle::NONE,
            exit: Handle::NONE,
        }
    }
}

impl Plugin for Game {
    fn on_ui_message(&mut self, ctx: &mut PluginContext, message: &UiMessage) {
        if let Some(ButtonMessage::Click) = message.data() {
            if message.destination() == self.new_game {
                ctx.user_interface.send_message(WidgetMessage::visibility(
                    ctx.user_interface.root(),
                    MessageDirection::ToWidget,
                    false,
                ));
            } else if message.destination() == self.exit {
                if let Some(window_target) = ctx.window_target {
                    window_target.exit();
                }
            }
        }
    }
}
```

This code spawns an async task in `Game::new` that will load the UI scene in a separate thread and when it
is done, it will replace current UI instance in the context with the loaded one. To do something useful when
our buttons clicked we're using `on_ui_message` method from plugin - it is called when there's any message
from the UI.

## Navigational Mesh

![navmesh](https://fyrox-book.github.io/ai/navmesh.gif)

Navigation on navmeshes was improved using string pulling algorithm. This algorithm straightens path on the 
navmesh and makes it less jagged. It also possible now to specify radius for navmesh agent and it will use 
this radius to turn around the corners of the navmesh like so:

![navmesh2](https://fyrox-book.github.io/ai/agent_radius.gif)

It is now possible to calculate paths on a navmesh using async tasks. It could be done like so in one of your
scripts:

```rust
#[derive(Visit, Default, Reflect, Debug, Clone)]
struct MyScript {
    navmesh: Handle<Node>,
    path: Option<Vec<Vector3<f32>>>,
}

impl ScriptTrait for MyScript {
    fn on_start(&mut self, ctx: &mut ScriptContext) {
        // Borrow a navigational mesh scene node first.
        if let Some(navmesh_node) = ctx
            .scene
            .graph
            .try_get_of_type::<NavigationalMesh>(self.navmesh)
        {
            // Take a shared reference to the internal navigational mesh.
            let shared_navmesh = navmesh_node.navmesh();

            // Spawn a task, that will calculate a long path.
            ctx.task_pool.spawn_script_task(
                ctx.scene_handle,
                ctx.handle,
                async move {
                    let navmesh = shared_navmesh.read();

                    if let Some((_, begin_index)) =
                        navmesh.query_closest(Vector3::new(1.0, 0.0, 3.0))
                    {
                        if let Some((_, end_index)) =
                            navmesh.query_closest(Vector3::new(500.0, 0.0, 800.0))
                        {
                            let mut path = Vec::new();
                            if navmesh
                                .build_path(begin_index, end_index, &mut path)
                                .is_ok()
                            {
                                return Some(path);
                            }
                        }
                    }

                    None
                },
                |path, this: &mut MyScript, _ctx| {
                    this.path = path;

                    Log::info("Path is calculated!");
                },
            );
        }
    }

    fn on_update(&mut self, ctx: &mut ScriptContext) {
        // Draw the computed path.
        if let Some(path) = self.path.as_ref() {
            for segment in path.windows(2) {
                ctx.scene.drawing_context.add_line(Line {
                    begin: segment[0],
                    end: segment[1],
                    color: Default::default(),
                })
            }
        }
    }
}
```

This could be useful for large game levels with complex navigational meshes where you can spawn multiple tasks per 
frame (or per bunch of frames) to do calculations asynchronously.

## Scripts

Scripting API was significantly improved and now you need to write much less code and you have much wider 
access to the engine entities from scripts. This is how a smallest possible script was look like in Fyrox 0.32:

```rust
#[derive(Visit, Reflect, Default, Debug, Clone)]
pub struct MyScript { }

impl_component_provider!(MyScript);

impl TypeUuidProvider for MyScript {
    fn type_uuid() -> Uuid {
        uuid!("948ba50d-0fd1-4947-b94c-0d6080bb6f74")
    }
}

impl ScriptTrait for MyScript {
    fn id(&self) -> Uuid {
        Self::type_uuid()
    }
}
```

And this is how it looks like in 0.33:

```rust
#[derive(Visit, Reflect, Default, Debug, Clone, TypeUuidProvider, ComponentProvider)]
#[type_uuid(id = "4a6399ac-2f3e-4488-8ea9-743abb86ab36")]
#[visit(optional)]
pub struct MyScript { }

impl ScriptTrait for MyScript { }
```

The new version significantly smaller: 5 lines of code vs 13 in the old version. This greatly reduces any
distractions with insignificant portions of code and helps you to focus on your own code. What's previously was
implemented using macros, now is implemented using `#[derive]` attribute. As you can see, `TypeUuidProvider` and
`ComponentProvider` now implemented this way. Also, please note a new attribute at the top of the script declaration:
`#[visit(optional)]` it marks all fields of the struct optional, and the deserializer won't complain if some field
is missing on load. This is very useful, to be able to add new fields freely to your script.

Scripts now have access to current graphics context (which gives you access to the main window and renderer),
task pool (allows you to spawn async tasks from scripts), user interface (now you can directly access widgets
from scripts), current scene handle.

In Fyrox 0.32, `ScriptContext` had `plugins` field, which gives you access to plugins from scripts. It was
quite tedious to access plugins from scripts: `ctx.plugins.iter().find_map(|p| p.cast::<MyPlugin>()).unwrap()`. Now 
it is much easier: `ctx.plugins.get::<MyPlugin>()`.

## Async Tasks

Fyrox now supports task-based programming for both scripts and plugins. Task is a closure that does something in a 
separate thread and then the result of it is returned back to the main thread. This is very useful technique, that 
allows you to perform heavy calculations using all available CPU power, not just one CPU core with a single main 
thread. Tasks could be used for pretty much anything, that can be done as a separate piece of work. Graphically 
it could represented like this:

![tasks](https://fyrox-book.github.io/scripting/task.svg)

For example, this is how you can spawn a task in your plugin that loads a file in a separate thread and when it's 
done, it stores the loaded data in the plugin itself on the main thread.

```rust
struct MyGameConstructor;

impl PluginConstructor for MyGameConstructor {
    fn create_instance(
        &self,
        _scene_path: Option<&str>,
        context: PluginContext,
    ) -> Box<dyn Plugin> {
        Box::new(MyGame::new(context))
    }
}

struct MyGame {
    data: Option<Vec<u8>>,
}

impl MyGame {
    pub fn new(context: PluginContext) -> Self {
        context.task_pool.spawn_plugin_task(
            // Emulate heavy task by reading a potentially large file. The game will be fully
            // responsive while it runs.
            async move {
                let mut file = File::open("some/file.txt").unwrap();
                let mut data = Vec::new();
                file.read_to_end(&mut data).unwrap();
                data
            },
            // This closure is called when the future above has finished, but not immediately - on
            // the next update iteration.
            |data, game: &mut MyGame, _context| {
                // Store the data in the game instance.
                game.data = Some(data);
            },
        );

        // Immediately return the new game instance with empty data.
        Self { data: None }
    }
}

impl Plugin for MyGame {
    fn update(&mut self, _context: &mut PluginContext) {
        // Do something with the data.
        if let Some(data) = self.data.take() {
            println!("The data is: {:?}", data);
        }
    }
}
```

Tasks should be used to perform sensible amount of work, simply because each task has its own overhead and it could
be larger than the actual task if the task is tiny.

## Dynamic Font Atlas

For a long time fonts in Fyrox had quite rudimentary support and it was quite tricky to change font size of a text 
at runtime. In this release this was finally fixed by adding support for dynamic font atlases. Dynamic atlas is a 
very simple concept: texture atlas of the font is split into multiple pages, where each page corresponds to its own
character size and each pages could also be split into multiple chunks. Multiple chunks is needed, because there's 
is a hardware limit for the maximum texture size. 

You can now easily change font size in the UI of Text and TextBox widgets, this could be done like so:

```rust
fn set_font_size(text: Handle<UiNode>, ui: &UserInterface, new_font_size: f32) {
    ui.send_message(TextMessage::font_size(
        text,
        MessageDirection::ToWidget,
        new_font_size,
    ))
}
```

## Batching 

Some parts of renderer now uses batching for rendering that improves rendering performance quite a lot. It is now
used in 2D rendering, particle systems, 3D sprites.

## Animation Refactoring

Animation-related code was isolated in a separate crate called `fyrox-animation`. Despite the name of it you 
can still use it without Fyrox at all. The crate provides quite powerful ready-to-use animation system, that
includes:

- Key frame animation.
- Animation blending with state machine.
- Timeline events.
- Root motion.
- Optional reflection-based property modification of an animatable object.
- Sprite sheet animation.

It was moved into the separate crate, because there's a plan to add animation support for the user interface
scenes, that were introduced in this release.

## IO Abstraction

It is now possible to use new IO abstraction to add support for virtual file systems. It could be used to provide
access to assets located in ZIP-archives for example.

![resource io](/assets/0.33/resource_loader.png)

## Material Rework

Material is was turned into resource, which means that you can save materials on disk, share them across
multiple surfaces. Sprites (3D), rectangles (2D), particle systems are now using materials instead of dedicated 
renderer with limited functionality. This greatly improves rendering flexibility.

## Editor Improvements

The editor has a ton of various changes, improves and fixes. Here's the most significant changes. 

### Edge Highlighting

![highlight](/assets/0.33/highlight.gif)

The editor now highlights currently selected objects, which helps to find the selected object and see its
actual shape. This is especially useful if you either have a dark area or a bunch of objects.

### Gizmo Improvements

![gizmo](/assets/0.33/gizmo.gif)

Movement, rotation, scaling gizmos were improved in this release. The gizmos are now react to the cursor which 
makes it much more comfortable to work with - you definitely know that you're clicking on a gizmo,
not something behind it. In general, all gizmos now are closer to the industry standard.

### Collider Fitting

It is now possible to fit colliders to actual object bounds in just one click. The editor now automatically opens
a collider control panel with a single `Fit` button.

### Ability to Create Assets

Asset browser can now create new assets and save them to disk. This could be done using small `+` button near the
search bar:

![new asset](/assets/0.33/new_asset.png)

You can create not just built-in asset types from this window, but also your own resource types.

### Camera Visualization

![camera frustum](/assets/0.33/camera_frustum.png)

Camera frustum is now visualized in the editor which makes it easier to position and find it in the scene.

### Ability to Move Assets

You can now move assets and folders with assets in the Asset Browser. This operation automatically fixes all the
links in the assets that has references to the moved ones.

### Placeholder Texture

![placeholder](/assets/0.33/placeholder.png)

The editor now assigns a placeholder texture for objects without a texture to make them look nicer. This texture
is also available in the asset browser and can be assigned to pretty much any material.

### Other

It is now possible to start the editor with multiple scenes at once. This saves a lot of time when you need to
work with a bunch of scenes and restart the editor often. 

You can now connect a state with every other in the ABSM editor like so:

![transition](/assets/0.33/transition.gif)

## Network

This release also contains some experimental support for multiplayer games. `fyrox-core` now have a `net` module, 
which contains a thin abstraction layer, that allows you to establish connection between devices over the network 
and send various messages between them. You can see it in action in 
[this project](https://github.com/mrDIMAS/FishFolly).

## Book Improvements

The book in this release has tons of improvements as well, there are the following changes:

- Tutorials rework (see below)
- Custom widgets
- Navmesh improvements
- Shaders usage example
- Built-in properties of shaders
- Drawing parameters
- Animation usage
- Animation signals
- ABSM chapter improvements (including events)
- Mesh data buffers
- Ui Editor
- Font chapter rework
- Changed default theme to dark
- Removed obsolete information
- Added chapters for `Screen`, `ScrollViewer`, `ScrollPanel`, `VectorImage` widgets.
- Chapter about root motion
- Async tasks
- Light maps
- Input handling (mouse, keyboard)
- Sprite animation
- Accessing other script's data
- Window management
- NixOS build instructions (kudos to [@stillinbeta](https://github.com/stillinbeta))

The book is also slowly getting refactored - source code of snippets is now slowly moving from the book
source to a separate cargo project, and the code snippets are referenced directly from this project.

## Tutorials

FPS tutorial was fully rewritten using the latest engine version. As before, it is split in three
parts:

- [Character Controller](https://fyrox-book.github.io/tutorials/fps/tutorial-1/fps-tutorial.html)
- [Weapons](https://fyrox-book.github.io/tutorials/fps/tutorial-2/fps-tutorial-2.html)
- [Bots and AI](https://fyrox-book.github.io/tutorials/fps/tutorial-3/fps-tutorial-3.html)

There's also a set of community tutorials, which you can find in the [respective chapter](https://fyrox-book.github.io/tutorials/community.html) of the book.

## Full List of Changes

The list is split into four sections for ease of reading and finding particular information.

### Added

- UI editor.
- Tasks system for scripts and plugins.
- Implemented dynamic font atlas.
- Batching for 2D graphics.
- Ability to move resources and folders in the Asset Browser.
- Edge highlighting for selection in the editor.
- Added an ability to create resources from asset browser.
- Added height parameter for `Text` and `TextBox` widgets.
- Ability to specify IO abstraction when loading user interface.
- `Utf32StringPropertyEditorDefinition` to edit `Vec<char>` UTF32 strings.
- `RefCellPropertyEditorDefinition` for `RefCell<T>` types.
- Enable reflection + serialization for formatted text and its instances.
- Built in font resource.
- Font resource property editor with font preview. 
- Ability to assign fonts from asset browser.
- Reflection for resources.
- UI graph manipulation methods.
- `Screen` widget  automatically fits to the current screen size.
- Show type name in world viewer for widgets.
- Ability to specify ignored types for `Reflect::apply_recursively`.
- Preview for curve and hrir resources.
- Ability to open a window at desired position.
- Ability to edit textures as UntypedResource in widgets.
- Implemented `Serialize + Deserialize + Display` traits for `ErasedHandle`.
- Smart positioning for contextual floating panels in the editor.
- `WidgetMessage::Align` + `WindowMessage::OpenAndAlign` messages.
- Ability to invalidate layout for all widgets at once.
- Ability to mark all fields of a struct/enum optional when deserializing: `#[visit(optional)]` can now be 
added to a struct/enum directly, thus overriding all other such attributes on fields.
- Added access to user interface, task pool, graphics context, current scene handle for scripts.
- `PluginsRefMut::get/get_mut/of_type_ref/of_type_mut` methods.
- Added a bunch of `#[inline]` attributes for `Pool` for slight performance improvements. 
- Added `AtomicHandle` that can be modified using interrior mutability.
- Ability to pass pixel kind to the `Renderer::render_ui_to_texture` method.
- Show material resource state in the material field editor.
- Ability to scroll to the end of the content for `ScrollViewer` and `ScrollPanel` widgets.
- Ability to save and load light maps into/from a file.
- Ability to repeat clicks of a button while it is pressed.
- Ability to open materials for editing from the asset browser.
- Ability to filter a list of types when using reflection for fields iteration.
- Implemented `PartialOrd + Ord` traits for `Handle` type.
- Added icon in the asset browser for material resources.
- Ability to pass generics to `uuid_provider` macro.
- Ability to share navigational mesh across multiple threads.
- Implemented `Reflect` trait for `RwLock`.
- `UserInterface::find_by_name_down_from_root` method to search widgets by name.
- Implemented `Send` trait for UI entities.
- Added user interface resource.
- Collider control panel with ability to fit colliders to parent bounds.
- Property editor for vector image's primitives.
- Show warning in the log when there's script message with no subscribers.
- Implemented `TypeUuidProvider` trait for standard types.
- Ability to specify clear color in `Renderer::render_ui_to_texture`.
- Added icon in the asset browser for shader resources.
- Ability to copy widgets from UI to UI.
- Ability to create ragdolls from `Create` menu.
- Added an ability to rebind tracks in the animation editor.
- Added a set of standard materials, exposed them in the editor.
- Added placeholder texture.
- Ability to fetch resource import options from their respective loaders.
- Implemented `Visit` and `Reflect` traits for `char`.
- Ability to specify icons for assets in respective preview generators.
- `TypedResourceData` trait to be able to set correct default state of a resource.
- Implemented `ResourceData::save` for built-in engine resource types.
- Documentation for LODs.
- Color constants for the colors with names.
- Ability to save resources.
- `ResourceLoader::supports_extension` method.
- Implemented `Error` trait for `VisitError`.
- `Material::set_texture` shortcut.
- Implemented `From<&str>` trait for `ImmutableString`.
- Added normalization option for vertex attribute descriptor.
- Added experimental network abstraction layer.
- Added frustum culling for rectangle node.
- Added camera view pyramid visualization (kudos to [@dasimonde](https://github.com/dasimonde)).
- Added IO abstraction for resource system (kudos to [@jacobtread](https://github.com/jacobtread)).
- Added `Reflect`, `Debug`, `Visit` trait implementations for UI widgets.
- Added `Visit` trait implementation for `usize/isize`.
- Added `ResourceIo::move_file` method.
- Added `ResourceManager::move_resource` method with filtering.
- Added `Drop` message for `FileBrowser` with dropped path.
- Added `ResourceIo::canonicalize_path`.
- Added `Pool::generate_free_handles` methods.
- Added `InteractionMode::make_button` method that creates appropriate button for the mode.

### Changed

- Major editor refactoring to support new UI scenes.
- Moved low level animation modules into fyrox-animation crate.
    - Type aliases for scene specific animation entities + preludes.
    - Texture as generic parameter for sprite sheet animation.
- Turn font into resource + added `TextMessage::Height`.
- Make standard built-in shaders non-procedural by default.
- Refactored internal structure of resources.
    - All resource related data is now stored in `ResourceHeader` instead of being scattered all around in `ResourceState` 
  variants and even in resource data itself.
    - Backward compatibility is preserved.
    - `ResourceKind` instead of path+flag, refactored resource loader trait.
- Refactored interaction modes in the editor.    
- Switched to UntypedResource from SharedTexture in ui
- Simplified usage of `ResourceManager::request/try_request`. No need to write `rm.request<Type, _>`, just `rm.request<Type>`.
- Registered Light Panel in floating panels, so it can be docked.
- Made searching in the asset browser smarter.
- GPU resources cache refactoring.    
- Speed up access to textures.
- Automatic implementation of `ScriptTrait::id()` method. This implementation now should be removed from your
scripts.
- Scroll to the end of build log in the editor.
- Prevented build window from closing when a build has failed.
- Tweaked node handle property editor to also work with ui widgets.
- Filter out texture bytes in the property selector to improve performance.
- Enabled clicks repetition mode for scroll bar increase/decrease buttons.
- Keep the editor active if there's any captured ui element.
- Increased scroll bar step for scroll viewer.
- Added filter argument for `aabb_of_descendants`.
- Use abstract EntityId instead of ErasedHandle in animation entities.
- Optimized internals of navigation mesh. 
- Prevented serialization of the data of external resources.
- Pass screen size to `Control::update`.
- Ability to clone user interface entirely.
- Refactored scene saving dialogs in the editor to make them more stable.
- Made `Limb::iterate_recursive` method public.
- Switch character rigid body to kinematic when a ragdoll is active.
- Keep menu items highlighted when opening a menu chain.
- Gizmo improvements for navmesh interaction mode.
- Open navmesh panel at the top right of the scene preview when selecting a navmesh scene node.
- Improved visualization in the dependency viewer.
- Made asset import options inspector generic.
- Provide access to material context in the renderer.
- Movement, scale, rotation gizmo improvements.
- Mutable access for ui nodes.
- Preload resources before generating preview for them.
- Made world viewer to accept data provider instead of scene directly.
- Replaced `Cow<Path>` with `&Path` in `ResourceData` trait
- Allow to set materials by drag'n'drop on material editor field.
- Made material fields in the inspector more clickable. 
- Improved navigation on navmesh using string pulling algorithm.
- Improved performance of navigation mesh queries.
- Improved text box widget performance.
- `Plane` API improvements.
- Made material editor wider a bit by default.
- Extend resource data constructor with type name.
- Turned material into resource, removed `SharedMaterial` struct.
- Serialize vertex buffer data as a bytes slab.
- Use `Window::pre_present_notify` as recommended in the `winit` docs.
- Refactored sprites rendering to use materials.
- Refactored particle system rendering to use forward renderer.
- More built-in shader variables for lighting.
- Triangle buffer API improvements.
- Use debug message callback instead of message queue for OpenGL errors.
- Enable OpenGL debugging in debug build profile.
- Customizable time-to-live for geometry buffers (allows to create temporary buffers that lives one frame (ttl = 0)).
- Allow to start multiple scenes at editor start up (kudos to [@dasimonde](https://github.com/dasimonde)).
- `push_vertices` + `push_vertices_transform` method for vertex buffer.
- Ability to connect a state with every other state in the ABSM editor (kudos to [@Riddhiman007](https://github.com/Riddhiman007))
- Added UUIDs for scene nodes.
- Ability to set navmesh agent path recalculation threshold.
- Reset `modified` flags of inheritable variables when fixing node type.
- Check for node type mismatch on graph resolve and auto-fix this.
- Use type names instead of type ids when reporting inheritance errors.
- Remove orphaned nodes when restoring graph's integrity.
- Code example for `Inspector` widget.
- Pass node handle to surface instance data.
- Check for global `enabled` flag when filtering out cameras for rendering.
- Serialize joints binding local frames.
- Support for touch events in the UI (kudos to [@Bocksdin](https://github.com/Bocksdin)).
- A* pathfinding optimization (kudos to [@TiltedTeapot](https://github.com/TiltedTeapot)).

### Fixed 

- Fixed crash of the editor on Wayland.
- Fixed font rendering API.
- Fixed restoration of shallow resource handles of untyped resources.
- Prevent double saving of settings after modification.
- Keep aspect ratio when previewing a texture in the asset browser.
- Filter out non-savable resources in resource creation dialog.
- Fixed offscreen UI rendering in the UI editor.
- Fixed deep cloning of materials: make them embedded after cloning.
- Fixed path filters to correctly handle folders with "extensions".
- Save material when changing its shader property in the material editor.
- Fixed massive footgun with pointers to the graphics pipeline state scattered all around the renderer.
- Prevent creating of multiple thread pool across the engine.
- Fixed crash in the material editor if a material is failed to load.
- Prevent the editor from closing after saving a scene via Ctrl+S.
- Fixed position saving of maximized editor window.
- Fixed crash when assigning non-material resource in a material property.
- Fixed forward pass of standard shader for skinned meshes
- Fixed uuid formatting in visitor.
- Fixed resource extension comparison in the editor by making it case-insensitive.
- Fixed crash when drag'n'dropping assets in scene previewer.
- Fixed OpenGL error handling
- Fixed performance issues when modifying vertex/triangle buffers.
- Fixed crash when editing terrains (kudos to [@Riddhiman007](https://github.com/Riddhiman007))
- Fixed a bug when vertex attribute divisor was ignored.
- Fixed colors for log messages.
- Fixed scene loading in derived mode.
- Fixed text coloring when sending a `WidgetMessage::Foreground` to text.
- Fixed memory leaks on Linux (kudos to [@LordCocoNut](https://github.com/LordCocoNut))
- Fixed invalid GPU resource indexing bug, that caused crashes/quirks in graphics when switching scenes in the editor.

### Removed

- Removed implicit cloning when in `Reflect::into_any` impl for some types.
- Removed redundant memory allocation when fetching fields using reflection.
- Removed redundant memory allocation when iterating over fields.
- Removed `Option` wrapper in typed resource to flatten the internal structure of resources.
- Removed a bunch of redundant clones in the renderer.
- Removed lazy calculations in the navigational mesh.
- Removed unused `soft_boundary_sharpness_factor` param from particle systems (this property was moved to the 
standard particle system material).
- Removed `InteractionModeKind` and replaced it with uuids.

## Support

If you want to support the development of the project, click one of the links below. Preferable way is to use 
[Boosty](https://boosty.to/fyrox) - this way the money will be available for the development immediately. 
Alternatively you can use [Patreon](https://www.patreon.com/mrdimas), but in this case the money will
be on-hold for unknown period of time ([details are here](https://github.com/FyroxEngine/Fyrox/issues/363)).

Also, you can help by fixing one of the ["good first issues" ](https://github.com/FyroxEngine/Fyrox/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22),
adding a desired feature to the engine, or making a contribution to the [book](https://github.com/fyrox-book)