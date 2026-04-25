export interface ComponentConfig {
    templateUrl?: string;
    template?: string;
    data?: Record<string, any>;
    methods?: Record<string, Function>;
    components?: Record<string, ComponentConfig>;
    onMount?(this: any): void;
    onDestroy?(this: any): void;
}

export type LazyComponent = () => Promise<{ default: ComponentConfig }>;

export interface RouteConfig {
    path: string;
    layout?: string;
    component: ComponentConfig | LazyComponent;
}

export interface Router {
    routes: RouteConfig[];
    mode: 'hash' | 'history';
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
