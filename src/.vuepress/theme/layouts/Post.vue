<template>
    <v-app>
        <ClientOnly>
            <top-nav />
        </ClientOnly>
        <v-main>
            <v-fade-transition appear hide-on-leave>
                <v-container class="pb-16 blog-post">
                    <h1 class="text-center mt-16 mb-10">{{$frontmatter.title}}</h1>
                    <Content />
                </v-container>
            </v-fade-transition>
        </v-main>
        <app-footer />
    </v-app>
</template>

<script>
import AppFooter from '../components/AppFooter.vue'
import TopNav from '../components/TopNav.vue'

export default {
    components: { AppFooter, TopNav },
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
    transition-property: opacity;
    transition-duration: 0.5s;
}

h2 {
    margin-top: 3rem;
    margin-bottom:1rem;
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

img {
    max-width: 100%;
}

.v-application .blog-post code {
    all: unset !important;
    color: #eee
}

/* Or with increased specificity */
.v-application .blog-post code {
  all: unset;
  color: #eee
}

</style>