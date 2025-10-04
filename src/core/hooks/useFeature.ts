import _ from 'lodash';
import { NotAuthorizedError } from '../../lib/core/error';

const withFeatureCheck = async (func:any, props:any, opts:any) => {
    const { org } = props.args;
    const features = opts.features || [];

    if (_.size(features) > 0) {
        for (const feature of features) {
            if (typeof feature === 'function') {
                const isEnabled = await feature(org, props);
                if (!isEnabled) {
                    throw new NotAuthorizedError('Feature is not enabled for this organization', {
                        cause: 'feature-not-enabled',
                        key: 'backend.auth.feature-not-enabled',
                    });
                }
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

export const useFeature = (opts:any) => (func:any) => (props:any) => {
    return withFeatureCheck(func, props, opts);
};
