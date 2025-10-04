import { isArray, isFunction, tryit } from 'radash';
import { z as zod, ZodError } from 'zod';
import { BadRequestError } from '../../core/index';

const isZodError = (e:any) => e?.issues && isArray(e.issues);

/**
 * @typedef {import('../core').NextFunc} NextFunc
 * @typedef {import('../core').Props} Props
 * @typedef {import('zod').AnyZodObject} AnyZodObject
 * @typedef {import('zod').ZodArray} ZodArray
 * @typedef {import('zod').ZodObject} ZodObject
 * @typedef {import('zod').ZodRawShape} ZodRawShape
 */

/**
 * @param {NextFunc} func
 * @param {AnyZodObject|ZodArray} model
 * @param {Props} props
 * @returns {Promise<any>}
 */
export const withPathParams = async (func:any, model:any, props:any) => {
    const [zerr, args] = await tryit(model.parseAsync)(props.request.params);
    if (zerr) {
        if (!isZodError(zerr)) {
            throw new BadRequestError('Path parameter validation failed: ' + (zerr.message ?? 'Parse error'), {
                key: 'err.path-params.parsing',
                cause: zerr,
            });
        }
        throw new BadRequestError(
            'Path parameter validation failed: ' +
                (zerr as ZodError).issues.map((e) => `${e.path.join('.')}: ${e.message.toLowerCase()}`).join(', '),
            {
                key: 'err.path-params.failed',
                cause: zerr,
            },
        );
    }
    return await func({
        ...props,
        args: {
            ...props.args,
            ...(args as any),
        },
    });
};

/**
 * @param {ZodObject|((z: typeof zod) => ZodRawShape)} shapeMaker
 * @returns {(func: NextFunc) => NextFunc}
 */
export const usePathParams = (shapeMaker:any) => (func:any) => {
    const model = isFunction(shapeMaker) ? zod.object(shapeMaker(zod)) : shapeMaker;
    return (props:any) => withPathParams(func, model, props);
};
