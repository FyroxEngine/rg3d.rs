<template>
    <div>
        <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
                <code class="cursor-pointer" @click="copy(command)" v-bind="attrs" v-on="on">{{command}}</code>
            </template>
            <span>Click the code to copy</span>
        </v-tooltip>
        <v-snackbar v-model="snackbar" color="primary" timeout="2000">
                Code has been copied to clipboard
                <template v-slot:action="{ attrs }">
                    <v-btn
                        text
                        v-bind="attrs"
                        @click="snackbar = false"
                    >
                    Close
                    </v-btn>
                </template>
        </v-snackbar>
    </div>
</template>

<script>
export default {
    props: {
        command: {
            type: String,
            default: "",
        },
    },
    methods: {
         copy(command) {
            navigator.clipboard.writeText(command);
            this.snackbar = true;
        }
    },
    data() {
        return {
            snackbar: false,
        }
    },
}
</script>
