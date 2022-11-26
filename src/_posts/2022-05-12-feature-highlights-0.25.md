---
title: "Fyrox 0.25 Feature Highlights"
date: "2022-05-12"
description: "I'm happy to announce that Fyrox 0.25 has been released! This release adds static plugins and scripting support,
improves prefab property inheritance, adds animation blending state machine, integrates sound entities to the 
scene graph."
categories: 
- General
---

I'm happy to announce that Fyrox 0.25 has been released! This release adds static plugins and scripting support,
improves prefab property inheritance, adds animation blending state machine, integrates sound entities to the 
scene graph.

## Plugins & Scripting

The engine now supports statically-linked plugins, this means that you can extend engine functionality and share
your work with other developers. The main use of plugins is to change how games should be built with the engine.
Before 0.25 the engine was mainly used as framework backed by the scene editor. Now the situation has changed,
now it is possible to run your game in the editor, like in many other mainstream engine such as Unreal Engine, Unity, 
Godot, etc.

<YtVideo url="https://www.youtube.com/embed/gfsKfRzIvho" />

To demonstrate new feature, the engine has [scripting](https://github.com/FyroxEngine/Fyrox/tree/master/examples/scripting)
example. The example is a workspace that contains three projects: `game`, `editor`, `executor`. The `game` project's name
says for itself - it is the game code itself that has implementation of `Plugin` trait and a bunch of scripts. The last
two projects are special. `editor` is an editor that has `game` attached as a plugin - it linked statically to the editor
and allows you to run your game in the editor, tweak properties of your game objects, etc. `executor` is a "runner" of your
game that is intended to be used when you want your game to be run standalone.

The structure of the project is pretty straightforward and clean, `editor` and `executor` has very little amount of code.
The `executor` is just creates `Executor` instance and attaches your game as a plugin:

```rust
use fyrox::engine::executor::Executor;
use game::GamePlugin;

fn main() {
    let mut executor = Executor::new();
    executor.add_plugin(GamePlugin::new());
    executor.run()
}
```

The `editor` is slightly more complex:

```rust
use fyrox::event_loop::EventLoop;
use fyroxed::{Editor, StartupData};
use game::GamePlugin;

fn main() {
    let event_loop = EventLoop::new();
    let mut editor = Editor::new(
        &event_loop,
        Some(StartupData {
            working_directory: Default::default(),
            scene: "data/scene.rgs".into(),
        }),
    );
    editor.add_game_plugin(GamePlugin::new());
    editor.run(event_loop)
}
```

As you can see, it creates `Editor` instance with some startup data (that just specifies working directory and a scene,
just to save you extra clicks and speed up iteration times). As `executor` it attaches the `game` plugin to the editor.

The main downside of this approach is that you need to re-compile the project if your change something in the code. 
You probably already asking: why not just use DLL hot-reloading? The answer is very simple: Rust does not guarantee ABI
stability across projects. What does that mean for a typical engine user? Well, in short: subtle bugs and crashes. There 
were a lot of experiments with hot-reloading and all of them failed. However the situation with hot-reloading is not 
so bad, it is possible to do it with C ABI, but this will require writing/generating C API for the engine and overall
usability (and probably performance) will be bad.

Static linking on other hand has significant benefits, that overweighs everything else:

- Aggressive optimizations - the compiler is able to do all sorts of optimizations, because it has access to the code
(which is not possible in case of DLL).
- Safety - the compiler will be able to check the code and prevent undefined behavior and memory issues.  

What's about iteration times? In short: they're acceptable - 3-10 seconds depending on the linker (`lld` will be faster).
Since the editor allows you to tweak parameters of your game objects, you can expose required parameters and tweak
them in the editor, thus reducing amount of iterations. However this won't help if you need to change game logic, but 
I can assure you - logic tweaking usually requires decent amount of time compared to compile times.

### Scripts

Script is just a common interface for your game entities (just a trait). A script can be attached to a scene graph node,
it has mutable access to the node and to the plugin it belongs to. Here's a simple script that forces an object to jump:

```rust
#[derive(Visit, Inspect, Debug, Clone)]
struct Jumper {
    timer: f32,
    period: f32,
}

impl Default for Jumper {
    fn default() -> Self {
        Self {
            timer: 0.0,
            period: 0.5,
        }
    }
}

impl TypeUuidProvider for Jumper {
    fn type_uuid() -> Uuid {
        uuid!("942e9f5b-e036-4357-b514-91060d4059f5")
    }
}

// Every script must implement ScriptTrait
impl ScriptTrait for Jumper {
    fn on_property_changed(&mut self, args: &PropertyChanged) -> bool {
        // Handles property changing. It is called from the editor when you tweak properties in
        // the Inspector. For now there is manual handing, it will be changed when runtime 
        // reflection is added.
        if let FieldKind::Object(ref value) = args.value {
            return match args.name.as_ref() {
                Self::TIMER => value.try_override(&mut self.timer),
                Self::PERIOD => value.try_override(&mut self.period),
                _ => false,
            };
        }
        false
    }

    fn on_init(&mut self, _context: ScriptContext) {
        // Called once on initialization.
    }

    fn on_update(&mut self, context: ScriptContext) {
        // Called every frame.
        if let Some(rigid_body) = context.node.cast_mut::<RigidBody>() {
            if self.timer > self.period {
                rigid_body.apply_force(Vector3::new(0.0, 200.0, 0.0));
                self.timer = 0.0;
            }

            self.timer += context.dt;
        }
    }

    fn id(&self) -> Uuid {
        // Script unique id. It is used for serialization.
        Self::type_uuid()
    }

    fn plugin_uuid(&self) -> Uuid {
        // Parent plugin unique id.
        GamePlugin::type_uuid()
    }
}
```

The script must be registered in the plugin, otherwise you cannot save or load your scene:

```rust
impl Plugin for GamePlugin {
    fn on_register(&mut self, context: PluginRegistrationContext) {
        let scripts = &context.serialization_context.script_constructors;

        scripts.add::<GamePlugin, Jumper, &str>("Jumper");
    }

    ...
}
```

After that, you can build the editor and assign the script to any object (the script requires the object to be `RigidBody`):

![script](/assets/script.png)

Now if you click `Play`, the barrel will jump with desired period on desired height. The bot and the player are both scripts
in the `scripting` examples. As you can see you can implement any logic that you need.

### User Interface and Plugins

Plugin system changes how the UI should be implemented. The plugin does not have access to engine's user interface instance,
there are one major reason why it is not possible: the editor. It is using engine's user interface instance and it cannot
be modified from the plugin. To extend the editor, there will be editor plugins, but they're planned for 0.26.

So, how you'd add user interface to your game based on plugins and scripts? It is a bit tedious, but possible - all you need
to do is to create your own user interface instance, feed it with the os events and create separate render pass to draw it.

Here is the simplified version from the `scripting` example:

```rust

pub struct GamePlugin {
    ui: Rc<RefCell<UserInterface>>,
}

impl Default for GamePlugin {
    fn default() -> Self {
        Self::new()
    }
}

impl GamePlugin {
    pub fn new() -> Self {
        Self {
            ui: Rc::new(RefCell::new(UserInterface::new(Vector2::new(100.0, 100.0)))),
        }
    }
}

// The render pass is responsible for drawing the UI to scene render buffer.
struct UiRenderPass {
    scene: Handle<Scene>,
    ui: Rc<RefCell<UserInterface>>,
}

impl SceneRenderPass for UiRenderPass {
    fn on_ldr_render(
        &mut self,
        ctx: SceneRenderPassContext,
    ) -> Result<RenderPassStatistics, FrameworkError> {
        if ctx.scene_handle == self.scene {
            let mut ui = self.ui.borrow_mut();

            ctx.ui_renderer.render(UiRenderContext {
                state: ctx.pipeline_state,
                viewport: ctx.viewport,
                frame_buffer: ctx.framebuffer,
                frame_width: ctx.viewport.size.x as f32,
                frame_height: ctx.viewport.size.y as f32,
                drawing_context: ui.draw(),
                white_dummy: ctx.white_dummy.clone(),
                texture_cache: ctx.texture_cache,
            })?;
        }

        Ok(Default::default())
    }
}

impl GamePlugin {
    // Creates the UI.
    pub fn create_ui(&mut self, context: PluginContext) {
        let mut ui = self.ui.borrow_mut();
        let ctx = &mut ui.build_ctx();
        ButtonBuilder::new(WidgetBuilder::new().with_width(200.0).with_height(32.0))
            .with_text("Click me")
            .build(ctx);
    }
}

impl Plugin for GamePlugin {
    fn on_standalone_init(&mut self, context: PluginContext) {
        self.create_ui(context);
    }
    
    fn on_enter_play_mode(&mut self, scene: Handle<Scene>, context: PluginContext) {
        self.create_ui(context);
    }

    fn update(&mut self, context: &mut PluginContext) {
        let mut ui = self.ui.borrow_mut();

        // Update UI, pass the size of the scene render buffer as screen size of the UI.
        if let Some(data) = context.renderer.scene_data_map.get(&self.scene) {
            if let GpuTextureKind::Rectangle { width, height } =
                data.ldr_scene_frame_texture().borrow().kind()
            {
                ui.update(Vector2::new(width as f32, height as f32), context.dt);
            }
        }

        // Handle events from the UI.
        while ui.poll_message().is_some() {}
    }

    fn on_os_event(&mut self, event: &Event<()>, _context: PluginContext) {
        // Feed OS events to the UI.
        if let Event::WindowEvent { event, .. } = event {
            if let Some(e) = translate_event(event) {
                let mut ui = self.ui.borrow_mut();
                ui.process_os_event(&e);
            }
        }
    }
}
```

There's quite a lot of code, but it has to be done once and it'll probably be exactly the same of every project. Once it is done
you can see/use the UI in your game:

![plugin ui](/assets/plugin_ui.png)

In general scripting is still experimental, but can be used to create games. It will be improved over time, it is very hard to 
a thing right from the start.

## Animation Blending State Machine (ABSM) Editor

Animation Blending State Machine Editor is an editor that allows you to mix multiple simple animation into one, to create complex 
animations. If you've ever used animation blueprints in Unreal Engine, or Mecanim in the Unity engine then you probably already
know what's this chapter will be about. 

The editor looks like this:

![absm editor](/assets/absm_editor_full.png)

There're two panels on the left side stacked on top of each other: the previewer - it shows the result of ABSM being played, and
the variables panel - it allows you to change input values for the ABSM. You can use it to check how your character will behave
depending on the state of variables.

In center there are two panels: state graph viewer - it allows you to create states and setup transitions between them, state viewer
allows you to setup a graph of animation sources for a state.

On the right side there's Inspector, it allows you to edit object properties (for example, change transition rules, transition times,
name of states, animation source and so on).

