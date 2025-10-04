// @ts-nocheck
import { compose } from 'radash';
import { useCoreServices } from '../../../core/index';
import { useJsonBody, useKoa, usePathParams, useQueryString, useServices } from '../../../lib/hooks/index';
import { updateEmployee } from '../service';
import { Services } from '../types';

interface EmployeeEditResponse {
    data: unknown;
    message: string;
}

export const employeeEdit = async ({ services, args }: {
    services: Services;
    args: {
        id: string;
        email: string;
        name: string;
        position?: string;
    };
}): Promise<EmployeeEditResponse> => {
    const employee = await updateEmployee({ services, args });
    return { data: employee, message: "Employee updated successfully" };
};

const createEmployeeSchema = (z: typeof import('zod').z) => {
    return {
        email: z.string().email({ message: 'Invalid email address' }),
        name: z.string().min(1, { message: 'Name is required' }),
        position: z.string().optional(),
    };
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
        useJsonBody(createEmployeeSchema),
        employeeEdit,
    ),
    config: {
        method: 'PATCH',
        path: '/employee/edit/:id',
    },
};
