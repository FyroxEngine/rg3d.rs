const {
    description
} = require('../../package')

module.exports = {
    /**
     * Ref：https://v1.vuepress.vuejs.org/config/#title
     */
    title: 'Fyrox - A feature-rich game engine built in Rust',
    /**
     * Ref：https://v1.vuepress.vuejs.org/config/#description
     */
    description: description,

    /**
     * Extra tags to be injected to the page HTML `<head>`
     *
     * ref：https://v1.vuepress.vuejs.org/config/#head
     */
    head: [
        ['meta', {
            name: 'google-site-verification',
            content: 'lgdTRRs1z7wcdVlcyCeUfrdz-U5vikw82_u9L8_Wkgs'
        }],
        ['meta', {
            name: 'theme-color',
            content: '#3eaf7c'
        }],
        ['meta', {
            name: 'apple-mobile-web-app-capable',
            content: 'yes'
        }],
        ['meta', {
            name: 'apple-mobile-web-app-status-bar-style',
            content: 'black'
        }],
        ['link', {
            rel: 'apple-touch-icon',
            sizes: '180x180',
            href: '/assets/favicon/apple-touch-icon.png'
        }],
        ['link', {
            rel: 'icon',
            type: 'image/png',
            sizes: '32x32',
            href: '/assets/favicon/favicon-32x32.png'
        }],
        ['link', {
            rel: 'icon',
            type: 'image/png',
            sizes: '16x16',
            href: '/assets/favicon/favicon-16x16.png'
        }],
        ['link', {
            rel: 'alternate',
            type: 'application/rss+xml',
            title: 'RSS',
            href: '/rss.xml',
        }],
    ],

    /**
     * Theme configuration, here is the default theme configuration for VuePress.
     *
     * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
     */
    themeConfig: {
        repo: '',
        editLinks: false,
        docsDir: '',
        editLinkText: '',
        lastUpdated: false,
        nav: [{
                text: 'Homepage',
                link: '/',
            },
            {
                text: 'Book',
                link: 'https://fyrox-book.github.io/introduction.html'
            },
            {
                text: 'Games',
                link: '/games',
            },
            {
                text: 'Blog',
                link: '/blog/'
            },
            {
                text: 'Features',
                link: '/features/'
            },
            {
                text: 'Examples',
                link: '/examples/'
            },
        ],
        sidebar: {
            '/guide/': [{
                title: 'Guide',
                collapsable: false,
                children: [
                    '',
                    'using-vue',
                ]
            }],
        }
    },

    /**
     * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
     */
    plugins: [
        '@vuepress/plugin-back-to-top',
        '@vuepress/plugin-medium-zoom',
        [
            '@vuepress/blog',
            {
                directories: [{
                    // Unique ID of current classification
                    id: 'post',
                    // Target directory
                    dirname: '_posts',
                    // Path of the `entry page` (or `list page`)
                    path: '/blog/',
                    itemPermalink: '/blog/post/:slug',
                    pagination: {
                        length: 10,
                        sorter: (prev, next) => {
                            const dayjs = require('dayjs');
                            const prevTime = dayjs(prev.frontmatter.date);
                            const nextTime = dayjs(next.frontmatter.date);
                            return prevTime - nextTime > 0 ? -1 : 1;
                        }
                    }
                }, ],

            },
        ],
        [
            '@vuepress/plugin-external-link-icon',
            {
                locales: {
                    '/': {
                        openInNewWindow: '',
                    },
                },
            },
        ],
        [
            'rss-feed',
            {
                username: 'Mr. DIMAS',
                hostname: 'https://fyrox.rs',
                selector: 'body', // extract content to content:encoded
                count: 10,
                filter: (page) => /^_posts/.test(page.relativePath),
            },
        ],
        [
            'sitemap',
            {
                hostname: 'https://fyrox.rs'
            },
        ]        
    ]
}