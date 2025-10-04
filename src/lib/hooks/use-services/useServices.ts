import { isFunction, objectify, parallel } from 'radash';
import { Props, NextFunc } from '../../core/types';

type ServiceFunction<TProps extends Props = Props> = (props: TProps) => unknown | Promise<unknown>;
type ServiceValue = unknown | ServiceFunction;
type ServiceFunctionsByKey = Record<string, ServiceValue>;

interface ServiceResult {
    key: string;
    value: unknown;
}

async function withServices<TProps extends Props, TResult>(
    func: NextFunc<TProps, TResult>, 
    serviceFunctionsByKey: ServiceFunctionsByKey, 
    props: TProps
): Promise<TResult> {
    const serviceList = await parallel(10, Object.keys(serviceFunctionsByKey), async (key: string): Promise<ServiceResult> => {
        const serviceOrFunction = serviceFunctionsByKey[key];
        return {
            key,
            value: await Promise.resolve(isFunction(serviceOrFunction) ? serviceOrFunction(props) : serviceOrFunction),
        };
    });

    // Create object of services (key is service name, value returned from service function)
    const services = objectify(
        serviceList,
        (s: ServiceResult) => s.key,
        (s: ServiceResult) => s.value,
    );

    return await func({
        ...props,
        services: {
            ...props.services,
            ...services,
        },
    } as TProps);
}

export const useServices = <any>(
    serviceFunctionsByKey: ServiceFunctionsByKey
) => <TResult>(func: NextFunc<TProps, TResult>) => (props: TProps) =>
    withServices(func, serviceFunctionsByKey, props);
