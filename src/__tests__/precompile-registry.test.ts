import { describe, it, expect } from 'vitest';
import { mount } from '../test-utils.js';
import { attachCompiledExprs } from '../dom.js';

describe('precompile registry — evaluate() fast path', () => {
    it('uses precompiled fn for {{ expr }} interpolation when registry hits', async () => {
        let calls = 0;
        const w = await mount({
            template: '<p>{{ count + 1 }}</p>',
            data: { count: 5 },
            // Simulate what the Vite plugin would emit.
            exprs: {
                'count + 1': ($s: any) => { calls++; return $s.count + 1; },
            },
        } as any);
        expect(w.text()).toBe('6');
        expect(calls).toBeGreaterThan(0);
        w.destroy();
    });

    it('precompiled fn for :attr binding fires on dependency change', async () => {
        const w = await mount({
            template: '<button :disabled="loading">Save</button>',
            data: { loading: false },
            exprs: {
                'loading': ($s: any) => $s.loading,
            },
        } as any);
        const btn = w.find('button') as HTMLButtonElement;
        expect(btn.disabled).toBe(false);
        w.state.loading = true;
        await w.nextTick();
        expect(btn.disabled).toBe(true);
        w.destroy();
    });

    it('precompiled handler mutates state through arrow body', async () => {
        const w = await mount({
            template: '<button @click="count++">{{ count }}</button>',
            data: { count: 0 },
            exprs: {
                'count++': ($s: any) => ($s.count++),
                'count':   ($s: any) => $s.count,
            },
        } as any);
        const btn = w.find('button')!;
        expect(btn.textContent?.trim()).toBe('0');
        btn.click();
        await w.nextTick();
        expect(btn.textContent?.trim()).toBe('1');
        w.destroy();
    });

    it('falls back to runtime evaluator when expr not in registry', async () => {
        const w = await mount({
            template: '<p>{{ a + b }}</p>',
            data: { a: 2, b: 3 },
            exprs: {
                // intentionally only register one of the two expressions
                a: ($s: any) => $s.a,
            },
        } as any);
        // 'a + b' isn't in the map — runtime new Function path computes 5.
        expect(w.text()).toBe('5');
        w.destroy();
    });

    it('attachCompiledExprs merges entries from multiple calls', async () => {
        let aCalls = 0, bCalls = 0;
        const w = await mount({
            template: '<p>{{ a }}-{{ b }}</p>',
            data: { a: 'x', b: 'y' },
        });
        // Two separate attachCompiledExprs calls — second must add without
        // overwriting the first.
        attachCompiledExprs(w.state as object, {
            a: ($s: any) => { aCalls++; return 'A:' + $s.a; },
        });
        attachCompiledExprs(w.state as object, {
            b: ($s: any) => { bCalls++; return 'B:' + $s.b; },
        });
        // Trigger re-render via real mutations so subscribers fire.
        w.state.a = 'x2';
        w.state.b = 'y2';
        await w.nextTick();
        expect(w.text()).toBe('A:x2-B:y2');
        expect(aCalls).toBeGreaterThan(0);
        expect(bCalls).toBeGreaterThan(0);
        w.destroy();
    });

    it('cv-for iteration scope inherits parent registry', async () => {
        // Without inheritCompiledExprs() being called from makeItemState /
        // mergedItemState, the per-iteration evaluate() lookup would miss
        // the WeakMap and fall back to new Function — fatal under strict CSP.
        const w = await mount({
            template: '<ul><li cv-for="item in items" :key="item.id">{{ item.name }}</li></ul>',
            data: { items: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }] },
            exprs: {
                'items':     ($s: any) => $s.items,
                'item.id':   ($s: any) => $s.item.id,
                'item.name': ($s: any) => $s.item.name,
            },
        } as any);
        const lis = w.findAll('li');
        expect(lis).toHaveLength(2);
        expect(lis[0].textContent?.trim()).toBe('A');
        expect(lis[1].textContent?.trim()).toBe('B');
        w.destroy();
    });

    it('cv-data inline scope inherits parent registry', async () => {
        const w = await mount({
            template: '<div cv-data="{ flag: true }"><p cv-show="flag">on</p></div>',
            data: {},
            exprs: {
                'flag': ($s: any) => $s.flag,
                "{ flag: true }": ($s: any) => ({ flag: true }),
            },
        } as any);
        const p = w.find('p') as HTMLElement;
        expect(p.style.display).not.toBe('none');
        w.destroy();
    });
});
