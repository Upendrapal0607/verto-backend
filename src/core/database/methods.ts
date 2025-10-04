import _ from 'lodash';
import { tryit } from 'radash';

const DEFAULT_MAX_TIME_MS = 5000;

const getModel = (conn :any, m:any) => conn.model(m);


export const insertOne = (conn : any) => async (model:any, record:any) => {
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

export const updateOne = (conn:any) => async (model:any, query:any, updateData:any) => {
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

export const findOne =
    (conn:any) =>
    async (model:any, query:any, opts:any = {}) => {
        const m = getModel(conn, model);
        const r = m.findOne(query);
        _.each(['sort', 'maxTimeMS'], (prop:any) => {
            const val = opts[prop] || null;
            if (val) {
                r[prop](val);
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


export const findById = (conn:any) => async (model:any, id:any) => {
    const m = getModel(conn, model);
    return findOne(conn)(model, { _id: id });
};

export const findMany =
    (conn:any) =>
    async (model:any, query:any, opts:any = { fields: [], page: 1, limit: 10 }) => {
        const m = getModel(conn, model);
        const fields = opts.fields || [];
        const mgQuery = m.find(query, fields);
        const skip = ((opts.page || 1) - 1) * (opts.limit || 10);
        if (skip > 0) {
            mgQuery.skip(skip);
        }
        _.each(['sort', 'limit', 'maxTimeMS'], (prop:any) => {
            const val = opts[prop] || null;
            if (val) {
                mgQuery[prop](val);
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



export const deleteOne = (conn:any) => async (model:any, query:any) => {
    const m = getModel(conn, model);
    const [err] = await tryit(() => {
        return m.deleteOne(query);
    })();
    if (err) {
        return [err, false];
    }
    return [null, true];
};


export const count = (conn:any) => async (model:any, query:any) => {
    const m = getModel(conn, model);
    const [err, result] = await tryit(() => {
        return m.countDocuments(query).maxTimeMS(DEFAULT_MAX_TIME_MS);
    })();
    if (err) {
        return [err, null];
    }
    return [null, result || 0];
};
