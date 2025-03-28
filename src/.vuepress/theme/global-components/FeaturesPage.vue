<template>
     <v-container class="pb-9">
        <v-row>
            <v-expansion-panels multiple>
                <v-expansion-panel
                    v-for="({ title, properties }, key) in features"
                    :key="'feature' + key"                  
                >
                    <v-expansion-panel-header>
                        <h3> {{title}} </h3>
                    </v-expansion-panel-header>

                    <v-expansion-panel-content>
                        <v-row  class="pb-9">
                            <v-col
                                cols="12"
                                md="6"
                                lg="4"
                                v-for="({ title, description, img }, key) in properties"
                                :key="'feature' + key"
                                class="d-flex mb-4"
                            >
                                <v-card color="secondary">
                                    <v-img v-bind:src="img"></v-img>
                                    <v-card-title> <h3> {{title}} </h3> </v-card-title>
                                    <v-card-text> {{description}} </v-card-text>
                                </v-card>   
                            </v-col>    
                        </v-row>                                               
                    </v-expansion-panel-content>

                </v-expansion-panel>
            </v-expansion-panels>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            features: [
                {
                    title: "General",
                    properties: [
                        {
                            img: "/assets/station_iapetus_27_02_21_01.jpg",
                            title: "Create 3D Games",
                            description: "Create first class 3D games. The engine provides almost everything you need to create 3D games."
                        },
                        {
                            img: "/assets/2d_scene.png",
                            title: "Create 2D Games",
                            description: "Want something simpler, then create first class 2D games!"
                        },                       
                        {
                            img: "/assets/mixed_2d_3d.png",
                            title: "Mix 2D with 3D",
                            description: "Want to create something else? Then try mixing 2D with 3D, everything is limited by your imagination."
                        },
                        {
                            img: "/assets/multi_scene.png",
                            title: "Multiple Scenes",
                            description: "Create and manage multiple scenes for various game parts, for example one for game menu and one per game level."
                        },
                        {
                            img: "/assets/scripting.png",
                            title: "Scripting",
                            description: "Write your game entirely in Rust using powerful scripting system of the engine."
                        },
                        {
                            img: "/assets/multi_scene.png",
                            title: "Multi-mode",
                            description: "Use the engine either as Framework or as Full-Featured Game Engine. The first option allows you to use the engine \
                            in a editor-less mode, it is possible to build your own tooling using this mode. The latter option releases the full power of the \
                            engine, allowing you to run your game in the editor and use full power of the editor."
                        }
                    ]
                },
                {
                    title: "Editor",
                    properties: [
                        {
                            img: "/assets/editor_small.png",
                            title: "Full-Featured Editor",
                            description: "Use the editor to create levels for your games. It handles 2D as well as 3D, providing enough flexibility to mix both."
                        },
                        {
                            img: "/assets/world_viewer.png",
                            title: "World Viewer",
                            description: "World viewer allows you to see objects hierarchy in the world, search objects, attach/detach objects, etc."
                        },
                        {
                            img: "/assets/asset_browser.png",
                            title: "Asset Browser",
                            description: "Manage your game assets in easy way. The asset browser allows you to preview your assets, change their properies, etc."
                        },
                        {
                            img: "/assets/absm_editor.png",
                            title: "Animation Blending State Machine Editor",
                            description: "Use animation blending state machine editor to create complex animations using simple ones."
                        },
                        {
                            img: "/assets/curve_editor.png",
                            title: "Curve Editor",
                            description: "Use curve editor to create complex behavior for numeric parameters."
                        },
                        {
                            img: "/assets/navmesh.png",
                            title: "Navigation Mesh Editor",
                            description: "Create and edit navigational meshes for path finding."
                        },
                        {
                            img: "/assets/inspector_small.png",
                            title: "Property Inspector",
                            description: "Edit properties of your game objects in unified way."
                        },
                        {
                            img: "/assets/material_editor2.png",
                            title: "Material Editor",
                            description: "Edit properties of your materials."
                        },
                        {
                            img: "/assets/lightmap.png",
                            title: "Lightmapper",
                            description: "Bake static lighting into a texture to speed up rendering."
                        },
                    ]
                },
                {
                    title: "Scene Graph",
                    properties: [
                        {
                            img: "",
                            title: "Wide Variety of Built-in Nodes",
                            description: "By default the engine offers Camera, Collider, Decal, Joint, Pivot, RigidBody, Sprite, \
                            Terrain, 2D Rigid Body, 2D Collider, 2D Joint, Rectangle (2D Sprite), Point Light, Spot Light, Directional \
                            Light, Mesh, Particle System, Sound Source."
                        },
                        {
                            img: "",
                            title: "Property Inheritance",
                            description: "Object properties are inheritable, this means that you can create a prefab, put its instances on a \
                            scene and every change to prefab properties will reflect to its instances (if there was no manual change to a property)."
                        },
                    ]
                },
                {
                    title: "Rendering",
                    properties: [
                        {
                            img: "/assets/light.jpg",
                            title: "Advanced Lighting System",
                            description: "Use built-in advanced lighting system, that can handle tons of light sources with soft shadows."
                        },
                        {
                            img: "/assets/custom_material.png",
                            title: "Custom Materials and Shaders",
                            description: "Create your own materials and shaders."
                        },
                        {
                            img: "/assets/rt.png",
                            title: "Render To Texture",
                            description: "Render scene to a texture and use it later, it could be useful for offscreen rendering."
                        },
                        {
                            img: "/assets/postprocessing.png",
                            title: "Various Built-in Postprocessing Effects",
                            description: "Use built-in postprocessing effects, such as SSAO, FXAA, Color Grading, Tone Mapping, etc."
                        },
                        {
                            img: "/assets/pbr.png",
                            title: "Physically-based Rendering (PBR)",
                            description: "Standard material provides easy-to-use physically-based rendering with metallic workflow."
                        },
                        {
                            img: "/assets/skybox.png",
                            title: "Skybox",
                            description: "Use skybox to add details to background of your scenes."
                        },
                    ]
                },
                {
                    title: "Asset Management",
                    properties: [
                        {
                            img: "",
                            title: "Wide Variety of Supported Formats",
                            description: "The engine supports import of following formats: 3D models - FBX; Textures - DDS, PNG, TGA, JPG, TIFF; \
                            Sound - OGG, WAV. There are also few native engine formats for: shaders, curves, animation blending state machines."
                        },
                        {
                            img: "",
                            title: "Fully Asynchronous Asset Import",
                            description: "Import tons of assets in parallel and fully utilize the available power of your CPU to speed up asset loading."
                        },
                    ]
                },
                {
                    title: "Sound",
                    properties: [
                        {
                            img: "",
                            title: "Sound Sources",
                            description: "Use powerful sound system to create rich sound environment. Mix spatial sound sources with 2D sources using \
                            spatial blend parameter, tweak various parameters (distance falloff, gain, etc.) to get best results."
                        },
                        {
                            img: "",
                            title: "Head-Related Transfer Function (HRTF)",
                            description: "HRTF dramatically increases perception of sound, it makes it sound natural as if it'd be in real world. The engine \
                            offers 40+ individual 'head models' to allow you to pick one that best suits you or your players."
                        },
                        {
                            img: "",
                            title: "Sound Effects",
                            description: "Use sound effects (such as reverb) to improve sound quality and make it sound more natural. Digital sound processing (DSP) \
                            module will help you to create your own, custom effects."
                        },
                    ]
                },
                {
                    title: "Physics",
                    properties: [
                        {
                            img: "/assets/rigidbody.png",
                            title: "Rigid Body Dynamics",
                            description: "Rigid body dynamics provides you with everything you need for physics simulation, including joints."
                        },
                        {
                            img: "/assets/shapes.png",
                            title: "Various Collider Shapes",
                            description: "The engine offers a lot of colliders shapes, the list includes: ball, capsule, cube, cone, cylinder, triangle mesh, convex hull, etc."
                        },
                        {
                            img: "/assets/rapier.png",
                            title: "Powered by Rapier",
                            description: "The engine offers powerful physics system that is powered by Rapier physics engine."
                        },
                    ]
                },
                {
                    title: "User Interface",
                    properties: [
                        {
                            img: "/assets/widgets.png",
                            title: "Various Widgets",
                            description: "Use wide variety of built-in widgets (30+) or create your own. The widget list includes: Border, \
                            Button, Canvas, CheckBox, ColorPicker, Decorator, DockingManager, DropdownList, Expander, FileBrowser, Grid, Image, \
                            ListView, Menu, MessageBox, NumericUpDown, Popup, ProgressBar, RangeEditor, Rect, ScrollBar, ScrollViewer, StackPanel, \
                            TabControl, Text, TextBox, TreeView, VectorImage, Window, WrapPanel, Inspector"
                        },
                        {
                            img: "/assets/layout.png",
                            title: "Powerful Layout System",
                            description: "Two-step layout system allows you to built user interfaces of any complexity. At first every widget is measured \
                            to get how many space it needs, as the last step every widget is arranged using info from previous stage and some user settings. \
                            Unlike stateless user interfaces, stateful UIs provides rich layouting."
                        },
                        {
                            img: "/assets/editor_small.png",
                            title: "Battle Tested",
                            description: "The UI system of the engine powers FyroxEd - native editor of the engine. It utilizes all available widgets and you \
                            can use the editor as a demo of the UI library."
                        },
                    ]
                },
                {
                    title: "Animation",
                     properties: [
                        {
                            img: "/assets/animation.png",
                            title: "Skeletal Animation",
                            description: "Use GPU-powered skeletal animation to create quality animations for your game characters. GPU acceleration means \
                            that you can have tons of objects with skeletal animation with very little performance overhead."
                        },
                        {
                            img: "/assets/absm.png",
                            title: "Animation Blending State Machine",
                            description: "Animation blending state machine (ABSM) allows you to create state graphs to mix multiple animation into one, \
                            creating complex animations from simple ones."
                        },
                        {
                            img: "/assets/absm.png",
                            title: "Events",
                            description: "Add custom events to a animation timeline and be notified when they'll happen. It could be useful to add foostep \
                            sound effect for walking animation, and so on."
                        },
                    ]
                },
                {
                    title: "Plugins & Scripting",
                    properties: [
                        {
                            img: "/assets/scripting.png",
                            title: "Scripting",
                            description: "Write your game entirely in Rust, while being able to run it in the editor. Scripts are statically linked, \
                            so there is no performance loss."
                        },
                        {
                            img: "/assets/plugin.png",
                            title: "Static Plugins",
                            description: "Create static plugins, that can used in multiple projects."
                        },
                    ]
                },
                {
                    title: "Multiplatform",
                    properties: [
                        {
                            img: "/assets/platforms.png",
                            title: "PC",
                            description: "Create your games for Windows, Linux, macOS"
                        },
                        {
                            img: "/assets/webassembly.png",
                            title: "WebAssembly",
                            description: "Create your games for Web using WebAssembly. WebAssembly allows you extending your game audience to more users, \
                            especially for cases when you need to run your game on a mobile device (since there is no Android support yet)."
                        },
                    ]
                },
            ],
        };
    },
}
</script>