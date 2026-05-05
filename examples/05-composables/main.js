import { createApp, useComposables } from 'courvux';
import { useCounter, useFlag, useClock } from './composables.js';

// Important: when spreading useComposables(...), don't add a sibling
// `methods:` / `data:` block on the component config — the second one wins
// and silently overwrites the merged buckets from the composables, so
// `inc`, `toggle`, `reset` (and friends) disappear at runtime. Pass any
// component-only methods/data as one more plain config object inside
// useComposables itself; the merge is then explicit and visible.
createApp({
    ...useComposables(
        useCounter(0),
        useFlag(false),
        useClock(),
        {
            methods: {
                bump() {
                    if (!this.flag) return;
                    this.inc();
                },
            },
        },
    ),
    computed: {
        statusLabel() {
            return this.flag ? 'tracking' : 'paused';
        },
    },
}).mount('#app');
