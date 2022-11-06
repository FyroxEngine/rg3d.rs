<template>
    <v-sheet color="grey darken-4 pt-16 pb-16">
        <v-container class="pb-9">
            <v-row>
                <v-col cols="12">
                    <h2 class="text-center mb-2">Sponsors</h2>
                </v-col>
                <v-col cols="12 d-flex flex-wrap justify-space-between">
                    <div class="chip mb-3"  v-for="name in sponsors" :key="name">
                        <p class="chip-text"> {{name}} </p> 
                    </div>
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-btn 
                    color="primary"
                    href="https://www.patreon.com/mrdimas"
                >
                    Become a Sponsor
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
            sponsors: [ 
                "Daniél Kerkmann",
                "Pedro Henrique Martins Garcia",
                "Anthony Callahan",
                "Brandon Thomas", 
                "LTH",
                "Alan Falloon",
                "v.exe",
                "S. M.",
                "Ssu Jen Lu",
                "vxrz",
                "mwcAlexKorn",
                "Andrew Wong",
                "Taylor C. Richberger", 
                "Avery Wagar",
                "Matthew",
                "George Atkinson", 
                "Erlend Sogge Heggen", 
                "Mitch Skinner",
                "ozkriff", 
                "Taylor Gerpheide", 
                "zrkn", 
                "Aleks Row", 
                "Edward L", 
                "L.apz",
                "Luke Jones", 
                "toyboot4e", 
                "Vish Vadlamani",
                "Alexey Kuznetsov", 
                "Daniel Simon", 
                "Jesper Nordenberg",
                "Kornel", 
                "Parham Gholami", 
                "Yuki Ishii",
                "Joseph Catrambone", 
                "MGlolenstine", 
                "zamar lomax",
                "Gheorghe Ugrik", 
                "Anton Zelenin", 
                "Barugon",
                "Tom Leys", 
                "Jay Sistar", 
                "tc", 
                "false", 
                "BlueSkye", 
                "Ben Anderson",
                "Thomas", 
                "Iulian Radu", 
                "Vitaliy Chernyshev"
            ],
        };
    },
};
</script>

<style>
.chip {
    width: 180px;
    max-width: 180px;
    height: 40px;
    background: rgb(59, 59, 59);
    border-radius: 20px;
}
.chip-text {
    font-size: 15px;
    text-align: center;
    line-height: 40px;
}
</style>