<template>
    <v-container class="pb-9">
        <v-row v-if="preBuilt">
            <v-col align="center">               
                <h1 class="top_margin"> Download Fyrox {{ version }} for {{ name }} </h1>
            </v-col>
        </v-row>    

        <v-row v-if="!preBuilt">
            <v-col align="center">
                <h1 class="top_margin"> {{ name }} OS doesn't have pre-built binaries</h1>
            </v-col>
        </v-row>

        <v-row v-if="preBuilt">
            <v-col align="center">
                <v-btn color="blue"  size="x-large" class="top_margin" :href="link"> 
                    <v-icon> {{ icon }} </v-icon>
                    Fyrox Engine {{ version }}                
                    <v-icon>mdi-download</v-icon>
                </v-btn> 
            </v-col>
        </v-row>  

        <v-row>
            <v-col align="center">
                <v-card outlined width="100%" min-height="250px">
                    <v-card-text>
                        <h2>Requirements</h2>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-text>
                        <h4>OpenGL 3.3 or OpenGL ES 3.0 compatible hardware </h4>
                        <h4>RAM - 512 Mb or more </h4>
                        <h4>VRAM - 256 Mb or more </h4>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col align="center">
                <v-card outlined width="100%" min-height="250px">                    
                    <v-card-text>
                        <h2>Instructions</h2>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-text>
                       <h4> {{ instructions }}</h4>
                       <h4 v-if="additionalCommand.length>0">You might also need to install the following list of development dependencies:</h4>                       
                       <CpCode v-if="additionalCommand.length>0" :command="additionalCommand"> </CpCode>
                       <h4> You may need to install Rust toolchain to be able to build projects.</h4>  
                       <a href = "https://rustup.rs/">Download Rust Toolchain.</a>                       
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>


        <v-divider class="top_margin"></v-divider>

        <v-row>
            <v-col align="center">
                <h3> Alternatives </h3>
            </v-col>
        </v-row>
      
        <v-row>
            <v-col align="center">
                <v-btn color="blue" size="x-large" :href="windows"> 
                    <v-icon>mdi-microsoft-windows</v-icon>
                    Windows                 
                </v-btn> 
                <v-btn color="blue" size="x-large" :href="linux"> 
                    <v-icon>mdi-linux</v-icon>
                    Linux                 
                </v-btn> 
                <v-btn color="blue" size="x-large" :href="mac"> 
                    <v-icon>mdi-apple</v-icon>
                    macOS                 
                </v-btn> 
                <v-btn color="blue" size="x-large" href="https://fyrox-book.github.io/beginning/scripting.html"> 
                    <v-icon>mdi-code-braces</v-icon>                    
                    Manual Installation                 
                </v-btn> 
            </v-col>
        </v-row>

        <v-row>
            <v-col align="center">
                <h3> or </h3>
            </v-col>
        </v-row>

        <v-row>
            <v-col align="center">
                <CpCode command="cargo install fyrox-project-manager --version=1.0.0-rc.1"> </CpCode>
            </v-col>
        </v-row>

        <v-divider class="top_margin"></v-divider>

        <v-row>
            <v-col align="center">
                <h3> Learn How To Use Fyrox </h3>
            </v-col>
        </v-row>

        <v-col align="center">
                <v-btn color="blue" size="x-large" href="https://fyrox-book.github.io/introduction.html"> 
                    <v-icon>book-open-variant-outline</v-icon>
                    Open The Book                 
                </v-btn> 
        </v-col>

    </v-container>
</template>

<script>
import CpCode from './CpCode.vue';

export default {
    data() {
        var name = "Unknown OS"; 
        var preBuilt = false;
        var instructions = "None";
        var link = "";
        var icon = "";
        var version = "1.0.0-rc.2";
        var windows = "https://fyrox.rs/assets/releases/1.0.0-rc.2/fyrox-project-manager-win-x86_64.zip";
        var mac = "https://fyrox.rs/assets/releases/1.0.0-rc.2/fyrox-project-manager-macos-x86_64.zip";
        var linux = "https://fyrox.rs/assets/releases/1.0.0-rc.2/fyrox-project-manager-linux-x86_64.zip";
        var additionalCommand = "";

        if (navigator.userAgent.includes("win") != -1)  {
            name = "Windows";
            preBuilt = true;
            link = windows;
            instructions = "Extract and run. Fyrox is a self-contained engine and does not require installation."
            icon = "mdi-microsoft-windows";
        } else if (navigator.userAgent.includes("Mac") != -1) {
            name = "Mac";         
            preBuilt = true;   
            link = mac;
            instructions = "Extract and run. Fyrox is a self-contained engine and does not require installation. The application is unsigned, so you need to give your permissions to run it."
            icon = "mdi-apple";
        } else if (navigator.userAgent.includes("Linux") != -1) {
            name = "Linux"; 
            preBuilt = true;
            link = linux;
            instructions = "Extract and run. Fyrox is a self-contained engine and does not require installation.";
            additionalCommand = "sudo apt install libxcb-shape0-dev libxcb-xfixes0-dev libxcb1-dev libxkbcommon-dev libasound2-dev libegl-mesa0 build-essential";
            icon = "mdi-linux";
        } else if (navigator.userAgent.includes("Android") != -1) {
            name = "Android OS"; 
        } else if (navigator.userAgent.includes("like Mac") != -1)  {
            name = "iOS";
        };

        return {
            name,
            preBuilt,
            instructions,
            link,
            windows,
            mac,
            linux,
            icon,
            version,
            additionalCommand
        };
    },
}
</script>

<style>

.top_margin {
    margin: 40px 0px 40px 0px
};

</style>
