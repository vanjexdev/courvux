export interface ComponentConfig {
    templateUrl?: string;
    template?: string;
    data?: Record<string, any>;
    methods?: Record<string, Function>;
    components?: Record<string, ComponentConfig>;
}
export interface RouteConfig {
    path: string;
    component: ComponentConfig;
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
