<template>
    <div>
        <v-app-bar app flat dark>
            <router-link to="/" class="v-toolbar__title">
                <v-img
                    src="/assets/logos/logo.png"
                    width="40px"
                    max-width="40"
                    height="40px"
                    class="me-3 px-3"
                />
            </router-link>

            <v-toolbar-title>
                <router-link
                    to="/"
                    class="text-decoration-none white--text"
                >
                    Fyrox Game Engine
                </router-link>
            </v-toolbar-title>
            <v-spacer />
            <v-app-bar-nav-icon
                @click="drawer = !drawer"
                v-if="$vuetify.breakpoint.mobile"
            >
            </v-app-bar-nav-icon>

            <v-toolbar  elevation="0" v-if="!$vuetify.breakpoint.mobile" jsutify-end>
                <v-spacer />
                <v-btn
                    plain
                    class="mr-3"
                    v-for="({ text, link, key }) in topNavLinks"
                    :key="key"
                    :to="isExternal(link) ? undefined : link"
                    :href="isExternal(link) ? link : undefined"
                    :target="isExternal(link) ? '_blank': undefined"
                    >{{ text }}</v-btn
                >

                <v-divider inset vertical />
                
                <social-buttons-list
                    :allow-follow-text="true"
                    as-plain
                    include-for="topnav"
                />
            </v-toolbar>
        </v-app-bar>

        <v-navigation-drawer
            v-if="$vuetify.breakpoint.mobile"
            v-model="drawer"
            fixed
            temporary
        >
            <v-list nav dense class="w-100">
                <v-list-item-group>
                    <v-col class="px-0 pt-0 d-flex justify-end">
                        <v-app-bar-nav-icon
                            class="text-h2 ms-auto"
                            @click="drawer = !drawer"
                        >
                        </v-app-bar-nav-icon>
                    </v-col>

                    <v-divider></v-divider>
                    <v-list-item
                        v-for="({ text, link, key }) in topNavLinks"
                        :key="key"
                        :to="isExternal(link) ? '' : link"
                        :href="isExternal(link) ? link : ''"
                        :target="isExternal(link) ? '_blank': ''"
                        >{{ text }}</v-list-item
                    >
                    <social-buttons-vertical-nav
                        include-for="any"
                    />
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script>
import SocialButtonsList from "./SocialButtonsList.vue";
import SocialButtonsVerticalNav from "./SocialButtonsVerticalNav.vue";
export default {
    components: { SocialButtonsList, SocialButtonsVerticalNav },
    data() {
        return {
            drawer: false,
            topNavLinks: [],
        };
    },
    methods: {
        isExternal(link) {
            return link.indexOf("http") > -1;
        }
    },
    created() {
        this.topNavLinks = this.$site.themeConfig.nav;
    }
};
</script>
