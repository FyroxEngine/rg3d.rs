<template>
    <v-sheet color="grey darken-4 pt-16 pb-16">
        <v-container class="pb-9">
            <v-row>
                <v-col cols="12">
                    <h2 class="text-center mb-2">Sponsors</h2>
                </v-col>
                <v-col
                    cols="auto"
                    md="auto"
                    lg="auto"
                    v-for="(name, key) in sponsors"
                    :key="'sponsor' + key"
                    class="d-flex mb-4"
                >
                    <div class="chip">
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
                "Brandon Thomas", "Taylor C. Richberger", "Avery Wagar",
                "George Atkinson", "Erlend Sogge Heggen", "Mitch Skinner",
                "ozkriff", "Taylor Gerpheide", "zrkn", 
                "Aleks Row", "Edward L", "L.apz",
                "Luke Jones", "toyboot4e", "Vish Vadlamani",
                "Alexey Kuznetsov", "Daniel Simon", "Jesper Nordenberg",
                "Kornel", "Parham Gholami", "Yuki Ishii",
                "Joseph Catrambone", "MGlolenstine", "zamar lomax",
                "Gheorghe Ugrik", "Anton Zelenin", "Barugon",
                "Tom Leys", "Jay Sistar", "tc", 
                "false", "BlueSkye", "Ben Anderson",
                "Thomas", "Iulian Radu", "Vitaliy Chernyshev"
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