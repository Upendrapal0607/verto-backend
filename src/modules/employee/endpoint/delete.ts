import { compose } from 'radash';
import { useAuth, useCoreServices } from '../../../core/index';
import { useKoa, usePathParams, useServices } from '../../../lib/hooks/index';
import { deleteEmployee } from '../service';
export const pubCreate = async ({ services, args }:any):Promise<any> => {
      const employee = await deleteEmployee({ services, args });
     return { data: null, message : "Employee deleted successfully." };
};



export const endpoint = {
    handler: compose(
        useKoa(),
        useServices({
            ...useCoreServices(),

        }),
          usePathParams((z:any) => ({
                    id: z.string(),
                })),
        pubCreate,
    ),
    config: {
        method: 'DELETE',
        path: '/employee/delete/:id',
    },
};
