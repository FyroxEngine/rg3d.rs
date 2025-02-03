<template>
    <v-container class="pb-9">
        <v-row v-if="preBuilt">
            <v-col align="center">
                <h1> Download Fyrox for {{ name }} </h1>
            </v-col>
        </v-row>    

        <v-row v-if="!preBuilt">
            <v-col align="center">
                <h1> {{ name }} OS doesn't have pre-built binaries</h1>
            </v-col>
        </v-row>

        <v-row v-if="preBuilt">
            <v-col align="center">
                <v-btn color="blue"  size="x-large" :href="link"> 
                    <v-icon>mdi-download</v-icon>
                    Fyrox Engine 0.36                    
                </v-btn> 
            </v-col>
        </v-row>  

        <v-row>
            <v-col align="center">
                <v-card width="100%" height="200px">
                    <v-divider></v-divider>
                    
                    <v-card-text>
                        <h2>Requirements</h2>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-text class="white--text">
                        <h4>OpenGL 3.3 / OpenGL ES 3.0 compatible hardware </h4>
                        <h4>RAM - 512 Mb or more </h4>
                        <h4>VRAM - 256 Mb or more </h4>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col align="center">
                <v-card width="100%" height="200px">
                    <v-divider></v-divider>
                    
                    <v-card-text>
                        <h2>Instructions</h2>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-text class="white--text">
                       <h4> {{ instructions }}</h4>
                       <h4> You may need to install Rust toolchain to be able to build projects.</h4>                       
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-row>
            <v-col align="center">
                <h3> Alternatives </h3>
            </v-col>
        </v-row>
      
        <v-row>
            <v-col align="center">
                <v-btn color="blue" size="x-large" :href="link"> 
                    <v-icon>mdi-microsoft-windows</v-icon>
                    Windows                 
                </v-btn> 
                <v-btn color="blue" size="x-large" :href="link"> 
                    <v-icon>mdi-linux</v-icon>
                    Linux                 
                </v-btn> 
                <v-btn color="blue" size="x-large" :href="link"> 
                    <v-icon>mdi-apple</v-icon>
                    macOS                 
                </v-btn> 
                <v-btn color="blue" size="x-large" href="https://fyrox-book.github.io/beginning/scripting.html"> 
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
        var instructions = "None";
        var link = "";
        if (navigator.userAgent.includes("win") != -1)  {
            name = "Windows";
            preBuilt = true;
            link = "https://fyrox.rs/assets/releases/0.36/fyrox-project-manager-win-x86_64.zip"
            instructions = "Extract and run."
        } else if (navigator.userAgent.includes("Mac") != -1) {
            name = "Mac";         
            preBuilt = true;   
            link = "https://fyrox.rs/assets/releases/0.36/fyrox-project-manager-mac-x86_64.zip"
            instructions = "Extract and run."
        } else if (navigator.userAgent.includes("Linux") != -1) {
            name = "Linux"; 
            preBuilt = true;
            link = "https://fyrox.rs/assets/releases/0.36/fyrox-project-manager-linux-x86_64.zip"
            instructions = "Extract and run."
        } else if (navigator.userAgent.includes("Android") != -1) {
            name = "Android OS"; 
        } else if (navigator.userAgent.includes("like Mac") != -1)  {
            name = "iOS";
        };

        return {
            name,
            preBuilt,
            instructions,
            link
        };
    },
}
</script>

<style>

</style>