This is how the editor works:

<YtVideo url="https://www.youtube.com/embed/sRicfb2uQz8" />

The editor is meant to be used as a replacement for manual creation of ABSMs 
(like [here](https://fyrox-book.github.io/fyrox/tutorials/fps/tutorial-3/tutorial-part-3.html#animations)). All you need to do is 
to create ABSM in the editor, save it, and then load it as a resource in your game and create its instance:

```rust
let abms_resource =
    block_on(engine.resource_manager.request_absm("character.absm")).unwrap();

let instance =
    abms_resource.instantiate(model_root, scene, engine.resource_manager.clone());
```

## Layout and Render Transform for User Interface

Previously there was no way of setting custom transform to a widget, so there was no ability to scale/shear/rotate widgets, the 
only operation available was translation. This was very limiting and prevent from implementing complex widgets with ability to
zoom/drag content. 0.25 fixes this issues by adding layout and render transforms. 

Layout transform changes the desired size of the widget during the layout pass, so the widget can take more space depending on
the transform. Render transform directly affects how the widget will be rendered on screen, the transform is used to modify
positions of every vertex (remember that the UI library uses vector graphics) before rendering. 

The main use of this feature is in the ABSM editor mentioned above, the canvases in it allows you to scale/drag the content.

## Editor Improvements

The editor has a lot of improvements, compared to previous version. 

- Object picking is now precise, it is possible to prevent picking an object if turned to editor camera its back faces (the 
click-through option). It is especially useful for closed scenes when you often need to pick an object through the "ceiling".
- Editor settings window is now based on Inspector widget.
- Model previewer now has much more intuitive controls - left mouse buttons rotates the camera, middle mouse buttons - drags
the camera. `Fit` function is now works as it should. Model previewer now has single light source that makes content lit.
- Editor cameras now have default sky box, no more black void in preview.
- Log window now shows everything that is being written to the `Log` instance, every message has its own color based on 
severity of a message.
- Shortcuts are now works correctly, no more need to focus scene preview for shortcuts to work.
- Lots of other minor improvements.

## Prefab Property Inheritance

Prefab property inheritance is a powerful feature that allows you to create small "blocks" to build larger scene, then if you
change a property in a block, the changes will propagate to every instance (of course if a change wasn't made in an instance).
Before 0.25, only limited amount of properties were inheritable (mostly position, rotation, scale and few others), now almost
_every_ property is inheritable. The inheritance is not limited in depth, you can create any hierarchy of prefabs - create a 
prefab that uses other prefabs, which in their turn uses their own prefabs.

## Sound Improvements

Sound source and sound listener are now scene graph nodes, previously you were forced to use sound entities from `fyrox-sound`
directly. This was causing various issues, starting from issues with serialization and ending with quirks in scene editing.

The editor now allows to create sound effects (such as reverb) and edit audio context properties:

![reverb properties](/assets/reverb_properties.png)

![sound context properties](/assets/sound_context.png)

## Full list of changes

- Static plugin system
- User-defined scripts
- Play mode for the editor
- Animation Blending State Machine (ABSM) editor.
- Some of sound entities were integrated in the scene graph.
- New `Sound` and `Listener` scene nodes.
- Sound buffer import options.
- `ResourceManager::request_sound_buffer` now accepts only path to sound buffer.
- Prefab inheritance improvements - now most of the properties of scene nodes are inheritable.
- Access to simulation properties of the physics.
- Engine and Resource manager are non-serializable anymore, check migration guide to find how to create
save files in the correct way.
- `Node` enumeration was removed and replaced with dynamic dispatch. This allows you to define your own 
types of scene nodes.
- `Base` is not a scene node anymore, it was replaced with `Pivot` node (see migration guide for more info)
- `Base` now has `cast_shadows` property, respective property setters/getters was removed from `Mesh` and 
`Terrain` nodes.
- Ability to bring ListView item into view.
- Logger improvements: event subscriptions + collecting timestamps
- Log panel improvements in the editor: severity filtering, color differentiation.
- Scene nodes now have more or less correct local bounds (a bounding box that can fit the node).
- Improved picking in the editor: now it is using precise hit test against node's geometry.
- "Ignore back faces" option for picking in the editor: allows you to pick through "back" of polygon
faces, especially useful for closed environment.
- Rotation ribbons were replaced with torus, it is much easier to select desired rotation mode.
- New material for gizmos in the editor, that prevent depth issues.
- New expander for TreeView widget, `V` and `>` arrows instead of `+` and `-` signs.
- ScrollBar widget is much thinner by default.
- Editor settings window now based on Inspector widget, which provides uniform way of data visualization.
- `DEFAULT_FONT` singleton was removed, it is replaced with `default_font`
- Shortcuts improvements in the editor.
- Overall UI performance improvements.
- Ability to disable clipping of widget bounds to parent bounds.
- Layout and render transform support for widgets - allows you to scale/rotate/translate widgets.
- Ability to make widget lowermost in hierarchy.
- Animation blending state machine refactoring, optimizations and stability improvements.
- Animation blending state machines are now stored in special container which stored in the Scene.
- Docking manager now shows anchors only for its windows.
- Model previewer now has much more intuitive controls.
- NumericUpDown don't panic anymore on edges of numeric bounds (i.e when trying to do `i32::MAX_VALUE + 1`)
- DoubleClick support for UI.
- Update rate fix for editor, it fixes annoying issue with flickering in text boxes.
- `UserInterface::hit_test_unrestricted` which performs hit test that is not restricted to current 
picking restriction stack.
- WASM renderer fixes.
- `Pool::try_free` which returns `Option<T>` on invalid handles, instead of panicking.
- Light source for model previewer
- Default sky box for editor and model previewer cameras
- `Color` API improvements.
- `#[inspect(expand)]` and `#[inspect(expand_subtree)]` were removed from `Inspect` proc-macro
- Correct field name generation for enum variants
- Ability to draw Bézier curves in the UI.
- Fix for navmesh agent navigation of multilayer navigational meshes.
- Improvements for serializer, now it allows you correctly recover from serialization errors.

## Migration guide

It can be found in the [changelog](https://github.com/FyroxEngine/Fyrox/blob/master/CHANGELOG.md#migration-guide).

## Support the project

If you like the project and want to see it alive, please consider doing either a monthly donation on 
[Patreon](https://www.patreon.com/mrdimas) or do a one-time donation via
[BuyMeACoffee](https://www.buymeacoffee.com/mrDIMAS). 

## Contributors

Huge thanks for [all the contributors](https://github.com/FyroxEngine/Fyrox/graphs/contributors) who helped to improve 
the engine!

## Community

[Join the Discord server](https://discord.gg/xENF5Uh)

## Special thanks

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
