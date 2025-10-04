import { Types, Connection } from 'mongoose';
import {
    count as countMongo,
    deleteOne as deleteOneMongo,
    findById as findByIdMongo,
    findMany as findManyMongo,
    findOne as findOneMongo,
    insertOne as insertOneMongo,
    updateOne as updateOneMongo,
} from './methods';

interface DatabaseClient {
    findById: (model: string, id: string) => Promise<[Error | null, unknown]>;
    findMany: (model: string, query?: Record<string, unknown>, opts?: Record<string, unknown>) => Promise<[Error | null, unknown[]]>;
    count: (model: string, query?: Record<string, unknown>) => Promise<[Error | null, number]>;
    isConnected: () => boolean;
    insertOne: (model: string, record: Record<string, unknown>) => Promise<[Error | null, unknown]>;
    updateOne: (model: string, query: Record<string, unknown>, updateData: Record<string, unknown>) => Promise<[Error | null, unknown]>;
    deleteOne: (model: string, query: Record<string, unknown>) => Promise<[Error | null, unknown]>;
    findOne: (model: string, query: Record<string, unknown>) => Promise<[Error | null, unknown]>;
    generateNewId: () => Types.ObjectId;
}

const createMongoClient = (conn: Connection): DatabaseClient => {
    return {
        findById: findByIdMongo(conn),
        findMany: findManyMongo(conn),
        count: countMongo(conn),
        isConnected: () => conn.readyState === 1,
        insertOne: insertOneMongo(conn),
        updateOne: updateOneMongo(conn),
        deleteOne: deleteOneMongo(conn),
        findOne: findOneMongo(conn),
        generateNewId: () => new Types.ObjectId(),
    };
};

export default createMongoClient;
