import { defaultResponse } from './response';

/**
 * @returns {import('./types').Props}
 */
export const props = () => ({
  auth: {},
  args: {},
  services: {},
  response: defaultResponse,
  framework: {}
}); 