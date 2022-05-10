<template>
     <v-container class="pb-9">
        <v-row>
            <v-col cols="12">
                <h2 class="mb-2">Features</h2>
            </v-col>
            <v-expansion-panels multiple>
                <v-expansion-panel
                    v-for="({ title, properties }, key) in features"
                    :key="'feature' + key"                  
                >
                    <v-expansion-panel-header>
                        <h3> {{title}} </h3>
                    </v-expansion-panel-header>

                    <v-expansion-panel-content>
                        <v-container class="pb-9">
                            <v-row>
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
                                        <v-card-title> {{title}} </v-card-title>
                                        <v-card-text> {{description}} </v-card-text>
                                    </v-card>   
                                </v-col>    
                            </v-row>                                               
                        </v-container>
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
                            img: "/assets/2d_scene.png",
                            title: "Create 2D Games",
                            description: "Create first class 2D games"
                        },
                        {
                            img: "/assets/station_iapetus_27_02_21_01.jpg",
                            title: "Create 3D Games",
                            description: "Create first class 3D games"
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
                        }
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
                            img: "/assets/light.jpg",
                            title: "Custom Materials and Shaders",
                            description: "Create your own materials and shaders."
                        },
                        {
                            img: "/assets/light.jpg",
                            title: "Render To Texture",
                            description: "Render scene to a texture and use it later, it could be useful for offscreen rendering."
                        },
                        {
                            img: "/assets/light.jpg",
                            title: "Various Built-in Postprocessing Effects",
                            description: "Use built-in postprocessing effects, such as SSAO, FXAA, Color Grading, Tone Mapping, etc."
                        },
                        {
                            img: "/assets/light.jpg",
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
                    title: "Sound",
                    properties: [
                        {
                            img: "/assets/placeholder.png",
                            title: "Spatial Sound",
                            description: "TODO"
                        },
                        {
                            img: "/assets/placeholder.png",
                            title: "Head-Related Transfer Function (HRTF)",
                            description: "HRTF dramatically increases perception of sound, it makes it sound natural as if it'd be in real world."
                        },
                    ]
                },
                {
                    title: "Physics",
                    properties: [
                        {
                            img: "/assets/placeholder.png",
                            title: "Powered by Rapier",
                            description: "The engine offers powerful physics system that is powered by Rapier physics engine."
                        },
                        {
                            img: "/assets/placeholder.png",
                            title: "Rigid Body Dynamics",
                            description: "TODO"
                        },
                        {
                            img: "/assets/placeholder.png",
                            title: "Various Colliders",
                            description: "TODO"
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
                            description: "Two-step layout system allows you to built user interfaces of any complexity."
                        },
                        {
                            img: "/assets/editor_small.png",
                            title: "Battle Tested",
                            description: "The UI system of the engine powers FyroxEd - native editor of the engine."
                        },
                    ]
                },
                {
                    title: "Animation",
                     properties: [
                        {
                            img: "/assets/animation.png",
                            title: "Skeletal Animation",
                            description: "Use GPU-powered skeletal animation to create quality animations for your game characters."
                        },
                        {
                            img: "/assets/absm.png",
                            title: "Animation Blending State Machine",
                            description: "Animation blending state machine (ABSM) allows you to create state graphs to mix multiple animation into one, \
                            creating complex animations from simple ones."
                        },
                    ]
                },
                {
                    title: "Multiplatform",
                    properties: [
                        {
                            img: "/assets/placeholder.png",
                            title: "PC",
                            description: "Create your games for Windows, Linux, macOS"
                        },
                        {
                            img: "/assets/placeholder.png",
                            title: "WebAssembly",
                            description: "Create your games for Web using WebAssembly."
                        },
                    ]
                },
                {
                    title: "Plugins & Scripting",
                    properties: [
                        {
                            img: "/assets/placeholder.png",
                            title: "Static Plugins",
                            description: "Create static plugins, that can used in other projects."
                        },
                    ]
                },
                {
                    title: "Scene Graph",
                    properties: [
                        {
                            img: "/assets/placeholder.png",
                            title: "Wide Variety of Built-in Nodes",
                            description: "By default the engine offers Camera, Collider, Decal, Joint, Pivot, RigidBody, Sprite, \
                            Terrain, 2D Rigid Body, 2D Collider, 2D Joint, Rectangle (2D Sprite), Point Light, Spot Light, Directional \
                            Light, Mesh, Particle System, Sound Source."
                        },
                    ]
                },
            ],
        };
    },
}
</script>