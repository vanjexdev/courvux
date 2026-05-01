import { createRouter } from 'courvux';
import routes from './routes-data.js';

const NotFound = {
    template: `
        <div style="text-align:center; padding:4rem 0;">
            <p style="font-size:3rem; margin-bottom:1rem;">404</p>
            <p style="color:#666; font-size:14px; margin-bottom:1.5rem;">Page not found.</p>
            <router-link to="/" style="font-size:13px; color:#111;">← Back to home</router-link>
        </div>
    `
};

export default createRouter(
    [...routes, { path: '*', component: NotFound }],
    {
        mode: 'history',
        base: '/courvux',
    }
);
