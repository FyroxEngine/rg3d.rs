<template>
    <div>
        <v-divider></v-divider>
        <template v-for="({ icon, link, include, followText }, key) in socials">
            <v-list-item
                :href="link"
                :key="key"
                v-if="
                    include.indexOf(includeFor) !== -1 || includeFor === 'any'
                "
            >
                <v-icon size="24px" class="me-4">
                    {{ icon }}
                </v-icon>
                <span> {{ followText }} </span>
            </v-list-item>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        includeFor: { default: null },
    },
    data() {
        return {
            socials: [
                {
                    "icon": "mdi-discord",
                    "link": "https://discord.com/invite/xENF5Uh",
                    "include": ["topnav", "footer"],
                    "followText": "Join Discord"
                },
                {
                    "icon": "mdi-github",
                    "link": "https://github.com/FyroxEngine/Fyrox",
                    "include": ["topnav", "footer"],
                    "followText": "GitHub"
                },
                {
                    "icon": "mdi-twitter",
                    "link": "https://twitter.com/DmitryNStepanov",
                    "include": ["footer"],
                    "followText": "Follow on Twitter"
                },

                {
                    "icon": "mdi-patreon",
                    "link": "/sponsor.html",
                    "include": ["topnav", "footer"],
                    "followText": "Patrons"
                }
            ],
        };
    },
};
</script>