<template>
    <v-container class="pb-9">
        <v-row>
            <v-col cols="12" md="6" lg="4" v-for="({ title, description, img, link }, key) in examples"
                :key="'feature' + key" class="d-flex mb-4">

                <v-card color="secondary" class="w-100">
                    <a :href="link">
                        <div class="inner-link__overlay" :style="{ background: `url('${img}')` }">

                            <v-btn fab large color="orange">
                                <v-icon>mdi-play</v-icon>
                            </v-btn>
                        </div>
                    </a>
                    <a :href="link">
                        <v-card-title class="pb-0">
                            <h3> {{ title }} </h3>
                        </v-card-title>
                    </a>
                    <v-card-text>
                        <p>{{ description }}</p>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12">
                <h2 class="mb-2">Source Code</h2>
                <p> Source code for all examples can be found <a
                        href="https://github.com/FyroxEngine/Fyrox-demo-projects">here</a></p>
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
                    title: "Platformer",
                    img: "/assets/examples/2d.png",
                    link: "/assets/demo/platformer/index.html",
                    description: "2D Platformer"
                },
                {
                    title: "Blend shapes",
                    img: "/assets/examples/blendshape.png",
                    link: "/assets/demo/blendshape/index.html",
                    description: "This project shows how to use blend shapes to create facial expressions for your game characters. Use the set of sliders to control each blend shape's weight."
                },
                {
                    title: "Sound",
                    img: "/assets/demo/sound/screenshot.jpg",
                    link: "/assets/demo/sound/index.html",
                    description: "This project shows sound capabilities of the engine - HRTF, reverb, audio buses."
                },
                {
                    title: "Animation",
                    img: "/assets/demo/animation/screenshot.jpg",
                    link: "/assets/demo/animation/index.html",
                    description: "This project shows parts of the animation system of the engine, such as animation blending, root motion, etc."
                },
                {
                    title: "User Interface",
                    img: "/assets/demo/ui/screenshot.jpg",
                    link: "/assets/demo/ui/index.html",
                    description: "This project is a showcase for the user interface system of the engine."
                },
            ],
        };
    },
}
</script>

<style>
.inner-link {
    height: 60px;
}

.inner-link__overlay {
    height: 300px;
    background-size: cover !important;
    background-position: center !important;
    max-height: 30vh;
    display: flex;
    justify-content: center;
    align-items: center;

}

.w-100 {
    width: 100%;
}
</style>