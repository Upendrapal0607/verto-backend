import { compose } from 'radash';
import { useCoreServices } from '../../../core/index';
import { useKoa, useServices } from '../../../lib/hooks/index';
import { findManyEmployee } from '../service';

export const employeeGet = async ({ services, args }:any):Promise<any> => {
      const employee = await findManyEmployee({ services, args });
     return {  data: employee };
};

export const endpoint = {
    handler: compose(
        useKoa(),
        useServices({
            ...useCoreServices(),
        }),
        employeeGet,
    ),
    config: {
        method: 'GET',
        path: '/employee/get',
    },
};
