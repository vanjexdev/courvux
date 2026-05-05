import { describe, it, expect } from 'vitest';
import { mount } from '../test-utils.js';

describe('cv-for with :key — keyed reconciliation', () => {
    it('renders keyed list initially', async () => {
        const w = await mount({
            template: '<ul><li cv-for="item in items" :key="item.id">{{ item.name }}</li></ul>',
            data: { items: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }] }
        });
        const lis = w.findAll('li');
        expect(lis).toHaveLength(2);
        expect(lis[0].textContent?.trim()).toBe('Alice');
        expect(lis[1].textContent?.trim()).toBe('Bob');
        w.destroy();
    });

    it('updates existing node when item data changes (same key)', async () => {
        const w = await mount({
            template: '<ul><li cv-for="item in items" :key="item.id">{{ item.name }}</li></ul>',
            data: { items: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }] }
        });
        // Replace the collection with updated item — same keys, different values
        w.state.items = [{ id: 1, name: 'Alice Updated' }, { id: 2, name: 'Bob' }];
        await w.nextTick();
        const lis = w.findAll('li');
        expect(lis[0].textContent?.trim()).toBe('Alice Updated');
        expect(lis[1].textContent?.trim()).toBe('Bob');
        w.destroy();
    });

    it('adds new item without destroying existing nodes', async () => {
        const w = await mount({
            template: '<ul><li cv-for="item in items" :key="item.id">{{ item.id }}:{{ item.name }}</li></ul>',
            data: { items: [{ id: 1, name: 'A' }] }
        });
        const firstLi = w.find('li')!;
        w.state.items = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
        await w.nextTick();
        const lis = w.findAll('li');
        expect(lis).toHaveLength(2);
        // Same DOM node reused for id=1
        expect(lis[0]).toBe(firstLi);
        expect(lis[1].textContent?.trim()).toBe('2:B');
        w.destroy();
    });

    it('removes item for deleted key', async () => {
        const w = await mount({
            template: '<ul><li cv-for="item in items" :key="item.id">{{ item.name }}</li></ul>',
            data: { items: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 3, name: 'C' }] }
        });
        expect(w.findAll('li')).toHaveLength(3);
        w.state.items = [{ id: 1, name: 'A' }, { id: 3, name: 'C' }];
        await w.nextTick();
        const lis = w.findAll('li');
        expect(lis).toHaveLength(2);
        expect(lis[0].textContent?.trim()).toBe('A');
        expect(lis[1].textContent?.trim()).toBe('C');
        w.destroy();
    });

    it('reorders nodes without recreation', async () => {
        const w = await mount({
            template: '<ul><li cv-for="item in items" :key="item.id">{{ item.name }}</li></ul>',
            data: { items: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 3, name: 'C' }] }
        });
        const [li1, li2, li3] = w.findAll('li');
        // Reverse the order
        w.state.items = [{ id: 3, name: 'C' }, { id: 2, name: 'B' }, { id: 1, name: 'A' }];
        await w.nextTick();
        const lis = w.findAll('li');
        // Same DOM nodes, reordered
        expect(lis[0]).toBe(li3);
        expect(lis[1]).toBe(li2);
        expect(lis[2]).toBe(li1);
        w.destroy();
    });

    it('index variable updates when items reorder', async () => {
        const w = await mount({
            template: '<ul><li cv-for="(item, i) in items" :key="item.id">{{ i }}:{{ item.name }}</li></ul>',
            data: { items: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }] }
        });
        expect(w.findAll('li')[0].textContent?.trim()).toBe('0:A');
        w.state.items = [{ id: 2, name: 'B' }, { id: 1, name: 'A' }];
        await w.nextTick();
        const lis = w.findAll('li');
        expect(lis[0].textContent?.trim()).toBe('0:B');
        expect(lis[1].textContent?.trim()).toBe('1:A');
        w.destroy();
    });

    it('does not duplicate nodes when the same array mutates 3+ times in one tick', async () => {
        // Regression for the kanban-style race: each notifyKey fires its own
        // render(), and render() awaits walk() per new clone, so without
        // serialization a third notify can re-create a clone for a key whose
        // previous clone is still mid-await — both end up in the DOM but only
        // one is tracked in keyNodeMap, leaving an orphan.
        const w = await mount({
            template: '<ul><li cv-for="item in items" :key="item.id">{{ item.label }}</li></ul>',
            data: { items: [{ id: 1, label: 'A' }, { id: 2, label: 'B' }] }
        });

        // Three rapid mutations in the same synchronous turn — the same
        // pattern the kanban drop handler uses (col change, splice, push).
        // Use indexed mutations to mimic property writes that fire root-key
        // notifies on the array.
        const items = w.state.items as any[];
        items[1].label = 'B-edited';   // notify #1
        items.splice(1, 1);            // notify #2 — removes B
        items.push({ id: 2, label: 'B-edited' }); // notify #3 — re-adds B

        await w.nextTick();
        // Drain any scheduled follow-up renders that the serializer queued.
        await w.nextTick();

        const lis = w.findAll('li');
        expect(lis).toHaveLength(2);
        const ids = lis.map(li => li.textContent?.trim());
        expect(ids).toEqual(['A', 'B-edited']);
        w.destroy();
    });
});
