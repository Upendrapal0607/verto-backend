import { Employee, EmployeeArgs, Services, DatabaseService } from '../../modules/employee/types';

describe('Employee Types', () => {
  describe('Employee interface', () => {
    it('should have correct structure', () => {
      const employee: Employee = {
        _id: '123',
        email: 'test@example.com',
        name: 'Test User',
        position: 'Developer',
      };

      expect(employee._id).toBe('123');
      expect(employee.email).toBe('test@example.com');
      expect(employee.name).toBe('Test User');
      expect(employee.position).toBe('Developer');
    });

    it('should allow optional _id', () => {
      const employee: Employee = {
        email: 'test@example.com',
        name: 'Test User',
        position: 'Developer',
      };

      expect(employee.email).toBe('test@example.com');
      expect(employee.name).toBe('Test User');
      expect(employee.position).toBe('Developer');
    });
  });

  describe('EmployeeArgs interface', () => {
    it('should allow all optional fields', () => {
      const args: EmployeeArgs = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        position: 'Developer',
      };

      expect(args.id).toBe('123');
      expect(args.email).toBe('test@example.com');
      expect(args.name).toBe('Test User');
      expect(args.position).toBe('Developer');
    });

    it('should allow partial fields', () => {
      const args: EmployeeArgs = {
        email: 'test@example.com',
        name: 'Test User',
      };

      expect(args.email).toBe('test@example.com');
      expect(args.name).toBe('Test User');
      expect(args.id).toBeUndefined();
      expect(args.position).toBeUndefined();
    });
  });

  describe('DatabaseService interface', () => {
    it('should have correct method signatures', () => {
      const mockDb: DatabaseService = {
        findOne: jest.fn().mockResolvedValue([null, null]),
        findMany: jest.fn().mockResolvedValue([null, []]),
        insertOne: jest.fn().mockResolvedValue([null, null]),
        updateOne: jest.fn().mockResolvedValue([null, true]),
        deleteOne: jest.fn().mockResolvedValue([null, true]),
      };

      expect(typeof mockDb.findOne).toBe('function');
      expect(typeof mockDb.findMany).toBe('function');
      expect(typeof mockDb.insertOne).toBe('function');
      expect(typeof mockDb.updateOne).toBe('function');
      expect(typeof mockDb.deleteOne).toBe('function');
    });

    it('should return correct types for findOne', async () => {
      const mockDb: DatabaseService = {
        findOne: jest.fn().mockResolvedValue([null, { _id: '123' }]),
        findMany: jest.fn(),
        insertOne: jest.fn(),
        updateOne: jest.fn(),
        deleteOne: jest.fn(),
      };

      const [error, result] = await mockDb.findOne('Employee', { _id: '123' });
      
      expect(error).toBeNull();
      expect(result).toEqual({ _id: '123' });
    });

    it('should return correct types for findMany', async () => {
      const mockDb: DatabaseService = {
        findOne: jest.fn(),
        findMany: jest.fn().mockResolvedValue([null, [{ _id: '123' }, { _id: '456' }]]),
        insertOne: jest.fn(),
        updateOne: jest.fn(),
        deleteOne: jest.fn(),
      };

      const [error, result] = await mockDb.findMany('Employee');
      
      expect(error).toBeNull();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
    });

    it('should return correct types for insertOne', async () => {
      const mockDb: DatabaseService = {
        findOne: jest.fn(),
        findMany: jest.fn(),
        insertOne: jest.fn().mockResolvedValue([null, { _id: '123' }]),
        updateOne: jest.fn(),
        deleteOne: jest.fn(),
      };

      const [error, result] = await mockDb.insertOne('Employee', { name: 'Test' });
      
      expect(error).toBeNull();
      expect(result).toEqual({ _id: '123' });
    });

    it('should return correct types for updateOne', async () => {
      const mockDb: DatabaseService = {
        findOne: jest.fn(),
        findMany: jest.fn(),
        insertOne: jest.fn(),
        updateOne: jest.fn().mockResolvedValue([null, true]),
        deleteOne: jest.fn(),
      };

      const [error, result] = await mockDb.updateOne('Employee', { _id: '123' }, { name: 'Updated' });
      
      expect(error).toBeNull();
      expect(result).toBe(true);
    });

    it('should return correct types for deleteOne', async () => {
      const mockDb: DatabaseService = {
        findOne: jest.fn(),
        findMany: jest.fn(),
        insertOne: jest.fn(),
        updateOne: jest.fn(),
        deleteOne: jest.fn().mockResolvedValue([null, true]),
      };

      const [error, result] = await mockDb.deleteOne('Employee', { _id: '123' });
      
      expect(error).toBeNull();
      expect(result).toBe(true);
    });
  });

  describe('Services interface', () => {
    it('should have correct structure', () => {
      const services: Services = {
        db: {
          findOne: jest.fn().mockResolvedValue([null, null]),
          findMany: jest.fn().mockResolvedValue([null, []]),
          insertOne: jest.fn().mockResolvedValue([null, null]),
          updateOne: jest.fn().mockResolvedValue([null, true]),
          deleteOne: jest.fn().mockResolvedValue([null, true]),
        },
      };

      expect(services.db).toBeDefined();
      expect(typeof services.db.findOne).toBe('function');
      expect(typeof services.db.findMany).toBe('function');
      expect(typeof services.db.insertOne).toBe('function');
      expect(typeof services.db.updateOne).toBe('function');
      expect(typeof services.db.deleteOne).toBe('function');
    });
  });
});
