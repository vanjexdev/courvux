import { createApp, useComposables } from 'courvux';
import { useCounter, useFlag, useClock } from './composables.js';

createApp({
    ...useComposables(
        useCounter(0),
        useFlag(false),
        useClock(),
    ),
    computed: {
        statusLabel() {
            return this.flag ? 'tracking' : 'paused';
        },
    },
    methods: {
        bump() {
            if (!this.flag) return;
            this.inc();
        },
    },
}).mount('#app');
