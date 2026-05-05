import { createRouter } from 'courvux';
import routes from './routes-data.js';
import NotFound from './pages/NotFound.js';

// Infer the router base from the current URL so Option C (plain `npx serve`
// from the repo root, where the example is reached at
// `http://host/examples/03-ssg-blog/`) matches the same routes that Vite
// dev/build/preview serve at `/`. Without this the runtime router sees the
// pathname as `/examples/03-ssg-blog/`, fails to match `/`, and falls
// through to the wildcard NotFound page. Under Vite the prefix is absent
// so the inference returns `''` and behavior is unchanged.
const inferBase = () => {
    if (typeof window === 'undefined') return '';
    const m = window.location.pathname.match(/^(.*\/examples\/03-ssg-blog)(?:\/|$)/);
    return m ? m[1] : '';
};

export default createRouter(
    [...routes, { path: '*', component: NotFound }],
    {
        mode: 'history',
        base: inferBase(),
        scrollBehavior: () => ({ x: 0, y: 0 }),
    }
);
