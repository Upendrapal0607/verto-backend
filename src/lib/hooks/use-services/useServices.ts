import { isFunction, objectify, parallel } from 'radash';

async function withServices(func:any, serviceFunctionsByKey:any, props:any) {
    // Get array of service functions (object - key is service name, value returned from service function)
    // If service func is a function, call it with props
    const serviceList = await parallel(10, Object.keys(serviceFunctionsByKey), async (key) => {
        const serviceOrFunction = serviceFunctionsByKey[key];
        return {
            key,
            value: await Promise.resolve(isFunction(serviceOrFunction) ? serviceOrFunction(props) : serviceOrFunction),
        };
    });

    // Create object of services (key is service name, value returned from service function)
    const services = objectify(
        serviceList,
        (s) => s.key,
        (s) => s.value,
    );

    return await func({
        ...props,
        services: {
            ...props.services,
            ...services,
        },
    });
}

export const useServices = (serviceFunctionsByKey:any) => (func:any) => (props:any) =>
    withServices(func, serviceFunctionsByKey, props);
