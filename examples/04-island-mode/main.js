import { autoInit } from 'courvux';

autoInit({
    components: {
        counter: {
            data: { n: 0 },
            methods: {
                inc() { this.n++; },
                dec() { this.n--; },
            },
        },
    },
});
