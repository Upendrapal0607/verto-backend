import _ from 'lodash';
import { tryit } from 'radash';
import { Connection, Model, Document } from 'mongoose';

const DEFAULT_MAX_TIME_MS = 5000;

interface FindOptions {
    fields?: string[];
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
    maxTimeMS?: number;
}

interface FindOneOptions {
    sort?: Record<string, 1 | -1>;
    maxTimeMS?: number;
}

const getModel = (conn: Connection, modelName: string): Model<Document> => conn.model(modelName);

export const insertOne = (conn: Connection) => async (model: string, record: Record<string, unknown>): Promise<[Error | null, unknown]> => {
    const m = getModel(conn, model);
    const [err, result] = await tryit(async () => {
        const result = await m.create(record);
        return result.toObject();
    })();
    if (err) {
        return [err, null];
    }
    return [null, result];
};

export const updateOne = (conn: Connection) => async (model: string, query: Record<string, unknown>, updateData: Record<string, unknown>): Promise<[Error | null, boolean]> => {
    const m = getModel(conn, model);
    const r = m.updateOne(query, updateData);
    const [err, result] = await tryit(() => {
        return r.exec();
    })();
    if (err) {
        return [err, false];
    }
    if (result.acknowledged && result.modifiedCount == 1) {
        return [null, true];
    }
    return [null, false];
};

export const findOne = (conn: Connection) => async (model: string, query: Record<string, unknown>, opts: FindOneOptions = {}): Promise<[Error | null, unknown]> => {
    const m = getModel(conn, model);
    const r = m.findOne(query);
    _.each(['sort', 'maxTimeMS'], (prop: keyof FindOneOptions) => {
        const val = opts[prop] || null;
        if (val) {
            (r as any)[prop](val);
        }
    });
    if (!opts['maxTimeMS']) {
        r.maxTimeMS(DEFAULT_MAX_TIME_MS);
    }
    const [err, record] = await tryit(() => {
        return r.lean().exec();
    })();
    if (err) {
        return [err, null];
    }
    return [null, record];
};

export const findById = (conn: Connection) => async (model: string, id: string): Promise<[Error | null, unknown]> => {
    const m = getModel(conn, model);
    return findOne(conn)(model, { _id: id });
};

export const findMany = (conn: Connection) => async (model: string, query: Record<string, unknown>, opts: FindOptions = { fields: [], page: 1, limit: 10 }): Promise<[Error | null, unknown[]]> => {
    const m = getModel(conn, model);
    const fields = opts.fields || [];
    const mgQuery = m.find(query, fields);
    const skip = ((opts.page || 1) - 1) * (opts.limit || 10);
    if (skip > 0) {
        mgQuery.skip(skip);
    }
    _.each(['sort', 'limit', 'maxTimeMS'], (prop: keyof FindOptions) => {
        const val = opts[prop] || null;
        if (val) {
            (mgQuery as any)[prop](val);
        }
    });
    if (!opts['maxTimeMS']) {
        mgQuery.maxTimeMS(DEFAULT_MAX_TIME_MS);
    }
    const [err, records] = await tryit(() => {
        return mgQuery.lean().exec();
    })();
    if (err) {
        return [err, null];
    }
    return [null, records || []];
};

export const deleteOne = (conn: Connection) => async (model: string, query: Record<string, unknown>): Promise<[Error | null, boolean]> => {
    const m = getModel(conn, model);
    const [err] = await tryit(() => {
        return m.deleteOne(query);
    })();
    if (err) {
        return [err, false];
    }
    return [null, true];
};

export const count = (conn: Connection) => async (model: string, query: Record<string, unknown>): Promise<[Error | null, number]> => {
    const m = getModel(conn, model);
    const [err, result] = await tryit(() => {
        return m.countDocuments(query).maxTimeMS(DEFAULT_MAX_TIME_MS);
    })();
    if (err) {
        return [err, null];
    }
    return [null, result || 0];
};
