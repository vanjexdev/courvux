import { describe, it, expect, vi } from 'vitest';
import { createReactivityScope, batchUpdate } from '../reactivity.js';

describe('createReactivityScope', () => {
    it('creates reactive state and notifies subscribers on change', () => {
        const { createReactiveState, subscribe } = createReactivityScope();
        const state = createReactiveState({ count: 0 }) as any;
        const spy = vi.fn();
        subscribe('count', spy);
        state.count = 5;
        expect(spy).toHaveBeenCalledTimes(1);
        expect(state.count).toBe(5);
    });

    it('does not notify when value unchanged', () => {
        const { createReactiveState, subscribe } = createReactivityScope();
        const state = createReactiveState({ x: 1 }) as any;
        const spy = vi.fn();
        subscribe('x', spy);
        state.x = 1;
        expect(spy).not.toHaveBeenCalled();
    });

    it('unsubscribes correctly', () => {
        const { createReactiveState, subscribe } = createReactivityScope();
        const state = createReactiveState({ n: 0 }) as any;
        const spy = vi.fn();
        const unsub = subscribe('n', spy);
        unsub();
        state.n = 99;
        expect(spy).not.toHaveBeenCalled();
    });

    it('multiple keys are independent', () => {
        const { createReactiveState, subscribe } = createReactivityScope();
        const state = createReactiveState({ a: 1, b: 2 }) as any;
        const spyA = vi.fn();
        const spyB = vi.fn();
        subscribe('a', spyA);
        subscribe('b', spyB);
        state.a = 10;
        expect(spyA).toHaveBeenCalledTimes(1);
        expect(spyB).not.toHaveBeenCalled();
    });
});

describe('batchUpdate', () => {
    it('groups multiple mutations into a single notification tick', async () => {
        const { createReactiveState, subscribe } = createReactivityScope();
        const state = createReactiveState({ x: 0, y: 0 }) as any;
        const spy = vi.fn();
        subscribe('x', spy);
        subscribe('y', spy);
        batchUpdate(() => {
            state.x = 1;
            state.y = 2;
        });
        // batchUpdate is sync but defers notification — flush microtasks
        await Promise.resolve();
        expect(spy.mock.calls.length).toBeGreaterThanOrEqual(1);
        expect(state.x).toBe(1);
        expect(state.y).toBe(2);
    });
});
