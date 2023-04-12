<template>
    <div>
        <template
            v-for="{
                icon,
                link,
                include,
                followText,
                id,
                customIcon,
            } in socials"
        >
            <v-btn
                :key="id"
                v-if="
                    include.indexOf(includeFor) !== -1 || includeFor === 'any'
                "
                class="me-4 white--text"
                :href="link"
                :icon="asIcons"
                :plain="asPlain"
            >
                <v-icon v-if="icon" size="24px">
                    {{ icon }}
                </v-icon>
                <span v-else-if="customIcon" class="d-flex">
                    <img class="custom-icon" :src="customIcon" />
                </span>
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
        asPlain: { default: false },
    },
    data() {
        return {
            socials: [
                {
                    id: "discord",
                    customIcon: "/assets/custom_icons/discord.svg",
                    link: "https://discord.com/invite/xENF5Uh",
                    include: ["topnav", "footer"],
                    followText: "Join Discord",
                },
                {
                    id: "git",
                    icon: "mdi-github",
                    link: "https://github.com/FyroxEngine/Fyrox",
                    include: ["topnav", "footer"],
                    followText: "GitHub",
                },
                {
                    id: "twitter",
                    icon: "mdi-twitter",
                    link: "https://twitter.com/DmitryNStepanov",
                    include: ["footer"],
                    followText: "Follow on Twitter",
                },

                {
                    id: "patreon",
                    icon: "mdi-patreon",
                    link: "https://www.patreon.com/mrdimas",
                    include: ["topnav", "footer"],
                    followText: "Patrons",
                },
            ],
        };
    },
};
</script>

<style scoped>
.custom-icon {
    height: 21px;
}

.custom-icon path {
    fill: white;
}
</style>

