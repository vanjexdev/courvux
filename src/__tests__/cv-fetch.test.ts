import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cvFetch } from '../composables.js';

const flush = () => new Promise(r => setTimeout(r, 0));

describe('cvFetch', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
    });
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('fires loading then data on successful response', async () => {
        (fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ id: 1, name: 'A' }),
        });

        const cb = vi.fn();
        cvFetch('/api/x', cb);

        // First call is the synchronous loading=true
        expect(cb).toHaveBeenCalledWith({ data: null, loading: true, error: null });

        await flush();
        await flush();

        const last = cb.mock.calls.at(-1)![0];
        expect(last.loading).toBe(false);
        expect(last.error).toBeNull();
        expect(last.data).toEqual({ id: 1, name: 'A' });
    });

    it('reports error on non-OK response', async () => {
        (fetch as any).mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });

        const cb = vi.fn();
        cvFetch('/api/fail', cb);
        await flush();
        await flush();

        const last = cb.mock.calls.at(-1)![0];
        expect(last.loading).toBe(false);
        expect(last.data).toBeNull();
        expect(last.error).toBeInstanceOf(Error);
        expect(last.error.message).toContain('500');
    });

    it('reports error on network failure', async () => {
        (fetch as any).mockRejectedValue(new Error('network down'));

        const cb = vi.fn();
        cvFetch('/api/x', cb);
        await flush();
        await flush();

        const last = cb.mock.calls.at(-1)![0];
        expect(last.error).toBeInstanceOf(Error);
        expect(last.error.message).toBe('network down');
    });

    it('does not fetch immediately when immediate: false', () => {
        (fetch as any).mockResolvedValue({ ok: true, json: async () => ({}) });
        const cb = vi.fn();
        cvFetch('/api/x', cb, { immediate: false });
        expect(fetch).not.toHaveBeenCalled();
        expect(cb).not.toHaveBeenCalled();
    });

    it('execute() triggers a fetch and accepts URL override', async () => {
        (fetch as any).mockResolvedValue({ ok: true, json: async () => ({ ok: 1 }) });
        const cb = vi.fn();
        const ctl = cvFetch('/api/x', cb, { immediate: false });

        ctl.execute('/api/y');
        expect(fetch).toHaveBeenCalledTimes(1);
        expect((fetch as any).mock.calls[0][0]).toBe('/api/y');
    });

    it('transform option maps the raw response', async () => {
        (fetch as any).mockResolvedValue({ ok: true, json: async () => ({ n: 21 }) });
        const cb = vi.fn();
        cvFetch('/api/x', cb, { transform: (raw: any) => raw.n * 2 });
        await flush();
        await flush();
        expect(cb.mock.calls.at(-1)![0].data).toBe(42);
    });

    it('abort() cancels in-flight request and suppresses callback', async () => {
        const pending = new Promise(() => { /* never resolves */ });
        (fetch as any).mockImplementation((_url: string, opts: any) => {
            return new Promise((_, reject) => {
                opts.signal.addEventListener('abort', () =>
                    reject(Object.assign(new Error('aborted'), { name: 'AbortError' }))
                );
            });
        });

        const cb = vi.fn();
        const ctl = cvFetch('/api/x', cb);
        const callsBefore = cb.mock.calls.length;
        ctl.abort();
        await flush();
        await flush();
        // No additional callback invocation after abort
        expect(cb.mock.calls.length).toBe(callsBefore);
    });
});
