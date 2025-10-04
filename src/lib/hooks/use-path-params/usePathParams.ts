import { isArray, isFunction, tryit } from 'radash';
import { z as zod, ZodError, ZodSchema, ZodTypeAny } from 'zod';
import { BadRequestError } from '../../core/index';
import { Props, NextFunc } from '../../core/types';

const isZodError = (e: unknown): e is ZodError => e instanceof ZodError && e?.issues && isArray(e.issues);

export const withPathParams = async <TProps extends Props, TResult>(
    func: NextFunc<TProps, TResult>, 
    model: ZodSchema, 
    props: TProps
): Promise<TResult> => {
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
            ...(args as Record<string, unknown>),
        },
    } as TProps);
};

type ShapeMaker = (z: typeof zod) => Record<string, ZodTypeAny>;

export const usePathParams = <TProps extends Props = Props>(shapeMaker: ShapeMaker | ZodSchema) => 
    <TResult>(func: NextFunc<TProps, TResult>) => {
        const model = isFunction(shapeMaker) ? zod.object(shapeMaker(zod)) : shapeMaker;
        return (props: TProps) => withPathParams(func, model, props);
    };
