import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import '@mdi/font/css/materialdesignicons.css';

/**
 * Client app enhancement file.
 *
 * https://v1.vuepress.vuejs.org/guide/basic-config.html#app-level-enhancements
 */


export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData // site metadata
}) => {
  Vue.use(Vuetify);

  Vue.filter('parseBlogSubtitle', function (value) {
    return value.replace(new RegExp('\\*{2}([^\\*]*)\\*{2}.+?', 'g'), "<strong>$1</strong>");
  })
  
  options.vuetify = new Vuetify({
    theme: { dark: true },
    breakpoint: {
        mobileBreakpoint: 'sm' // This is equivalent to a value of 960
    },
  })
}
