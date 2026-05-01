import { describe, it, expect, beforeEach } from 'vitest';
import { cvStorage } from '../composables.js';

describe('cvStorage', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('hydrates initial state from defaults when storage is empty', () => {
        const s = cvStorage('settings', { theme: 'light', sidebar: true });
        expect(s.theme).toBe('light');
        expect(s.sidebar).toBe(true);
    });

    it('persists mutations to localStorage', () => {
        const s = cvStorage('s1', { theme: 'light' });
        s.theme = 'dark';
        const raw = localStorage.getItem('s1');
        expect(raw).not.toBeNull();
        expect(JSON.parse(raw!)).toMatchObject({ theme: 'dark' });
    });

    it('rehydrates persisted values on next instantiation', () => {
        const a = cvStorage('s2', { count: 0 });
        a.count = 42;
        const b = cvStorage('s2', { count: 0 });
        expect(b.count).toBe(42);
    });

    it('merges defaults with persisted partial state', () => {
        localStorage.setItem('s3', JSON.stringify({ theme: 'dark' }));
        const s = cvStorage('s3', { theme: 'light', sidebar: true });
        expect(s.theme).toBe('dark');
        expect(s.sidebar).toBe(true);
    });

    it('$clear resets keys to defaults and removes from storage', () => {
        const s = cvStorage('s4', { theme: 'light' }) as any;
        s.theme = 'dark';
        expect(localStorage.getItem('s4')).not.toBeNull();
        s.$clear();
        expect(s.theme).toBe('light');
        expect(localStorage.getItem('s4')).toBeNull();
    });

    it('survives malformed JSON in storage by falling back to defaults', () => {
        localStorage.setItem('s5', '{not valid json');
        const s = cvStorage('s5', { v: 1 });
        expect(s.v).toBe(1);
    });
});
