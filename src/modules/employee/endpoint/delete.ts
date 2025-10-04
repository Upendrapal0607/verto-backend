// @ts-nocheck
import { compose } from 'radash';
import { useCoreServices } from '../../../core/index';
import { useKoa, usePathParams, useServices } from '../../../lib/hooks/index';
import { deleteEmployee } from '../service';
import { Services } from '../types';
interface EmployeeDeleteResponse {
    data: null;
    message: string;
}

export const employeeDelete = async ({ services, args }: {
    services: Services;
    args: {
        id: string;
    };
}): Promise<EmployeeDeleteResponse> => {
    await deleteEmployee({ services, args });
    return { data: null, message: "Employee deleted successfully." };
};

export const endpoint = {
    handler: compose(
        useKoa(),
        useServices({
            ...useCoreServices(),
        }),
        usePathParams((z: typeof import('zod').z) => ({
            id: z.string(),
        })),
        employeeDelete,
    ),
    config: {
        method: 'DELETE',
        path: '/employee/delete/:id',
    },
};
