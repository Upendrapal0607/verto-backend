export interface DatabaseService {
    findOne: (model: string, query: Record<string, unknown>) => Promise<[Error | null, unknown]>;
    findMany: (model: string, query?: Record<string, unknown>, opts?: Record<string, unknown>) => Promise<[Error | null, unknown[]]>;
    insertOne: (model: string, record: Record<string, unknown>) => Promise<[Error | null, unknown]>;
    updateOne: (model: string, query: Record<string, unknown>, updateData: Record<string, unknown>) => Promise<[Error | null, boolean]>;
    deleteOne: (model: string, query: Record<string, unknown>) => Promise<[Error | null, boolean]>;
}

export interface Services {
    db: DatabaseService;
}

export interface EmployeeArgs {
    id?: string | undefined;
    email?: string | undefined;
    name?: string | undefined;
    position?: string | undefined;
}

export interface Employee {
    _id?: string;
    email: string;
    name: string;
    position: string;
}
