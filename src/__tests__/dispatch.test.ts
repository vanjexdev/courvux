import { describe, it, expect, vi } from 'vitest';
import { mount } from '../test-utils.js';

describe('$dispatch', () => {
    it('fires a CustomEvent that bubbles', async () => {
        const w = await mount({
            template: '<button @click="$dispatch(\'my-event\', { x: 1 })">fire</button>',
            data: {}
        });
        const spy = vi.fn();
        document.body.addEventListener('my-event', spy);
        await w.trigger('button', 'click');
        expect(spy).toHaveBeenCalledTimes(1);
        expect((spy.mock.calls[0][0] as CustomEvent).detail).toEqual({ x: 1 });
        document.body.removeEventListener('my-event', spy);
        w.destroy();
    });

    it('ancestor element catches bubbled event via @event', async () => {
        // $dispatch fires on child component's $el. The parent template div catches
        // the event as it bubbles up. global must be the SECOND argument to mount().
        const w = await mount(
            {
                template: `<div @child-ping="received = true"><child-cmp></child-cmp></div>`,
                data: { received: false }
            },
            {
                global: {
                    components: {
                        'child-cmp': {
                            template: '<button @click="$dispatch(\'child-ping\')">ping</button>',
                            data: {}
                        }
                    }
                }
            }
        );
        await w.trigger('button', 'click');
        await w.nextTick();
        expect(w.state.received).toBe(true);
        w.destroy();
    });
});
