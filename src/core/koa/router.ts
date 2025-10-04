import { Router } from '@koa/router';

interface EndpointConfig {
    method: string;
    path: string;
}

interface Endpoint {
    config: EndpointConfig;
    handler: (ctx: unknown, next: unknown) => Promise<void>;
}

const addRoutes = (router: Router, endpoints: Endpoint[]): Router => {
    for (const endpoint of endpoints) {
        const method = endpoint.config.method.toLowerCase() as keyof Router;
        (router[method] as (path: string, handler: (ctx: unknown, next: unknown) => Promise<void>) => void)(endpoint.config.path, endpoint.handler);
    }
    return router;
};

export default addRoutes;
