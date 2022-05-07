<template>
    <v-app>
        <top-nav></top-nav>
        <v-main>
            <transition name="fade">
                <v-container class="pb-16">
                    <h1 class="text-center mt-16 mb-10">{{$frontmatter.title}} Hello world</h1>
                    <Content />
                </v-container>
            </transition>
        </v-main>
        <app-footer></app-footer>
    </v-app>
</template>

<script>
import AppFooter from '../components/AppFooter.vue'
import TopNav from '../components/TopNav.vue'

export default {
    components: { AppFooter, TopNav },
    mounted() {
        console.log(this);
    }
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

.v-application code {
    all: unset !important;
    color: #eee
}

/* Or with increased specificity */
.v-application code {
  all: unset;
  color: #eee
}

</style>