import { createConnection } from 'mongoose';
import config from '../config';
import createClient from './client';

let defConn : any = null;

export const getConn = () => {
    const options = {
        dbName: config.databaseName || "employee",
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 10000, // 10 seconds for initial connection timeout
        socketTimeoutMS: 45000, // 45 seconds for socket inactivity timeout
    };
    
    let conn = defConn;
    if (!defConn) {
        conn = createConnection(config.mongoUri, options);
        defConn = conn;
    }
    return conn;
};

export const registerModel = (model : any, schema : any) => {
    const conn = getConn();
    
    return conn.model(model, schema);
};

const makeMongo = () => {
    const conn = getConn();
    return createClient(conn);
};

/**
 * Disconnect from MongoDB
 */
export const disconnectMongo = async () => {
    const conn = getConn();
    await conn.close();
};

export default makeMongo;
