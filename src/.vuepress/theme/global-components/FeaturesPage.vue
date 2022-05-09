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
                                    <v-card width="400" color="secondary">
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
                    title: "First Class 2D and 3D Support",
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
                            img: "/assets/2d_scene.png",
                            title: "Mix 2D with 3D",
                            description: "Want to create something else? Then try mixing 2D with 3D, it is limited by your imagination"
                        },
                        {
                            img: "/assets/2d_scene.png",
                            title: "Multiple Scenes",
                            description: "Create and manage multiple scenes for various game parts, for example one for game menu and one per game level."
                        }
                    ]
                },
                {
                    title: "High Quality Flexible Renderer",
                    properties: [
                        {
                            img: "/assets/light.jpg",
                            title: "Built-in advanced lighting system",
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
                            title: "Various Built-in Postprocessing",
                            description: "Use built-in postprocessing effects, such as SSAO, FXAA, etc."
                        },
                        {
                            img: "/assets/light.jpg",
                            title: "Physically-based Rendering (PBR)",
                            description: "Standard material provides easy-to-use physically-based rendering."
                        },
                    ]
                },
                {
                    title: "High Quality Binaural Sound System",
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
                    title: "Advanced 2D/3D Physics",
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
                    title: "Advanced User Interface",
                    properties: [
                        {
                            img: "/assets/placeholder.png",
                            title: "Various Widgets",
                            description: "Use wide variety of built-in widgets (30+) or create your own."
                        },
                        {
                            img: "/assets/placeholder.png",
                            title: "Powerful Layout System",
                            description: "Two-step layout system allows you to built user interfaces of any complexity."
                        },
                    ]
                },
                {
                    title: "Powerful Animation System",
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
                    title: "Plugins Support",
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
                            title: "Static Plugins",
                            description: "Create static plugins, that can used in other projects."
                        },
                    ]
                },
            ],
        };
    },
}
</script>