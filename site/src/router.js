import { createRouter } from 'courvux';
import routes from './routes-data.js';
import NotFound from './pages/NotFound.js';

let onRouteChange = null;

export function setOnRouteChange(fn) {
    onRouteChange = fn;
}

export default createRouter(
    [...routes, { path: '*', component: NotFound }],
    {
        mode: 'history',
        base: '/courvux',
        afterEach() {
            if (onRouteChange) onRouteChange();
        },
        scrollBehavior: () => {
            document.querySelector('main')?.scrollTo({ top: 0, behavior: 'instant' });
            return { x: 0, y: 0 };
        },
    }
);
