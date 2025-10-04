import { employeeAdd } from '../../modules/employee/endpoint/add';
import { employeeDelete } from '../../modules/employee/endpoint/delete';
import { employeeEdit } from '../../modules/employee/endpoint/edit';
import { employeeGet } from '../../modules/employee/endpoint/getAll';
import { Services } from '../../modules/employee/types';

// Mock the service functions
jest.mock('../../modules/employee/service', () => ({
  createEmployee: jest.fn(),
  deleteEmployee: jest.fn(),
  updateEmployee: jest.fn(),
  findManyEmployee: jest.fn(),
}));

// Mock the core services
jest.mock('../../core/index', () => ({
  useCoreServices: jest.fn(() => ({
    db: {
      findOne: jest.fn(),
      findMany: jest.fn(),
      insertOne: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
    },
  })),
}));

// Mock the hooks
jest.mock('../../lib/hooks/index', () => ({
  useKoa: jest.fn(() => (fn: any) => fn),
  useServices: jest.fn(() => (fn: any) => fn),
  useJsonBody: jest.fn(() => (fn: any) => fn),
  usePathParams: jest.fn(() => (fn: any) => fn),
}));

describe('Employee Endpoints', () => {
  const mockServices: Services = {
    db: {
      findOne: jest.fn(),
      findMany: jest.fn(),
      insertOne: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('employeeAdd', () => {
    it('should add employee successfully', async () => {
      const mockEmployee = {
        _id: '123',
        email: 'test@example.com',
        name: 'Test User',
        position: 'Developer',
      };

      const { createEmployee } = require('../../modules/employee/service');
      createEmployee.mockResolvedValue(mockEmployee);

      const result = await employeeAdd({
        services: mockServices,
        args: {
          email: 'test@example.com',
          name: 'Test User',
          position: 'Developer',
        },
      });

      expect(createEmployee).toHaveBeenCalledWith({
        services: mockServices,
        args: {
          email: 'test@example.com',
          name: 'Test User',
          position: 'Developer',
        },
      });

      expect(result).toEqual({
        data: mockEmployee,
        message: 'Employee Added successfully',
      });
    });

    it('should handle service errors', async () => {
      const { createEmployee } = require('../../modules/employee/service');
      const error = new Error('Service error');
      createEmployee.mockRejectedValue(error);

      await expect(
        employeeAdd({
          services: mockServices,
          args: {
            email: 'test@example.com',
            name: 'Test User',
            position: 'Developer',
          },
        })
      ).rejects.toThrow('Service error');
    });
  });

  describe('employeeDelete', () => {
    it('should delete employee successfully', async () => {
      const { deleteEmployee } = require('../../modules/employee/service');
      deleteEmployee.mockResolvedValue(undefined);

      const result = await employeeDelete({
        services: mockServices,
        args: { id: '123' },
      });

      expect(deleteEmployee).toHaveBeenCalledWith({
        services: mockServices,
        args: { id: '123' },
      });

      expect(result).toEqual({
        data: null,
        message: 'Employee deleted successfully.',
      });
    });

    it('should handle service errors', async () => {
      const { deleteEmployee } = require('../../modules/employee/service');
      const error = new Error('Service error');
      deleteEmployee.mockRejectedValue(error);

      await expect(
        employeeDelete({
          services: mockServices,
          args: { id: '123' },
        })
      ).rejects.toThrow('Service error');
    });
  });

  describe('employeeEdit', () => {
    it('should update employee successfully', async () => {
      const mockUpdatedEmployee = {
        _id: '123',
        email: 'updated@example.com',
        name: 'Updated User',
        position: 'Senior Developer',
      };

      const { updateEmployee } = require('../../modules/employee/service');
      updateEmployee.mockResolvedValue(mockUpdatedEmployee);

      const result = await employeeEdit({
        services: mockServices,
        args: {
          id: '123',
          email: 'updated@example.com',
          name: 'Updated User',
          position: 'Senior Developer',
        },
      });

      expect(updateEmployee).toHaveBeenCalledWith({
        services: mockServices,
        args: {
          id: '123',
          email: 'updated@example.com',
          name: 'Updated User',
          position: 'Senior Developer',
        },
      });

      expect(result).toEqual({
        data: mockUpdatedEmployee,
        message: 'Employee updated successfully',
      });
    });

    it('should handle service errors', async () => {
      const { updateEmployee } = require('../../modules/employee/service');
      const error = new Error('Service error');
      updateEmployee.mockRejectedValue(error);

      await expect(
        employeeEdit({
          services: mockServices,
          args: {
            id: '123',
            email: 'updated@example.com',
            name: 'Updated User',
            position: 'Senior Developer',
          },
        })
      ).rejects.toThrow('Service error');
    });
  });

  describe('employeeGet', () => {
    it('should get all employees successfully', async () => {
      const mockEmployees = {
        employee: [
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
        ],
      };

      const { findManyEmployee } = require('../../modules/employee/service');
      findManyEmployee.mockResolvedValue(mockEmployees);

      const result = await employeeGet({
        services: mockServices,
        args: {},
      });

      
      expect(findManyEmployee).toHaveBeenCalledWith({
        services: mockServices,
      });

      expect(result).toEqual({
        data: mockEmployees,
      });
    });

    it('should handle service errors', async () => {
      const { findManyEmployee } = require('../../modules/employee/service');
      const error = new Error('Service error');
      findManyEmployee.mockRejectedValue(error);

      await expect(
        employeeGet({
          services: mockServices,
          args: {},
        })
      ).rejects.toThrow('Service error');
    });
  });
});
