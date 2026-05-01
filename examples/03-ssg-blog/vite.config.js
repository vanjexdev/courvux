import { defineConfig } from 'vite';
import courvuxSsg from 'courvux/plugin/ssg';

export default defineConfig({
    plugins: [
        courvuxSsg({
            routes:   async () => (await import('./src/routes-data.js')).default,
            notFound: async () => (await import('./src/pages/NotFound.js')).default,
            baseUrl:  'https://example.com',
            // Tell router-link how to render hrefs in statically emitted HTML.
            // Match this with the createRouter options in src/router.js.
            router:   { mode: 'history' },
        }),
    ],
});
