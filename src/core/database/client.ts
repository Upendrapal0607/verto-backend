import { Types } from 'mongoose';
import {
    count as countMongo,
    deleteOne as deleteOneMongo,
    findById as findByIdMongo,
    findMany as findManyMongo,
    findOne as findOneMongo,
    insertOne as insertOneMongo,
    updateOne as updateOneMongo,
} from './methods';

const createMongoClient = (conn : any) => {
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
