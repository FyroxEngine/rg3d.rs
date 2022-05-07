<template>
    <div>
        <template v-for="{ icon, link, include, followText } in socials">
            <v-btn
                :key="icon"
                v-if="include.indexOf(includeFor) !== -1 || includeFor === 'any'"
                class="me-4 white--text"
                :href="link"
                :icon="asIcons"
                :plain="asPlain"
            >
                <v-icon size="24px">
                    {{ icon }}
                </v-icon>
                <span v-if="allowFollowText"> {{ followText }} </span>
            </v-btn>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        allowFollowText: { default: false },
        includeFor: { default: null },
        asIcons: { default: false },
        asPlain: {default: false},
    },
    data() {
        return {
            socials: [
                {
                    "icon": "mdi-discord",
                    "link": "https://discord.com/invite/xENF5Uh",
                    "include": ["footer"],
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
                    "link": "https://www.patreon.com/mrdimas",
                    "include": ["topnav", "footer"],
                    "followText": "Patrons"
                }
            ],
        };
    },
};
</script>