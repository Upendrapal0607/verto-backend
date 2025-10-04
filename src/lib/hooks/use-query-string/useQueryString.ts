import { isArray, isFunction, tryit } from 'radash';
import { z as zod, ZodError } from 'zod';
import { BadRequestError } from '../../core/index';

const isZodError = (e:any) => e?.issues && isArray(e.issues);

export const withQueryString = async (func:any, model:any, props:any) => {
    const [zerr, args] = await tryit(model.parseAsync)(props.request.query);
    if (zerr) {
        if (!isZodError(zerr)) {
            throw new BadRequestError('Query string validation failed: ' + (zerr.message ?? 'Parse error'), {
                key: 'err.query-string.parsing',
                cause: zerr,
            });
        }
        throw new BadRequestError(
            'Query string validation failed: ' +
                (zerr as ZodError).issues.map((e) => `${e.path.join('.')}: ${e.message.toLowerCase()}`).join(', '),
            {
                key: 'err.query-string.failed',
                cause: zerr as ZodError,
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

export const useQueryString = (shapeMaker:any) => (func:any) => {
    const model = isFunction(shapeMaker) ? zod.object(shapeMaker(zod)) : shapeMaker;
    return (props:any) => withQueryString(func, model, props);
};
