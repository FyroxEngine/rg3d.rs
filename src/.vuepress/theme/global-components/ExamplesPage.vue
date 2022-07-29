<template>
     <v-container class="pb-9">
        <v-row>
            <v-col cols="12">
                <h2 class="mb-2">Source code</h2>

                <p> Source code for all examples can be found <a href="https://github.com/FyroxEngine/Fyrox/blob/master/examples/">here</a></p>
            </v-col>
                <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    v-for="({ title, description, img, link, command }, key) in examples"
                    :key="'feature' + key"
                    class="d-flex mb-4"
                >
                    <v-card color="secondary">
                        <a :href="link">
                            <v-img class="rounded-t" :src="img"/>
                        </a>
                        <a :href="link">
                            <v-card-title class="pb-0"> 
                                <h3> {{title}} </h3> 
                            </v-card-title>
                        </a>
                        
                        <v-card-text> 
                            <cp-code class="cursor-pointer" :command="command" />
                            <p>{{description}}</p> 
                        </v-card-text>
                    </v-card>   
                </v-col>    
        </v-row>
        
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            examples: [
                {
                    title: "2D",    
                    img: "/assets/examples/2d.png",
                    link: "https://github.com/FyroxEngine/Fyrox/blob/master/examples/2d.rs",
                    command: "cargo run --example 2d --release",
                    description: "The example shows how to create a 2D scene."
                },
                {
                    title: "2D Scene",    
                    img: "/assets/examples/2d_scene.png",
                    link: "https://github.com/FyroxEngine/Fyrox/blob/master/examples/2d_scene.rs",
                    command: "cargo run --example 2d_scene --release",
                    description: "The example shows how to load a 2D scene made in the FyroxEd."
                },
                {
                    title: "3rd Person",    
                    img: "/assets/examples/3rd_person.png",
                    link: "https://github.com/FyroxEngine/Fyrox/blob/master/examples/3rd_person.rs",
                    command: "cargo run --example 3rd_person --release",
                    description: "This is the most complex example in the engine, it show how to load a game level, create a character with animations and basic controls."
                },
                {
                    title: "Async Scene Loading",    
                    img: "/assets/examples/async.png",
                    link: "https://github.com/FyroxEngine/Fyrox/blob/master/examples/async.rs",
                    command: "cargo run --example async --release",
                    description: "The example show how to load (or create) game scenes asynchronously, it is very useful if your game have a lot of assets and you don't \
                    want to 'hang' your game while the assets are loading."
                },
                {
                    title: "Button",    
                    img: "/assets/examples/button.png",
                    link: "https://github.com/FyroxEngine/Fyrox/blob/master/examples/button.rs",
                    command: "cargo run --example button --release",
                    description: "The example shows how to create a simple button and handle its events. The button will jump to new position every time its clicked."
                },
                {
                    title: "Compressed Textures",    
                    img: "/assets/examples/compressed_textures.png",
                    link: "https://github.com/FyroxEngine/Fyrox/blob/master/examples/compressed_textures.rs",
                    command: "cargo run --example compressed_textures --release",
                    description: "The example shows how to use texture compression options to reduce GPU memory consumption and speed up rendering."
                },
                {
                    title: "Custom Loop",    
                    img: "/assets/examples/custom_loop.png",
                    link: "https://github.com/FyroxEngine/Fyrox/blob/master/examples/custom_loop.rs",
                    command: "cargo run --example custom_loop --release",
                    description: "The example shows how to create a custom game loop. It might be useful if you need deep control over update calls. \
                    It can only be used if the engine is used as a Framework."
                },
                {
                    title: "Framework",    
                    img: "/assets/examples/framework.png",
                    link: "https://github.com/FyroxEngine/Fyrox/blob/master/examples/framework.rs",
                    command: "cargo run --example framework --release",
                    description: "The example shows how to use the engine as a Framework - a minimal working environment without ability to run your games in the editor."
                },
                {
                    title: "Grid",    
                    img: "/assets/examples/grid.png",
                    link: "https://github.com/FyroxEngine/Fyrox/blob/master/examples/grid.rs",
                    command: "cargo run --example grid --release",
                    description: "The example shows how to use the Grid widget to arrange UI elements in a grid."
                },
                {
                    title: "Instancing",    
                    img: "/assets/examples/instancing.png",
                    link: "https://github.com/FyroxEngine/Fyrox/blob/master/examples/instancing.rs",
                    command: "cargo run --example instancing --release",
                    description: "The example shows how the engine handles multiple instances of the same 3D model."
                },
                {
                    title: "Light Map",    
                    img: "/assets/examples/lightmap.png",
                    link: "https://github.com/FyroxEngine/Fyrox/blob/master/examples/lightmap.rs",
                    command: "cargo run --example lightmap --release",
                    description: "The example shows how to generate (or use generated) light maps. Light map is a ''baked' lighting, that has almost no performance impact."
                },
                {
                    title: "Level of Detail",    
                    img: "/assets/examples/lod.png",
                    link: "https://github.com/FyroxEngine/Fyrox/blob/master/examples/lod.rs",
                    command: "cargo run --example lod --release",
                    description: "The example shows how to use level-of-detail technique to optimize rendering for distance objects."
                },
                {
                    title: "Custom Material",    
                    img: "/assets/examples/material.png",
                    link: "https://github.com/FyroxEngine/Fyrox/blob/master/examples/material.rs",
                    command: "cargo run --example material --release",
                    description: "The example shows how to create custom shaders and materials and use them for rendering."
                },
                {
                    title: "Navigational Meshes",    
                    img: "/assets/examples/navmesh.png",
                    link: "https://github.com/FyroxEngine/Fyrox/blob/master/examples/navmesh.rs",
                    command: "cargo run --example navmesh --release",
                    description: "The example shows how to use navigational meshes and navigation agents for path finding."
                },
                {
                    title: "Save/Load",    
                    img: "/assets/examples/save_load.png",
                    link: "https://github.com/FyroxEngine/Fyrox/blob/master/examples/save_load.rs",
                    command: "cargo run --example save_load --release",
                    description: "The example shows how to use built-in serializer to create saved games and load them."
                },
                {
                    title: "Save/Load",    
                    img: "/assets/examples/scene.png",
                    link: "https://github.com/FyroxEngine/Fyrox/blob/master/examples/scene.rs",
                    command: "cargo run --example scene --release",
                    description: "The example shows how to load a scene made in FyroxEd."
                },
                {
                    title: "Simple Procedural Scene",    
                    img: "/assets/examples/simple.png",
                    link: "https://github.com/FyroxEngine/Fyrox/blob/master/examples/simple.rs",
                    command: "cargo run --example simple --release",
                    description: "The example shows how to create a simple procedural scene directly, without using FyroxEd."
                },
                {
                    title: "Sound",    
                    img: "/assets/examples/sound.png",
                    link: "https://github.com/FyroxEngine/Fyrox/blob/master/examples/sound.rs",
                    command: "cargo run --example sound --release",
                    description: "The example shows how create sound sources and sound effects."
                },
                {
                    title: "Procedural Terrain",    
                    img: "/assets/examples/terrain.png",
                    link: "https://github.com/FyroxEngine/Fyrox/blob/master/examples/terrain.rs",
                    command: "cargo run --example terrain --release",
                    description: "The example shows how create procedural terrain."
                },
                {
                    title: "User Interface",    
                    img: "/assets/examples/ui.png",
                    link: "https://github.com/FyroxEngine/Fyrox/blob/master/examples/ui.rs",
                    command: "cargo run --example ui --release",
                    description: "The example shows how create user interface and handle its events to perform actions."
                },
                {
                    title: "Scripting",    
                    img: "/assets/examples/scripting.png",
                    link: "https://github.com/FyroxEngine/Fyrox/blob/master/examples/scripting",
                    command: "cd examples/scripting && cargo run --package [editor/executor] --release",
                    description: "Scripting example shows how to create game plugins with custom scripts. It is possible to run it in two 'modes' - editor or executor."
                },
            ],
        };
    },
}
</script>