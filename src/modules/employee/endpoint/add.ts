import { compose } from 'radash';
import { useAuth, useCoreServices } from '../../../core/index';
import { useJsonBody, useKoa, useServices } from '../../../lib/hooks/index';
import { createEmployee } from '../service';

export const employeeAdd = async ({ services, args }:any):Promise<any> => {
      const employee = await createEmployee({ services, args });
     return { data: employee, message: "Employee Added successfully" };
};

const createEmployeeSchema = (z:any) => {
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
        useJsonBody(createEmployeeSchema),
        employeeAdd,
    ),
    config: {
        method: 'POST',
        path: '/employee/add',
    },
};
