// Shared route definitions consumed by both:
//   - src/router.js      (wraps with createRouter for client-side runtime)
//   - vite.config.js     (passes to courvuxSsg for build-time pre-rendering)
//
// Each entry: { path, component, head? }
//   - path:      route path (no `:param` since we pre-render statically)
//   - component: component config (default-imported)
//   - head:      optional fallback HeadConfig used by SSG when the component
//                does not call useHead itself
import Home           from './pages/Home.js';
import Installation   from './pages/Installation.js';
import QuickStart     from './pages/QuickStart.js';
import TemplateSyntax from './pages/TemplateSyntax.js';
import Components     from './pages/Components.js';
import Reactivity     from './pages/Reactivity.js';
import Lifecycle      from './pages/Lifecycle.js';
import Composables    from './pages/Composables.js';
import EventBus       from './pages/EventBus.js';
import RouterPage     from './pages/Router.js';
import Store          from './pages/Store.js';
import Head           from './pages/Head.js';
import Ssg            from './pages/Ssg.js';
import DevTools       from './pages/DevTools.js';
import Testing        from './pages/Testing.js';
import Pwa            from './pages/Pwa.js';
import Advanced       from './pages/Advanced.js';
import DesignDecisions from './pages/DesignDecisions.js';
import Faq             from './pages/Faq.js';
import MigratingFromVue    from './pages/MigratingFromVue.js';
import MigratingFromAlpine from './pages/MigratingFromAlpine.js';
import DemoTodo       from './pages/DemoTodo.js';

export default [
    { path: '/',             component: Home },
    { path: '/installation', component: Installation },
    { path: '/quick-start',  component: QuickStart },
    { path: '/template',     component: TemplateSyntax },
    { path: '/components',   component: Components },
    { path: '/reactivity',   component: Reactivity },
    { path: '/lifecycle',    component: Lifecycle },
    { path: '/composables',  component: Composables },
    { path: '/event-bus',    component: EventBus },
    { path: '/router',       component: RouterPage },
    { path: '/store',        component: Store },
    { path: '/head',         component: Head },
    { path: '/ssg',          component: Ssg },
    { path: '/devtools',     component: DevTools },
    { path: '/testing',      component: Testing },
    { path: '/pwa',          component: Pwa },
    { path: '/advanced',     component: Advanced },
    { path: '/design-decisions',     component: DesignDecisions },
    { path: '/faq',                  component: Faq },
    { path: '/migrating-from-vue',   component: MigratingFromVue },
    { path: '/migrating-from-alpine', component: MigratingFromAlpine },
    { path: '/demo',         component: DemoTodo },
];
