<template>
    <v-row>
        <v-col cols="12 text-center">
            <iframe :src="url" frameborder="0" allowfullscreen></iframe>
        </v-col>
    </v-row>
</template>

<script>
export default {
    props: { 
        url: { 
            type: String, 
            deault: "",
        }
    }
}
</script>