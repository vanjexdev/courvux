import { describe, it, expect, vi } from 'vitest';
import { createEventBus } from '../events.js';

describe('createEventBus', () => {
    it('on/emit delivers payload to subscribers', () => {
        const bus = createEventBus<{ greet: { name: string } }>();
        const spy = vi.fn();
        bus.on('greet', spy);
        bus.emit('greet', { name: 'Alice' });
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ name: 'Alice' });
    });

    it('emit reaches multiple subscribers in registration order', () => {
        const bus = createEventBus<{ tick: number }>();
        const order: string[] = [];
        bus.on('tick', () => order.push('a'));
        bus.on('tick', () => order.push('b'));
        bus.on('tick', () => order.push('c'));
        bus.emit('tick', 1);
        expect(order).toEqual(['a', 'b', 'c']);
    });

    it('on returns unsubscribe function', () => {
        const bus = createEventBus<{ x: void }>();
        const spy = vi.fn();
        const off = bus.on('x', spy);
        bus.emit('x');
        off();
        bus.emit('x');
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('off removes specific handler only', () => {
        const bus = createEventBus<{ ping: void }>();
        const a = vi.fn(); const b = vi.fn();
        bus.on('ping', a);
        bus.on('ping', b);
        bus.off('ping', a);
        bus.emit('ping');
        expect(a).not.toHaveBeenCalled();
        expect(b).toHaveBeenCalledTimes(1);
    });

    it('once fires exactly one time then auto-unsubscribes', () => {
        const bus = createEventBus<{ boom: number }>();
        const spy = vi.fn();
        bus.once('boom', spy);
        bus.emit('boom', 1);
        bus.emit('boom', 2);
        bus.emit('boom', 3);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(1);
    });

    it('clear(event) removes all listeners for that event', () => {
        const bus = createEventBus<{ a: void; b: void }>();
        const sa = vi.fn(); const sb = vi.fn();
        bus.on('a', sa);
        bus.on('b', sb);
        bus.clear('a');
        bus.emit('a');
        bus.emit('b');
        expect(sa).not.toHaveBeenCalled();
        expect(sb).toHaveBeenCalledTimes(1);
    });

    it('clear() with no args removes every listener', () => {
        const bus = createEventBus<{ a: void; b: void }>();
        const sa = vi.fn(); const sb = vi.fn();
        bus.on('a', sa);
        bus.on('b', sb);
        bus.clear();
        bus.emit('a');
        bus.emit('b');
        expect(sa).not.toHaveBeenCalled();
        expect(sb).not.toHaveBeenCalled();
    });

    it('handler unsubscribing during emit does not affect current dispatch', () => {
        const bus = createEventBus<{ go: void }>();
        const log: string[] = [];
        const a = () => { log.push('a'); bus.off('go', b); };
        const b = () => { log.push('b'); };
        bus.on('go', a);
        bus.on('go', b);
        bus.emit('go');
        expect(log).toEqual(['a', 'b']);
        bus.emit('go');
        expect(log).toEqual(['a', 'b', 'a']);
    });
});
