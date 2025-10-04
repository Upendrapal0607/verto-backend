// TODO -> Update types and refactor. If not being used remove this file.
import { isFunction, tryit } from 'radash';
import { hook, NotAuthenticatedError } from '../../core/index';
// import { hook, NotAuthenticatedError } from '../../core/index';

/**
 * @typedef {import('../core/index').Props} Props
 */

/**
 * @typedef {Object} ApiKeyAuth
 * @property {string} apiKey
 */
export {};

/**
 * @param {string | ((props: Props) => Promise<string>)} keyOrFunc
 * @returns {(func: (props: Props & { auth: ApiKeyAuth }) => Promise<any>) => (props: Props) => Promise<any>}
 */
export const useApiKey = (keyOrFunc:any) =>
    hook(function useApiKey(func:any) {
        return async (props:any) => {
            // @ts-ignore
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
                // @ts-ignore
                ...props,
                auth: {
                    // @ts-ignore
                    ...props.auth,
                    apiKey: providedKey,
                },
            });
        };
    });
