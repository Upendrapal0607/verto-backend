import { InternalServerError, NotAuthorizedError } from "../../lib/core/error";
import { Props, NextFunc } from "../../lib/core/types";

interface DatabaseService {
    findById: (model: string, id: string) => Promise<[Error | null, unknown]>;
}

interface Services {
    db: DatabaseService;
}

interface AuthProps extends Props {
    services: Services;
}

const withClientAuth = async <TProps extends AuthProps, TResult>(
    func: NextFunc<TProps, TResult>, 
    props: TProps
): Promise<TResult> => {
    const services = props.services;
    const { db } = services;
    const userId = props.request.headers['x-user-id'] as string;

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
    } as TProps);
};

export const useAuth = <TProps extends AuthProps = AuthProps>() => 
    <TResult>(func: NextFunc<TProps, TResult>) => (props: TProps) => {
        return withClientAuth(func, props);
    };
