<template>
    <v-container class="pb-9">
        <v-row>
            <v-col align="center">
                <h1> Download Fyrox for {{ name }} </h1>
            </v-col>
        </v-row>    

        <v-row>
            <v-col align="center">
                <v-btn color="blue" v-if="preBuilt" size="x-large" href="https://github.com/FyroxEngine/Fyrox-demo-projects"> 
                    <v-icon>mdi-download</v-icon>
                    Fyrox Engine 0.36                    
                </v-btn> 
            </v-col>
        </v-row>  

        <v-row>
            <v-col align="center">
                <h3> Alternatives </h3>
            </v-col>
        </v-row>

        <v-row>
            <v-col align="center">
                <v-btn color="blue" v-if="preBuilt" size="x-large" href="https://fyrox-book.github.io/beginning/scripting.html"> 
                    Manual Installation                 
                </v-btn> 
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data() {
        var name = "Unknown OS"; 
        var preBuilt = false;
        if (navigator.userAgent.includes("win") != -1)  {
            name = "Windows";
            preBuilt = true;
        } else if (navigator.userAgent.includes("Mac") != -1) {
            name = "Mac";             
        } else if (navigator.userAgent.includes("Linux") != -1) {
            name = "Linux"; 
            preBuilt = true;
        } else if (navigator.userAgent.includes("Android") != -1) {
            name = "Android OS"; 
        } else if (navigator.userAgent.includes("like Mac") != -1)  {
            name = "iOS";
        };

        return {
            name,
            preBuilt
        };
    },
}
</script>

<style>

</style>