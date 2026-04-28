import { createRouter } from 'courvux';
import Home from './pages/Home.js';
import Installation from './pages/Installation.js';
import QuickStart from './pages/QuickStart.js';
import TemplateSyntax from './pages/TemplateSyntax.js';
import Components from './pages/Components.js';
import Reactivity from './pages/Reactivity.js';
import Lifecycle from './pages/Lifecycle.js';
import Router from './pages/Router.js';
import Store from './pages/Store.js';
import Advanced from './pages/Advanced.js';
import DemoTodo from './pages/DemoTodo.js';

export default createRouter([
    { path: '/',              component: Home },
    { path: '/installation',  component: Installation },
    { path: '/quick-start',   component: QuickStart },
    { path: '/template',      component: TemplateSyntax },
    { path: '/components',    component: Components },
    { path: '/reactivity',    component: Reactivity },
    { path: '/lifecycle',     component: Lifecycle },
    { path: '/router',        component: Router },
    { path: '/store',         component: Store },
    { path: '/advanced',      component: Advanced },
    { path: '/demo',          component: DemoTodo },
    {
        path: '*',
        component: {
            template: `
                <div style="text-align:center; padding:4rem 0;">
                    <p style="font-size:3rem; margin-bottom:1rem;">404</p>
                    <p style="color:#666; font-size:14px; margin-bottom:1.5rem;">Page not found.</p>
                    <router-link to="/" style="font-size:13px; color:#111;">← Back to home</router-link>
                </div>
            `
        }
    }
], { mode: 'hash' });
