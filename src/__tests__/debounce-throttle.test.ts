import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cvDebounce, cvThrottle } from '../composables.js';

describe('cvDebounce', () => {
    beforeEach(() => { vi.useFakeTimers(); });
    afterEach(()  => { vi.useRealTimers(); });

    it('delays single call by the specified ms', () => {
        const fn = vi.fn();
        const d = cvDebounce(fn, 200);
        d();
        expect(fn).not.toHaveBeenCalled();
        vi.advanceTimersByTime(199);
        expect(fn).not.toHaveBeenCalled();
        vi.advanceTimersByTime(1);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('coalesces rapid calls into a single trailing invocation', () => {
        const fn = vi.fn();
        const d = cvDebounce(fn, 100);
        d(1); d(2); d(3);
        vi.advanceTimersByTime(99);
        d(4);
        vi.advanceTimersByTime(99);
        expect(fn).not.toHaveBeenCalled();
        vi.advanceTimersByTime(1);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith(4);
    });

    it('preserves this binding when used as a method', () => {
        const seen: any[] = [];
        const obj = {
            value: 'X',
            run: cvDebounce(function (this: any) { seen.push(this.value); }, 50),
        };
        obj.run();
        vi.advanceTimersByTime(50);
        expect(seen).toEqual(['X']);
    });

    it('cancel() prevents the pending invocation', () => {
        const fn = vi.fn();
        const d = cvDebounce(fn, 100);
        d();
        d.cancel();
        vi.advanceTimersByTime(200);
        expect(fn).not.toHaveBeenCalled();
    });
});

describe('cvThrottle', () => {
    beforeEach(() => { vi.useFakeTimers(); });
    afterEach(()  => { vi.useRealTimers(); });

    it('fires immediately on first call', () => {
        const fn = vi.fn();
        const t = cvThrottle(fn, 100);
        t(1);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith(1);
    });

    it('drops calls inside the throttle window but schedules a trailing call', () => {
        const fn = vi.fn();
        const t = cvThrottle(fn, 100);
        t('a');                           // immediate
        t('b'); t('c'); t('d');           // dropped from immediate, last one scheduled
        expect(fn).toHaveBeenCalledTimes(1);
        vi.advanceTimersByTime(100);
        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn).toHaveBeenLastCalledWith('d');
    });

    it('allows new immediate call after window elapses', () => {
        const fn = vi.fn();
        const t = cvThrottle(fn, 50);
        t(1);
        vi.advanceTimersByTime(60);
        t(2);
        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn).toHaveBeenLastCalledWith(2);
    });

    it('preserves this binding when used as a method', () => {
        const seen: any[] = [];
        const obj = {
            value: 'Y',
            run: cvThrottle(function (this: any) { seen.push(this.value); }, 50),
        };
        obj.run();
        expect(seen).toEqual(['Y']);
    });

    it('cancel() resets state and clears trailing invocation', () => {
        const fn = vi.fn();
        const t = cvThrottle(fn, 100);
        t('a');
        t('b'); // scheduled
        t.cancel();
        vi.advanceTimersByTime(200);
        expect(fn).toHaveBeenCalledTimes(1); // only the immediate
    });
});
