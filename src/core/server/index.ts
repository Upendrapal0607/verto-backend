export const shutdown = (cb: () => void | Promise<void>): void => {
    process.on('SIGTERM', cb);
    process.on('SIGINT', cb);
};
