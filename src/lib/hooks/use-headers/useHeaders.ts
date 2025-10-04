import { isArray, isFunction, tryit } from 'radash';
import zod, { ZodArray, ZodError, ZodObject, ZodRawShape, ZodSchema } from 'zod';
import { NextFunc, Props } from '../../core/types';
import { BadRequestError } from '../../core';

const isZodError = (e: unknown): e is ZodError => e instanceof ZodError && e?.issues && isArray(e.issues);

export const withHeaders = async <TProps extends Props, TResult>(
    func: NextFunc<TProps, TResult>, 
    model: ZodSchema, 
    props: TProps
): Promise<TResult> => {
    const [zerr, args] = await tryit(model.parseAsync)(props.request.headers);
    if (zerr) {
        if (!isZodError(zerr)) {
            throw new BadRequestError('Header validation failed: ' + zerr.message, {
                key: 'err.headers.parsing',
                cause: zerr,
            });
        }
        throw new BadRequestError(
            'Header validation failed: ' +
                zerr.issues.map((e) => `${e.path.join('.')}: ${e.message.toLowerCase()}`).join(', '),
            {
                key: 'err.headers.failed',
                cause: zerr,
            },
        );
    }
    return await func({
        ...props,
        args: {
            ...props.args,
            ...(args as Record<string, unknown>),
        },
    } as TProps);
};

export const useHeaders: <TRawShape extends ZodRawShape>(
    shapeMaker: ZodObject<TRawShape> | ((z: typeof zod) => TRawShape),
) => (func: NextFunc<Props<ZodObject<TRawShape>['_output']>>) => NextFunc<Props> = (shapeMaker) => (func) => {
    const model = isFunction(shapeMaker) ? zod.object(shapeMaker(zod)) : shapeMaker;
    return (props) => withHeaders(func as NextFunc, model, props);
};
