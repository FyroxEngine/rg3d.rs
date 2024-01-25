<template>
    <v-footer dark padless>
        <v-card
            flat
            tile
            width="100%"
            class="grey darken-4 white--text text-center"
        >
            <v-divider></v-divider>
            <v-card-text>
               <social-buttons-list include-for="footer" as-icons></social-buttons-list>
            </v-card-text>
            <v-divider></v-divider>

            <v-card-text class="white--text">
                Fyrox Engine 2019 - {{ new Date().getFullYear() }}
            </v-card-text>
        </v-card>
    </v-footer>
</template>

<script>
import SocialButtonsList from './SocialButtonsList.vue'
export default {
    components: { SocialButtonsList },
}
</script>

<style>

</style>