export interface HeadMeta {
    name?: string;
    property?: string;
    'http-equiv'?: string;
    charset?: string;
    content?: string;
    [key: string]: string | undefined;
}
export interface HeadLink {
    rel: string;
    href?: string;
    [key: string]: string | undefined;
}
export interface HeadScript {
    src?: string;
    type?: string;
    async?: boolean | string;
    defer?: boolean | string;
    innerHTML?: string;
    [key: string]: string | boolean | undefined;
}
export interface HeadConfig {
    title?: string;
    titleTemplate?: string | ((title: string) => string);
    meta?: HeadMeta[];
    link?: HeadLink[];
    script?: HeadScript[];
    htmlAttrs?: Record<string, string>;
    bodyAttrs?: Record<string, string>;
}
/** @internal — used by `renderPage` in src/ssr.ts to capture head calls during SSG. */
export declare function _startHeadCollection(): void;
/** @internal — called by `renderPage` to retrieve and reset the collected head. */
export declare function _stopHeadCollection(): HeadConfig[];
export declare function useHead(config: HeadConfig): () => void;
