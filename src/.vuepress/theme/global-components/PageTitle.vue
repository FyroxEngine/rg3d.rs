<template>
    <v-container class="text-center pt-16 pb-16 mb-16">
        <h1 class="mt-16 mb-0">{{text}}</h1>
        <vue-typed-js v-if="typed" :strings="typed">
            <h2 class="text-center typing mb-0 pb-0 mt-0 subtitle"></h2>
        </vue-typed-js>
        <slot />
    </v-container>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            required: true,
        },
        typed: {
            type: Array,
            default: undefined,
        }
    },
}
</script>

<style>
.typed-element {
    min-height: 4rem;
}

.subtitle {
    font-size: 1rem;
}
</style>