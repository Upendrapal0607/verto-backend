import { compose } from 'radash';
import { useCoreServices } from '../../../core/index';
import { useKoa, useServices } from '../../../lib/hooks/index';
import { findManyEmployee } from '../service';
import { Services } from '../types';

interface EmployeeGetResponse {
    data: {
        employee: unknown[];
    };
}

export const employeeGet = async ({ services }: {
    services: Services;
    args: unknown;
}): Promise<EmployeeGetResponse> => {
    const employee = await findManyEmployee({ services });
    return { data: employee };
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
