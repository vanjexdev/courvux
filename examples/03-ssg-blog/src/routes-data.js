// Shared route definitions consumed by both:
//   - src/router.js   (wraps with createRouter for client-side runtime)
//   - vite.config.js  (passes to courvuxSsg for build-time pre-rendering)
import Home from './pages/Home.js';
import Post from './pages/Post.js';
import { POSTS } from './posts.js';

export default [
    { path: '/', component: Home },
    {
        path: '/posts/:slug',
        component: Post,
        // List the concrete paths to pre-render. The plugin loops over
        // them, calling renderPage for each, and writes the resulting HTML
        // to dist/posts/<slug>/index.html.
        prerender: () => POSTS.map(p => `/posts/${p.slug}`),
    },
];
