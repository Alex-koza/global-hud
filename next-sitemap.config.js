/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://global-hud.vercel.app',
    generateRobotsTxt: true,
    sitemapSize: 7000,
    exclude: ['/admin', '/admin/*'],
    alternateRefs: [
        {
            href: 'https://global-hud.vercel.app/en',
            hreflang: 'en',
        },
        {
            href: 'https://global-hud.vercel.app/uk',
            hreflang: 'uk',
        },
        {
            href: 'https://global-hud.vercel.app/ru',
            hreflang: 'ru',
        },
    ],
    robotsTxtOptions: {
        additionalSitemaps: [
            'https://global-hud.vercel.app/sitemap.xml',
        ],
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/api'],
            },
        ],
    },
}
