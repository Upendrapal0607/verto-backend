import _ from 'lodash';
import { NotAuthorizedError } from '../../lib/core/error';
import { Props, NextFunc } from '../../lib/core/types';

interface User {
    type: string;
    [key: string]: unknown;
}

interface RoleAuthOptions {
    allowed?: string[];
    roles?: Array<(user: User) => boolean>;
}

interface RoleAuthProps extends Props {
    args: {
        user: User;
        [key: string]: unknown;
    };
}

const withRoleAuth = async <TProps extends RoleAuthProps, TResult>(
    func: NextFunc<TProps, TResult>, 
    props: TProps, 
    opts: RoleAuthOptions
): Promise<TResult> => {
    const { user } = props.args;
    const allowed = opts.allowed || [];

    if (_.size(allowed) > 0 && !_.includes(allowed, user.type)) {
        throw new NotAuthorizedError('You are not authorized to access this resource', {
            cause: 'allowed-type-auth',
            key: 'backend.auth.allowed-type-auth-error',
        });
    }

    const roles = opts.roles || [];
    if (_.size(roles) > 0) {
        for (const role of roles) {
            if (typeof role === 'function' && !role(user)) {
                throw new NotAuthorizedError('You are not authorized to access this resource', {
                    cause: 'role-auth',
                    key: 'backend.auth.role-auth-error',
                });
            }
        }
    }

    return await func({
        ...props,
        args: {
            ...props.args,
        },
    } as TProps);
};

export const useRoleAuth = <TProps extends RoleAuthProps = RoleAuthProps>(opts: RoleAuthOptions) => 
    <TResult>(func: NextFunc<TProps, TResult>) => (props: TProps) => {
        return withRoleAuth(func, props, opts);
    };
