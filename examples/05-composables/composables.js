import { defineComposable } from 'courvux';

// useCounter — count plus inc/dec/reset
export const useCounter = defineComposable((initial = 0) => ({
    data: { count: initial },
    methods: {
        inc()   { this.count++; },
        dec()   { this.count--; },
        reset() { this.count = initial; },
    },
}));

// useFlag — boolean with toggle
export const useFlag = defineComposable((initial = false) => ({
    data: { flag: initial },
    methods: {
        toggle() { this.flag = !this.flag; },
        on()     { this.flag = true; },
        off()    { this.flag = false; },
    },
}));

// useClock — wall clock that ticks every second; ticks are torn down on unmount
export const useClock = defineComposable(() => ({
    data: { now: new Date().toLocaleTimeString() },
    onMount() {
        const id = setInterval(() => { this.now = new Date().toLocaleTimeString(); }, 1000);
        // Lifecycle hooks declared on a composable share `this` with the
        // component, so cleanups can be registered the same way.
        this.$addCleanup(() => clearInterval(id));
    },
}));
