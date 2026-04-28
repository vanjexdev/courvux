export interface EventBus<Events extends Record<string, any> = Record<string, any>> {
    on<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void): () => void;
    off<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void): void;
    emit<K extends keyof Events>(event: K, payload?: Events[K]): void;
    once<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void): () => void;
    clear(event?: keyof Events): void;
}
export declare function createEventBus<Events extends Record<string, any> = Record<string, any>>(): EventBus<Events>;
