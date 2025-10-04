import _ from 'lodash';
import { NotAuthorizedError } from '../../lib/core/error';

const withRoleAuth = async (func:any, props:any, opts:any) => {
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
    });
};

export const useRoleAuth = (opts:any) => (func:any) => (props:any) => {
    return withRoleAuth(func, props, opts);
};
