import { createApp } from 'courvux';
import router from './router.js';

createApp({
    router,
    template: `<router-view></router-view>`,
}).mount('#app');
