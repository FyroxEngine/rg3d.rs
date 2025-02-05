<template>
    <div>
        <page-title text="Fyrox Game Engine" class="page_title_background">
            <h3 >Feature-rich Game Engine Written in Rust</h3>
            <v-btn class="mt-16 mb-16" color="primary" depressed href="/download.html">
                <v-icon>mdi-download</v-icon>
                <span>Download Latest Build</span>
            </v-btn>
            <v-btn class="mt-16 mb-16" color="primary" depressed href="/examples.html">
                <v-icon>mdi-play</v-icon>
                <span>Play Demo Projects</span>
            </v-btn>
        </page-title>
        <features-list src="features" />
       
     
        <sponsors />

    </div>
</template>

<script>
import FeaturesList from "../components/FeaturesList";
import Sponsors from "../components/Sponsors";

export default {
    components: { FeaturesList, Sponsors },
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

.page_title_background {
    overflow-y: hidden ! important;
    overflow-x: hidden ! important;
    background-size:     cover;
    background-image: url("/assets/logos/editor.jpg");
    background-repeat:   no-repeat;
    background-position: center center;
    height: 600px;
} 

</style>
