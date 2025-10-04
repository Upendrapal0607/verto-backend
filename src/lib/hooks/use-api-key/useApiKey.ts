import { isFunction, tryit } from 'radash';
import { hook, NotAuthenticatedError } from '../../core/index';
import { Props, NextFunc } from '../../core/types';

type ApiKeyFunction<TProps extends Props = Props> = (props: TProps) => string | Promise<string>;
type ApiKeyValue = string | ApiKeyFunction;

export const useApiKey = <TProps extends Props = Props>(keyOrFunc: ApiKeyValue) =>
    hook(function useApiKey<TResult>(func: NextFunc<TProps, TResult>) {
        return async (props: TProps): Promise<TResult> => {
            const header = props.request.headers['x-api-key'];
            if (!header) {
                throw new NotAuthenticatedError('This function requires an api key', {
                    key: 'lumo.api-key.missing-header',
                });
            }

            // If a `Key ` prefix exists, remove it
            const providedKey = header.replace(/^[Kk]ey\s/, '');
            if (!providedKey) {
                throw new NotAuthenticatedError('Invalid api key', {
                    key: 'lumo.api-key.missing-key',
                });
            }

            const [err, key] = await tryit(async () => {
                return isFunction(keyOrFunc) ? await keyOrFunc(props) : keyOrFunc;
            })();

            if (err) {
                throw new NotAuthenticatedError('Server cannot authenticate', {
                    key: 'lumo.api-key.key-error',
                });
            }

            if (!key) {
                throw new NotAuthenticatedError('Server cannot authenticate', {
                    key: 'lumo.api-key.key-not-found',
                });
            }

            if (providedKey !== key) {
                throw new NotAuthenticatedError('Invalid api key', {
                    key: 'lumo.api-key.mismatch',
                });
            }

            return await func({
                ...props,
                auth: {
                    ...props.auth,
                    apiKey: providedKey,
                },
            } as TProps);
        };
    });
