<template>
     <v-container class="pb-9">
        <v-row>
            <v-col cols="12">
                <h2 class="mb-2">Examples</h2>
            </v-col>
            <v-row>
                <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    v-for="({ title, description, img, link, command }, key) in examples"
                    :key="'feature' + key"
                    class="d-flex mb-4"
                >
                    <v-card color="secondary">
                        <a v-bind:href="link">
                            <v-img v-bind:src="img"/>
                        </a>
                        <a v-bind:href="link">
                            <v-card-title> 
                                <h3> {{title}} </h3> 
                            </v-card-title>
                        </a>
                        <code class="ml-3">{{command}}</code>
                        <v-card-text> {{description}} </v-card-text>
                    </v-card>   
                </v-col>    
            </v-row>   
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
                    link: "",
                    command: "cargo run --example 2d --release",
                    description: "The example shows how to create 2D scene."
                },
                {
                    title: "2D Scene",    
                    img: "/assets/examples/2d_scene.png",
                    link: "",
                    command: "cargo run --example 2d_scene --release",
                    description: "The example shows how to load 2D scene made in the FyroxEd."
                },
                {
                    title: "3rd Person",    
                    img: "/assets/examples/3rd_person.png",
                    link: "",
                    command: "cargo run --example 3rd_person --release",
                    description: "This is the most complex example in the engine, it show how to load a game level, create character with animations and basic controls."
                },
            ],
        };
    },
}
</script>