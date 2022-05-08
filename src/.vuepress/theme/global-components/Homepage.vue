<template>
    <div>
        <page-title text="Fyrox Game Engine">
            <v-btn @click="$vuetify.goTo('#startMaking', {duration: 1200, easing: 'easeInOutQuad'})" class="mt-4" color="primary" depressed>
                <span>Start creating games</span>
            </v-btn>
        </page-title>
        <features-list src="features"></features-list>
        <v-container class="text-center pt-16 pb-16 mb-16">
            <h2 class="mt-3 mb-2">FyroxEd</h2>
            <v-row class="mt-5">
                <v-col cols="12" md="6" class="mb-sm-16">
                    <v-img
                        width="80%"
                        max-width="450px"
                        class="rusty-editor__image rusty-editor__image-1"
                        lazy-src="/assets/rusty_editor_ll.jpg"
                        src="/assets/rusty_editor.jpg"
                        :eager="true"
                    />
                    <v-img
                        width="80%"
                        max-width="450px"
                        class="rusty-editor__image rusty-editor__image-2"
                        lazy-src="/assets/rusty_editor_2_ll.jpg"
                        src="/assets/rusty_editor_2.jpg"
                        :eager="true"
                    />
                </v-col>
                <v-col
                    cols="12"
                    md="6"
                    class="mt-md-n16 align-self-center text-justify"
                >
                    <p>
                        What would be a game engine without scene editor eh?
                        Don't worry. For this purpose We provide our own
                        rusty-editor that allows you to create your game scenes
                        in no time. Supporting tons of features, you're ready to
                        create games of tomorrow, today.
                    </p>
                </v-col>
            </v-row>
        </v-container>
        <v-sheet id="startMaking">
            <v-container class="text-center pt-16 pb-16 mb-16">
                <h2 class="mt-3 mb-2">Start Making Games</h2>

                <p>Installation is easy as pie.</p>
                <v-divider> </v-divider>
                <p class="mt-6">
                    <code> cargo new my-awesome-game </code>
                </p>

                <p  class="mt-6 mb-1">Add to your Cargo.toml</p>
                <p>
                    [dependencies] <br />
                    fyrox = "^0.24"
                </p>

                <p class="text-center">
                    Start coding. If you want to learn basics of this engine,
                    visit our book at:
                </p>
                <p class="text-center">
                    <v-btn
                        href="https://fyrox-book.github.io/"
                        class="mt-4"
                        color="primary"
                        depressed
                    >
                        <span>https://fyrox-book.github.io/</span>
                    </v-btn>
                </p>
            </v-container>
        </v-sheet>
     
        <v-sheet>
            <v-container class="text-center pt-16 pb-16">
                <h2 class="mt-3 mb-2">Examples</h2>
                <p>See all features in prepared scenes.</p>
                <v-divider></v-divider>
                <p class="mb-0 mt-4"></p>
            </v-container>
        </v-sheet>

        <v-container class="text-center pt-16 pb-16">
            <h2 class="mt-3 mb-2">Sponsors</h2>
            <p>Keeping the dream alive.</p>
            <v-divider></v-divider>
            <p class="mb-0 mt-4">
                tom cors, false, zrkn, BlueSkye, L.apz, toyboot4e, Daniel
                Simon, Yuki Ishii, Vish Vadlamani, Edward, Aleks Row,
                Vitaliy (ArcticNoise) Chernyshev, Alexey Kuznetsov, Ben
                Anderson, Jesper Nordenberg, Joseph Catrambone
            </p>
        </v-container>

    </div>
</template>

<script>
import FeaturesList from "../components/FeaturesList";

export default {
    components: { FeaturesList },
    data() {
        return {};
    },
};
</script>

<style>
.rusty-editor__image-1 {
    margin-left: auto;
    margin-right: 30%;
}

.rusty-editor__image-2 {
    margin-right: 5%;
    margin-left: auto;
    margin-top: -15%;
    z-index: 2;
}

.typed-element {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}
</style>