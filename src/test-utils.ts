import { ComponentConfig, AppConfig } from './types.js';
import { createApp } from './index.js';

export interface MountOptions {
    data?: Record<string, any>;
    attachTo?: Element;
    global?: Pick<AppConfig, 'store' | 'router' | 'components' | 'directives' | 'provide'>;
}

export interface TestWrapper {
    /** Root element of the mounted component */
    el: HTMLElement;
    /** Reactive state — set keys to trigger updates */
    state: Record<string, any>;
    /** Inner HTML of root element */
    html(): string;
    /** Text content of root element (trimmed) */
    text(): string;
    /** querySelector scoped to component root */
    find<T extends Element = HTMLElement>(selector: string): T | null;
    /** querySelectorAll scoped to component root */
    findAll<T extends Element = HTMLElement>(selector: string): T[];
    /** Dispatch DOM event and wait one tick */
    trigger(target: string | Element, event: string, options?: EventInit): Promise<void>;
    /** Wait for pending reactive updates to flush */
    nextTick(): Promise<void>;
    /** Unmount and remove from DOM */
    destroy(): void;
}

export async function mount(config: ComponentConfig, options: MountOptions = {}): Promise<TestWrapper> {
    const el = document.createElement('div');
    const container = options.attachTo ?? document.body;
    container.appendChild(el);

    const mergedConfig: AppConfig = {
        ...options.global,
        ...config,
        data: { ...config.data, ...(options.data ?? {}) },
    };

    const app = createApp(mergedConfig);
    const state = await app.mountEl(el);

    return {
        el,
        get state() { return state; },
        html: () => el.innerHTML,
        text: () => el.textContent?.trim() ?? '',
        find: <T extends Element = HTMLElement>(sel: string) => el.querySelector<T>(sel),
        findAll: <T extends Element = HTMLElement>(sel: string) => Array.from(el.querySelectorAll<T>(sel)),
        trigger: async (target, event, opts = {}) => {
            const targetEl = typeof target === 'string' ? el.querySelector(target) : target;
            if (!targetEl) return;
            targetEl.dispatchEvent(new Event(event, { bubbles: true, cancelable: true, ...opts }));
            // Two ticks: one for sync handlers, one for any async microtasks
            await Promise.resolve();
            await Promise.resolve();
        },
        nextTick: () => new Promise(r => setTimeout(r, 0)),
        destroy: () => { app.destroy(); el.parentNode?.removeChild(el); },
    };
}
