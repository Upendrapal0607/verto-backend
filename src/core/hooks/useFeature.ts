import _ from 'lodash';
import { NotAuthorizedError } from '../../lib/core/error';
import { Props, NextFunc } from '../../lib/core/types';

interface Organization {
    [key: string]: unknown;
}

interface FeatureOptions {
    features?: Array<(org: Organization, props: Props) => boolean | Promise<boolean>>;
}

interface FeatureProps extends Props {
    args: {
        org: Organization;
        [key: string]: unknown;
    };
}

const withFeatureCheck = async <TProps extends FeatureProps, TResult>(
    func: NextFunc<TProps, TResult>, 
    props: TProps, 
    opts: FeatureOptions
): Promise<TResult> => {
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
    } as TProps);
};

export const useFeature = <TProps extends FeatureProps = FeatureProps>(opts: FeatureOptions) => 
    <TResult>(func: NextFunc<TProps, TResult>) => (props: TProps) => {
        return withFeatureCheck(func, props, opts);
    };
