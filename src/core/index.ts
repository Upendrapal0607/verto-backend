
import { disconnectMongo, default as makeDatabase } from './database/index';
import {  useAuth, useFeature, useRoleAuth } from './hooks/index';

export { default as addRoutes } from './koa/router';
export { shutdown } from './server/index';

export {
    disconnectMongo,
    makeDatabase,
    useAuth,
    useFeature,
    useRoleAuth,
};

export const useCoreServices = () => {
    const db = makeDatabase();

    return {
        db,
    };
};
