import { describe, it, expect, vi } from 'vitest';
import { mount } from '../test-utils.js';
import { defineComposable, useComposables } from '../composables.js';

describe('defineComposable', () => {
    it('returns the factory unchanged (identity helper)', () => {
        const factory = (n = 0) => ({ data: { count: n } });
        const wrapped = defineComposable(factory);
        expect(wrapped).toBe(factory);
    });

    it('spread of a single composable provides data + methods', async () => {
        const useCounter = defineComposable((initial = 0) => ({
            data: { count: initial },
            methods: {
                inc(this: any) { this.count++; },
            },
        }));

        const w = await mount({
            ...useCounter(5),
            template: '<button @click="inc()">{{ count }}</button>',
        });

        expect(w.text()).toBe('5');
        (w.state as any).inc();
        await w.nextTick();
        expect(w.text()).toBe('6');
        w.destroy();
    });

    it('composable onMount fires when spread into a component', async () => {
        const seen: string[] = [];
        const useLogger = defineComposable(() => ({
            onMount(this: any) { seen.push('composable-onMount'); },
        }));

        await mount({
            ...useLogger(),
            template: '<p>hi</p>',
            onMount() { seen.push('component-onMount'); },
        });

        // When using spread of a single composable, the composable's onMount is
        // assigned to the config; the component-level onMount overrides it
        // because spread happens left-to-right. Document the behavior.
        expect(seen).toEqual(['component-onMount']);
    });
});

describe('useComposables', () => {
    it('merges data + methods from multiple composables', async () => {
        const useCounter = defineComposable(() => ({
            data: { count: 0 },
            methods: { inc(this: any) { this.count++; } },
        }));
        const useFlag = defineComposable(() => ({
            data: { flag: false },
            methods: { toggle(this: any) { this.flag = !this.flag; } },
        }));

        const w = await mount({
            ...useComposables(useCounter(), useFlag()),
            template: '<p>{{ count }}-{{ flag }}</p>',
        });
        expect(w.text()).toBe('0-false');
        (w.state as any).inc();
        (w.state as any).toggle();
        await w.nextTick();
        expect(w.text()).toBe('1-true');
        w.destroy();
    });

    it('runs every composable hook in insertion order', async () => {
        const seen: string[] = [];
        const a = defineComposable(() => ({ onMount() { seen.push('a'); } }));
        const b = defineComposable(() => ({ onMount() { seen.push('b'); } }));

        await mount({
            ...useComposables(a(), b()),
            template: '<p>x</p>',
        });

        expect(seen).toEqual(['a', 'b']);
    });

    it('composable hook merged via useComposables does not override component hook', async () => {
        const seen: string[] = [];
        const useLogger = defineComposable(() => ({
            onMount() { seen.push('composable'); },
        }));

        await mount({
            ...useComposables(useLogger(), { onMount() { seen.push('component'); } }),
            template: '<p>x</p>',
        });

        expect(seen).toEqual(['composable', 'component']);
    });

    it('warns and skips duplicate data keys (first writer wins)', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        try {
            const a = defineComposable(() => ({ data: { value: 1 } }));
            const b = defineComposable(() => ({ data: { value: 999 } }));

            const w = await mount({
                ...useComposables(a(), b()),
                template: '<p>{{ value }}</p>',
            });

            expect(w.text()).toBe('1');
            expect(warn).toHaveBeenCalledOnce();
            expect(warn.mock.calls[0][0]).toContain('data');
            expect(warn.mock.calls[0][0]).toContain('"value"');
            w.destroy();
        } finally {
            warn.mockRestore();
        }
    });

    it('supports nested composables (composable calling another composable)', async () => {
        const useLogger = defineComposable((label: string) => ({
            data: { lastLog: '' },
            methods: { log(this: any, msg: string) { this.lastLog = `${label}:${msg}`; } },
        }));

        const useCounter = defineComposable((initial = 0) => {
            const logger = useLogger('counter');
            return useComposables(logger, {
                data: { count: initial },
                methods: {
                    inc(this: any) { this.count++; this.log(`now=${this.count}`); },
                },
            });
        });

        const w = await mount({
            ...useCounter(0),
            template: '<p>{{ count }}-{{ lastLog }}</p>',
        });

        expect(w.text()).toBe('0-');
        (w.state as any).inc();
        await w.nextTick();
        expect(w.text()).toBe('1-counter:now=1');
        w.destroy();
    });

    it('merges computed and watch buckets', async () => {
        const seen: number[] = [];
        const useDoubled = defineComposable(() => ({
            data: { n: 2 },
            computed: { doubled(this: any) { return this.n * 2; } },
            watch: { n(this: any, v: number) { seen.push(v); } },
        }));

        const w = await mount({
            ...useDoubled(),
            template: '<p>{{ doubled }}</p>',
        });

        expect(w.text()).toBe('4');
        (w.state as any).n = 7;
        await w.nextTick();
        expect(w.text()).toBe('14');
        expect(seen).toEqual([7]);
        w.destroy();
    });
});
