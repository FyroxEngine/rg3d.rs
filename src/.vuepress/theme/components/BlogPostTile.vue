<template>
    <v-col cols="12" md="6" class="mb-6">
        <v-card class="mx-auto">
            <v-card-title v-text="article.title"></v-card-title>
            <v-card-subtitle class="pt-2 mb-0 pb-0">
                <h5>
                    <span class="me-6">Posted by: {{article.frontmatter.author ? article.frontmatter.author : "mrDIMAS"}}</span>
                    <span  v-if="article.frontmatter.date">On: {{new Date(article.frontmatter.date).toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric'})}}</span>
                </h5>
            </v-card-subtitle>
            <v-card-subtitle class="pb-0" v-if="article.frontmatter.description" v-html="$options.filters.parseBlogSubtitle(article.frontmatter.description)"></v-card-subtitle>
            
            <v-card-actions>
                <v-btn :to="article.path" color="orange lighten-2" text> Read </v-btn>

                <v-spacer></v-spacer>

                <v-btn v-if="article.frontmatter.previewText" icon @click="show = !show">
                    <v-icon>{{
                        show ? "mdi-chevron-up" : "mdi-chevron-down"
                    }}</v-icon>
                </v-btn>
            </v-card-actions>
            <v-expand-transition v-if="article.frontmatter.previewText">
                <div v-show="show">
                    <v-divider></v-divider>

                    <v-card-text class="text-justify" v-html="article.frontmatter.previewText">
                        
                    </v-card-text>
                </div>
            </v-expand-transition>
        </v-card>
    </v-col>
</template>

<script>
export default {
    props: ['article', 'to'],
    data() {
        return {
            content: '',
            show: false,
        };
    },
};
</script>

<style>
</style>