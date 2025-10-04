// import { BadRequestError, InternalServerError, NotFoundError } from '../../../lib/core/error';
import { BadRequestError, InternalServerError, NotFoundError } from '../../lib/core/index';
import {
  findOneEmployee,
  findManyEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../../modules/employee/service';
import { Services, EmployeeArgs, Employee } from '../../modules/employee/types';

// Mock database service
const mockDb = {
  findOne: jest.fn(),
  findMany: jest.fn(),
  insertOne: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
};

const mockServices: Services = {
  db: mockDb,
};

describe('Employee Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findOneEmployee', () => {
    it('should return employee when found', async () => {
      const mockEmployee: Employee = {
        _id: '123',
        email: 'test@example.com',
        name: 'Test User',
        position: 'Developer',
      };

      mockDb.findOne.mockResolvedValue([null, mockEmployee]);

      const result = await findOneEmployee({
        services: mockServices,
        args: { id: '123' },
      });

      expect(mockDb.findOne).toHaveBeenCalledWith('Employee', { _id: '123' });
      expect(result).toEqual({ employee: mockEmployee });
    });

    it('should return null when employee not found', async () => {
      mockDb.findOne.mockResolvedValue([null, null]);

      const result = await findOneEmployee({
        services: mockServices,
        args: { id: '123' },
      });

      expect(result).toEqual({ employee: null });
    });

    it('should throw InternalServerError when database error occurs', async () => {
      const dbError = new Error('Database connection failed');
      mockDb.findOne.mockResolvedValue([dbError, null]);

      await expect(
        findOneEmployee({
          services: mockServices,
          args: { id: '123' },
        })
      ).rejects.toThrow(InternalServerError);
    });
  });

  describe('findManyEmployee', () => {
    it('should return array of employees', async () => {
      const mockEmployees: Employee[] = [
        {
          _id: '123',
          email: 'test1@example.com',
          name: 'Test User 1',
          position: 'Developer',
        },
        {
          _id: '456',
          email: 'test2@example.com',
          name: 'Test User 2',
          position: 'Designer',
        },
      ];

      mockDb.findMany.mockResolvedValue([null, mockEmployees]);

      const result = await findManyEmployee({
        services: mockServices,
      });

      expect(mockDb.findMany).toHaveBeenCalledWith('Employee');
      expect(result).toEqual({ employee: mockEmployees });
    });

    it('should throw InternalServerError when database error occurs', async () => {
      const dbError = new Error('Database connection failed');
      mockDb.findMany.mockResolvedValue([dbError, null]);

      await expect(
        findManyEmployee({
          services: mockServices,
        })
      ).rejects.toThrow(InternalServerError);
    });
  });

  describe('createEmployee', () => {
    it('should create employee successfully', async () => {
      const employeeData: EmployeeArgs = {
        email: 'new@example.com',
        name: 'New User',
        position: 'Manager',
      };

      const createdEmployee: Employee = {
        _id: '789',
        ...employeeData,
      } as Employee;

      // Mock findOneEmployee to return null (no existing employee)
      jest.spyOn(require('../../modules/employee/service'), 'findOneEmployee').mockResolvedValue({
        employee: null,
      });

      mockDb.insertOne.mockResolvedValue([null, createdEmployee]);

      const result = await createEmployee({
        services: mockServices,
        args: employeeData,
      });

      expect(mockDb.insertOne).toHaveBeenCalledWith('Employee', employeeData);
      expect(result).toEqual(createdEmployee);
    });

    it('should throw BadRequestError when employee already exists', async () => {
      const employeeData: EmployeeArgs = {
        email: 'existing@example.com',
        name: 'Existing User',
        position: 'Developer',
      };

      const existingEmployee: Employee = {
        _id: '123',
        email: 'existing@example.com',
        name: 'Existing User',
        position: 'Developer',
      };

      // Mock findOneEmployee to return existing employee
      jest.spyOn(require('../../modules/employee/service'), 'findOneEmployee').mockResolvedValue({
        employee: existingEmployee,
      });

      await expect(
        createEmployee({
          services: mockServices,
          args: employeeData,
        })
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw InternalServerError when database insert fails', async () => {
      const employeeData: EmployeeArgs = {
        email: 'new@example.com',
        name: 'New User',
        position: 'Manager',
      };

      // Mock findOneEmployee to return null
      jest.spyOn(require('../../modules/employee/service'), 'findOneEmployee').mockResolvedValue({
        employee: null,
      });

      const dbError = new Error('Insert failed');
      mockDb.insertOne.mockResolvedValue([dbError, null]);

      await expect(
        createEmployee({
          services: mockServices,
          args: employeeData,
        })
      ).rejects.toThrow(InternalServerError);
    });
  });

  describe('updateEmployee', () => {
    it('should update employee successfully', async () => {
      const existingEmployee: Employee = {
        _id: '123',
        email: 'old@example.com',
        name: 'Old Name',
        position: 'Old Position',
      };

      const updateData: EmployeeArgs = {
        id: '123',
        email: 'new@example.com',
        name: 'New Name',
        position: 'New Position',
      };

      // Mock findOneEmployee to return existing employee
      jest.spyOn(require('../../modules/employee/service'), 'findOneEmployee').mockResolvedValue({
        employee: existingEmployee,
      });

      mockDb.updateOne.mockResolvedValue([null, true]);

      const result = await updateEmployee({
        services: mockServices,
        args: updateData,
      });

      expect(mockDb.updateOne).toHaveBeenCalledWith(
        'Employee',
        { _id: '123' },
        { $set: { email: 'new@example.com', name: 'New Name', position: 'New Position' } }
      );
      expect(result).toEqual({
        ...existingEmployee,
        email: 'new@example.com',
        name: 'New Name',
        position: 'New Position',
      });
    });

    it('should throw NotFoundError when employee not found', async () => {
      const updateData: EmployeeArgs = {
        id: '123',
        email: 'new@example.com',
        name: 'New Name',
        position: 'New Position',
      };

      // Mock findOneEmployee to return null
      jest.spyOn(require('../../modules/employee/service'), 'findOneEmployee').mockResolvedValue({
        employee: null,
      });

      await expect(
        updateEmployee({
          services: mockServices,
          args: updateData,
        })
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw InternalServerError when database update fails', async () => {
      const existingEmployee: Employee = {
        _id: '123',
        email: 'old@example.com',
        name: 'Old Name',
        position: 'Old Position',
      };

      const updateData: EmployeeArgs = {
        id: '123',
        email: 'new@example.com',
        name: 'New Name',
        position: 'New Position',
      };

      // Mock findOneEmployee to return existing employee
      jest.spyOn(require('../../modules/employee/service'), 'findOneEmployee').mockResolvedValue({
        employee: existingEmployee,
      });

      const dbError = new Error('Update failed');
      mockDb.updateOne.mockResolvedValue([dbError, false]);

      await expect(
        updateEmployee({
          services: mockServices,
          args: updateData,
        })
      ).rejects.toThrow(InternalServerError);
    });
  });

  describe('deleteEmployee', () => {
    it('should delete employee successfully', async () => {
      const existingEmployee: Employee = {
        _id: '123',
        email: 'test@example.com',
        name: 'Test User',
        position: 'Developer',
      };

      // Mock findOneEmployee to return existing employee
      jest.spyOn(require('../../modules/employee/service'), 'findOneEmployee').mockResolvedValue({
        employee: existingEmployee,
      });

      mockDb.deleteOne.mockResolvedValue([null, true]);

      await deleteEmployee({
        services: mockServices,
        args: { id: '123' },
      });

      expect(mockDb.deleteOne).toHaveBeenCalledWith('Employee', { _id: '123' });
    });

    it('should throw NotFoundError when employee not found', async () => {
      // Mock findOneEmployee to return null
      jest.spyOn(require('../../modules/employee/service'), 'findOneEmployee').mockResolvedValue({
        employee: null,
      });

      await expect(
        deleteEmployee({
          services: mockServices,
          args: { id: '123' },
        })
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw InternalServerError when database delete fails', async () => {
      const existingEmployee: Employee = {
        _id: '123',
        email: 'test@example.com',
        name: 'Test User',
        position: 'Developer',
      };

      // Mock findOneEmployee to return existing employee
      jest.spyOn(require('../../modules/employee/service'), 'findOneEmployee').mockResolvedValue({
        employee: existingEmployee,
      });

      const dbError = new Error('Delete failed');
      mockDb.deleteOne.mockResolvedValue([dbError, false]);

      await expect(
        deleteEmployee({
          services: mockServices,
          args: { id: '123' },
        })
      ).rejects.toThrow(InternalServerError);
    });
  });
});
