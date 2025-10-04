import { InternalServerError, NotAuthorizedError } from "../../lib/core/error";
const withClientAuth = async (func:any, props:any) => {
    const services = props.services;
    const { db } = services;
    const userId = props.request.headers['x-user-id'];

    const [err, user] = await db.findById('User', userId);
    if (!user) {
        throw new NotAuthorizedError('User not authorized', {
            cause: 'db-cache-failure',
            key: 'backend.auth.user-not-authorized',
        });
    }
    if (err) {
        throw new InternalServerError('Failed to fetch user info', {
            cause: 'db-cache-failure',
            key: 'backend.auth.user-error',
        });
    }

    return await func({
        ...props,
        args: {
            ...props.args,
            user
        },
    });
};

export const useAuth = () => (func:any) => (props:any) => {
    return withClientAuth(func, props);
};
