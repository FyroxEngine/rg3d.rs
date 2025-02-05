<template>
    <v-sheet color="grey darken-4 pt-16 pb-16">
        <v-container class="pb-9">
            <v-row>
                <v-col cols="12">
                    <h2 class="text-center mb-2">Features</h2>
                </v-col>
                <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    v-for="({ title, desc, icon }, key) in features"
                    :key="'feature' + key"
                    class="d-flex mb-4"
                >
                    <div class="d-flex">
                        <v-avatar
                            color="grey darken-3"
                            size="55"
                            class="align-stretch align-self-center me-5"
                        >
                            <v-icon>
                                {{ `mdi-${icon}` }}
                            </v-icon>
                        </v-avatar>
                    </div>
                    <div class="d-flex flex-column align-self-center">
                        <h3 class="mb-2">
                            {{ title }}
                        </h3>
                        <p class="mb-0">{{ desc }}</p>
                    </div>
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-btn 
                    color="primary"
                    href="/features.html"
                >
                    See Full List Of Features
                </v-btn>
            </v-row>
        </v-container>
    </v-sheet>
</template>

<script>
export default {
    props: ["src"],
    data() {
        return {
            features: [
                {
                    title: "Editor",
                    icon: "lightbulb-on-outline",
                    desc: "Use fully featured editor to develop games from start to finish.",
                },
                {
                    title: "Hot Reloading",
                    icon: "lightbulb-on-outline",
                    desc: "Use hot reloading of native code and assets for rapid prototyping.",
                },           
                {
                    title: "First Class 2D/3D Support",
                    icon: "lightbulb-on-outline",
                    desc: "Create 2D or 3D games, or even mix 2D and 3D.",
                },
                {
                    title: "Flexible PBR Renderer",
                    icon: "lightbulb-on-outline",
                    desc: "Powerful and extensible PBR renderer will cover most of your needs.",
                },
                {
                    title: "High Quality Binaural Sound",
                    icon: "lightbulb-on-outline",
                    desc: "Use powerful sound system to create rich sound environment.",
                },
                {
                    title: "Powerful 2D/3D Physics",
                    icon: "lightbulb-on-outline",
                    desc: "Rigid bodies, various colliders, joints, ray casting, etc.",
                },
                {
                    title: "Powerful User Interface",
                    icon: "lightbulb-on-outline",
                    desc: "Use powerful UI system to create interfaces limited by your imagination.",
                },
                {
                    title: "Powerful Animation System",
                    icon: "lightbulb-on-outline",
                    desc: "Use built-in animation system to create complex animations.",
                },
                {
                    title: "Multiplatform",
                    icon: "apple",
                    desc: "Make your games for PC (Windows, Linux, macOS) and Web (WebAssembly).",
                },
                {
                    title: "Plugins & Scripting",
                    icon: "content-save-cog",
                    desc: "Write your game completely in Rust, while being able to run it in the editor. Extend functionality of the engine using custom plugins.",
                },
                {
                    title: "Scene Graph",
                    icon: "chart-timeline",
                    desc: "Full-featured, with various nodes (pivot, camera, mesh, light, particle system, sprite), including your own.",
                },
                {
                    title: "Rust",
                    icon: "language-rust",
                    desc: "Built with Rust, which offers high reliability, less bugs than other languages.",
                },
            ],
        };
    },
};
</script>
