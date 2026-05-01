import { createRouter } from 'courvux';
import routes from './routes-data.js';
import NotFound from './pages/NotFound.js';

export default createRouter(
    [...routes, { path: '*', component: NotFound }],
    {
        mode: 'history',
        base: '/courvux',
        scrollBehavior: () => {
            // The site's <main> has overflow-y:auto so it scrolls independently
            // from <html>/<body>. Reset both to be safe.
            document.querySelector('main')?.scrollTo({ top: 0, behavior: 'instant' });
            return { x: 0, y: 0 };
        },
    }
);
