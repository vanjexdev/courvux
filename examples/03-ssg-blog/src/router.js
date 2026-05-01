import { createRouter } from 'courvux';
import routes from './routes-data.js';
import NotFound from './pages/NotFound.js';

export default createRouter(
    [...routes, { path: '*', component: NotFound }],
    {
        mode: 'history',
        scrollBehavior: () => ({ x: 0, y: 0 }),
    }
);
