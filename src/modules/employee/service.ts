import { BadRequestError, InternalServerError, NotFoundError } from '../../lib/core';
import { MODEL } from './constants';
import { Services, EmployeeArgs, Employee } from './types';

export const findOneEmployee = async ({
    services,
    args,
}: {
    services: Services;
    args: EmployeeArgs;
}): Promise<{ employee: Employee | null }> => {
    const { db } = services;
    
    const [error, employee] = await db.findOne(MODEL, {
        _id: args.id,
    });
    if (error) {
        throw new InternalServerError('Failed to fetch employee', {
            cause: 'body-failure',
            key: 'backend.employee.service.findOne',
        });
    }

    return {
        employee: employee as Employee | null,
    };
};

export const findManyEmployee = async ({
    services
}: {
    services: Services;
}): Promise<{ employee: Employee[] }> => {
    const { db } = services;
    
    const [error, employee] = await db.findMany(MODEL);
    if (error) {
        throw new InternalServerError('Failed to fetch employees', {
            cause: 'body-failure',
            key: 'backend.employee.service.findMany',
        });
    }

    return {
        employee: employee as Employee[],
    };
};

export const createEmployee = async ({
    services,
    args,
}: {
    services: Services;
    args: EmployeeArgs;
}): Promise<Employee> => {
    const { db } = services;
    const { employee } = await findOneEmployee({services, args: {email: args.email}});
    if(employee){
        throw new BadRequestError(`Employee with mail ${args.email} already exist.`, {
            cause: 'insert-error',
            key: 'backend.employee.service.create',
        });
    }
    const employeeData = {
        email: args.email!,
        name: args.name!,
        position: args.position!
    };
    const [err, record] = await db.insertOne(MODEL, employeeData);
    if (err) {
        throw new InternalServerError('Failed to create employee.', {
            cause: 'insert-error',
            key: 'backend.employee.service.create',
        });
    }

    return record as Employee;
};

export const updateEmployee = async ({
    services,
    args,
}: {
    services: Services;
    args: EmployeeArgs;
}): Promise<Employee> => {
    const { db } = services;
    const { employee } = await findOneEmployee({services, args: {id: args.id}});
    if(!employee){
        throw new NotFoundError(`Employee not found.`, {
            cause: 'insert-error',
            key: 'backend.employee.service.update',
        });
    }
    const employeeData = {
        email: args.email!,
        name: args.name!,
        position: args.position!
    };

    const [err] = await db.updateOne(MODEL, { _id: args.id }, { $set: employeeData });
    if (err) {
        throw new InternalServerError('Failed to update employee.', {
            cause: 'update-error',
            key: 'backend.employee.service.update',
        });
    }

    return { ...(employee), ...(employeeData) };
};

export const deleteEmployee = async ({
    services,
    args,
}: {
    services: Services;
    args: EmployeeArgs;
}): Promise<void> => {
    const { db } = services;
    const { employee } = await findOneEmployee({services, args: {id: args.id}});
    if(!employee){
        throw new NotFoundError(`Employee not found.`, {
            cause: 'insert-error',
            key: 'backend.employee.service.delete',
        });
    }
    const [err] = await db.deleteOne(MODEL, { _id: args.id });
    if (err) {
        throw new InternalServerError('Failed to delete employee', {
            cause: 'update-error',
            key: 'backend.employee.service.delete',
        });
    }
};

export const useEmployeeService = () => ({
    employeeSrv: {
        findOneEmployee,
        createEmployee,
        updateEmployee,
        deleteEmployee,
        findManyEmployee
    },
});
