import { omit, pick } from 'radash';

export const chain = (funcs:any = []) => ({

  init: (init:any) => {
    return chain([...funcs, init]);
  },

  root: (root:any) => {
    return chain([...funcs, root]);
  },

  hook: (hook:any) => {
    return omit(
      chain([...funcs, hook]),
      ['init', 'root']
    );
  },

  endpoint: (handler:any) => {
    const endpoint = (...args:any) => {
      let result = handler;
      for (let i = funcs.length - 1; i >= 0; i--) {
        result = funcs[i](result);
      }
      return result(...args);
    };
    endpoint.hooks = funcs.map((f:any) => f.name);
    return endpoint;
  },

  raw: {
    init: [],
    args: {},
    services: {},
    auth: {},
    request: {},
    framework: {}
  }
});

export const lumo = () => pick(chain(), ['init', 'root']); 