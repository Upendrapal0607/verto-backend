export const shutdown = (cb:any) => {
    process.on('SIGTERM', cb);
    process.on('SIGINT', cb);
};
