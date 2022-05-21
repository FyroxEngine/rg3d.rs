<template>
    <div>
        <page-title text="Blog" :typed="['Get familiar with release notes.', 'Stay informed with the latest news.', 'Learn about new engine features.']">
             <v-btn v-if="activePage !== 1" class="mt-4"  @click="
                        $vuetify.goTo('#posts', {
                            duration: 1200,
                            easing: 'easeInOutQuad',
                        }) && latest()
                    " color="primary" depressed>
                <span
                    >See latest posts</span
                >
            </v-btn>
        </page-title>
        <v-sheet>
            <v-container class="pt-16 pb-16" id="posts">
                <v-row>
                    <blog-post-tile
                        v-for="article in pages"
                        :article="article"
                        :to="{
                            name: 'BlogArticle',
                            params: { name: article['path'] },
                        }"
                        :key="article['key']"
                    />
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <div class="text-center">
                            <v-pagination
                                v-model="activePage"
                                @input="navigate"
                                :length="paginationLength"
                                @previous="
                                    () => {
                                        $router.push(this.prevLink);
                                    }
                                "
                                @next="
                                    () => {
                                        $router.push(this.nextLink);
                                    }
                                "
                            />
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </v-sheet>
    </div>
</template>

<script>
import AppFooter from "../components/AppFooter.vue";
import TopNav from "../components/TopNav.vue";
import BlogPostTile from "../components/BlogPostTile.vue";

export default {
    components: { AppFooter, TopNav, BlogPostTile },
    computed: {
        pages() {
            return this.$pagination.pages;
        },
        paginationLength() {
            return this.$pagination._paginationPages.length;
        },
        nextLink() {
            return this.$pagination.nextLink;
        },
        prevLink() {
            return this.$pagination.prevLink;
        },
    },
    created() {
        this.activePage = this.$pagination.paginationIndex + 1;
    },
    methods: {
        latest() {
            this.$router.push(this.$pagination.getSpecificPageLink(0));
            this.activePage = 1;
        },
        navigate(value) {
            this.$router.push(this.$pagination.getSpecificPageLink(value - 1));
        }
    },
    data() {
        return {
            activePage: 1
        }
    }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
    transition-property: opacity;
    transition-duration: 0.5s;
}

.fade-enter-active {
    transition-delay: 0.5s;
}

.fade-enter,
.fade-leave-active {
    opacity: 0;
}

.typing-h2 {
    min-height: 2.2rem;
}
</style>