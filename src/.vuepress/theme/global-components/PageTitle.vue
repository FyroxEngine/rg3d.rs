<template>
    <v-container class="text-center pt-16 pb-16 mb-16">
        <h1 class="mt-16">{{text}}</h1>
        <slot />
    </v-container>
</template>

<script>
export default {
    props: ['text'],
}
</script>