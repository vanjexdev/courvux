import { createApp } from 'courvux';

createApp({
    data: { count: 0 },
    computed: {
        label() {
            const n = Math.abs(this.count);
            return `${n} click${n === 1 ? '' : 's'}`;
        },
    },
    methods: {
        inc()      { this.count++; },
        dec()      { this.count--; },
        add(n)     { this.count += n; },
        reset()    { this.count = 0; },
    },
}).mount('#app');
