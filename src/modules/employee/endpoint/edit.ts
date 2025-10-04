import { compose } from 'radash';
import { useAuth, useCoreServices } from '../../../core/index';
import { useJsonBody, useKoa, usePathParams, useQueryString, useServices } from '../../../lib/hooks/index';
import { updateEmployee } from '../service';

export const employeeEdit = async ({ services, args }:any):Promise<any> => {
      const employee = await updateEmployee({ services, args });
     return { data: employee, message: "Employee updated successfully" };
};

const createEmployee = (z:any) => {
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
        // useAuth(),
          usePathParams((z:any) => ({
            id: z.string(),
        })),
        useJsonBody(createEmployee),
        employeeEdit,
    ),
    config: {
        method: 'PATCH',
        path: '/employee/edit/:id',
    },
};
