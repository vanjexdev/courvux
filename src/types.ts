export interface ComponentConfig {
    templateUrl?: string;
    template?: string;
    data?: Record<string, any>;
    methods?: Record<string, Function>;
    computed?: Record<string, (this: any) => any>;
    watch?: Record<string, (this: any, newVal: any, oldVal: any) => void>;
    components?: Record<string, ComponentConfig>;
    onMount?(this: any): void;
    onDestroy?(this: any): void;
}

export type LazyComponent = () => Promise<{ default: ComponentConfig }>;

export type NavigationGuard = (to: RouteMatch, next: (redirectPath?: string) => void) => void | Promise<void>;

export interface RouteConfig {
    path: string;
    layout?: string;
    transition?: string;
    beforeEnter?: NavigationGuard;
    component: ComponentConfig | LazyComponent;
}

export interface Router {
    routes: RouteConfig[];
    mode: 'hash' | 'history';
    transition?: string;
    navigate(path: string): void;
}

export interface AppConfig extends ComponentConfig {
    components?: Record<string, ComponentConfig>;
    router?: Router;
    store?: Record<string, any>;
}

export interface RouteMatch {
    params: Record<string, string>;
    path: string;
}
