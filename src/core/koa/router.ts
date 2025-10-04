const addRoutes = (router:any, endpoints:any) => {
    for (const endpoint of endpoints) {
        const m = endpoint.config.method.toLowerCase();
        router[m](endpoint.config.path, endpoint.handler);
    }
    return router;
};

export default addRoutes;
