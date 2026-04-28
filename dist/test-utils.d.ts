import { ComponentConfig, AppConfig } from './types.js';
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
export declare function mount(config: ComponentConfig, options?: MountOptions): Promise<TestWrapper>;
