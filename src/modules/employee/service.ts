import { BadRequestError, InternalServerError, NotFoundError } from '../../lib/core';
import { MODEL } from './constants';
export const findOneEmployee = async ({
    services,
    args,
}: {
    services: any;
    args: any;
}): Promise<any> => {
    const { db } = services;
    
    const [error, employee]: any = await db.findOne(MODEL, {
    _id:args.id,
    });
    if (error) {
        throw new InternalServerError('Failed to fetch salesforce configuration', {
            cause: 'body-failure',
            key: 'backend.salesforce.service.findOne',
        });
    }

    return {
        employee,
    };
 
};
export const findManyEmployee = async ({
    services,
    args,
}: {
    services: any;
    args: any;
}): Promise<any> => {
        
    const { db } = services;
    
    const [error, employee]: any = await db.findMany(MODEL);
    if (error) {
        throw new InternalServerError('Failed to fetch salesforce configuration', {
            cause: 'body-failure',
            key: 'backend.salesforce.service.findOne',
        });
    }

    return {
        employee,
    };
    
};

export const createEmployee = async ({
    services,
    args,
}: {
    services: any;
    args: any;
}): Promise<any> => {
    const { db } = services;
    const { employee } = await findOneEmployee({services, args: {email: args.email}})
    if(employee){
        throw new BadRequestError(`Employee with mail ${args.email} already exist.`, {
            cause: 'insert-error',
            key: 'backend.employee.service.create',
        });
    }
   const employeeData = {
    email: args.email,
    name: args.name,
    position: args.position
   };
    const [err, record]: any= await db.insertOne(MODEL, employeeData);
    if (err) {
        throw new InternalServerError('Failed to create employee.', {
            cause: 'insert-error',
            key: 'backend.employee.service.create',
        });
    }

    return record;
};

export const updateEmployee = 
async ({
    services,
    args,
}: {
    services: any;
    args: any;
}): Promise<any> => {

    const { db } = services;
      const { employee } = await findOneEmployee({services,args: {id: args.id}})
    if(!employee){
        throw new NotFoundError(`Employee not found.`, {
            cause: 'insert-error',
            key: 'backend.employee.service.update',
        });
    }
   const employeeData = {
    email: args.email,
    name: args.name,
    position: args.position
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
    services: any;
    args: any;
}): Promise<any> => {
    const { db } = services;
      const { employee } = await findOneEmployee({services, args: {id: args.id}})
    if(!employee){
        throw new NotFoundError(`Employee not found.`, {
            cause: 'insert-error',
            key: 'backend.employee.service.delete',
        });
    }
     const [err] = await db.deleteOne(MODEL, { _id: args.id });
     if (err) {
        throw new InternalServerError('Failed to delete employee configuration', {
            cause: 'update-error',
            key: 'backend.employee.service.update',
        });
    }

};


export const useSalesforceService = () => ({
    salesforceSrv: {
        findOneEmployee,
        createEmployee,
        updateEmployee,
        deleteEmployee,
        findManyEmployee
    },
});
