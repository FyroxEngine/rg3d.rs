<template>
    <v-sheet color="grey darken-4 pt-16 pb-16">
        <v-container class="pb-9">
            <v-row>
                <v-col cols="12">
                    <h3 class="text-h4 mb-2">Features</h3>
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
                        <h4 class="mb-2 text-decoration-underline">
                            {{ title }}
                        </h4>
                        <p class="mb-0">{{ desc }}</p>
                    </div>
                </v-col>
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
                    title: "HQ Volumetrics",
                    icon: "lightbulb-on-outline",
                    desc: "(directional, point, spot) with soft shadows",
                },
                {
                    title: "Multiplatform",
                    icon: "desktop-mac",
                    desc: "PC (Windows, Linux, macOS) and Web (WebAssembly) support",
                },
                {
                    title: "Deferred shading",
                    icon: "home-lightbulb-outline",
                    desc: "use tons of lights with small overhead",
                },
                {
                    title: "Built-in save/load",
                    icon: "content-save-cog",
                    desc: "Dont have to deal with savegame mechanics anymore. Save or load entire state of the engine in one call",
                },
                {
                    title: "Scene graph",
                    icon: "chart-timeline",
                    desc: "Full-featured, with various nodes (pivot, camera, mesh, light, particle system, sprite)",
                },
            ],
        };
    },
};
</script>
