import { MODEL, COLLECTION } from '../../modules/employee/constants';

describe('Employee Constants', () => {
  describe('MODEL constant', () => {
    it('should have correct value', () => {
      expect(MODEL).toBe('Employee');
    });

    it('should be a string', () => {
      expect(typeof MODEL).toBe('string');
    });

    it('should not be empty', () => {
      expect(MODEL.length).toBeGreaterThan(0);
    });
  });

  describe('COLLECTION constant', () => {
    it('should have correct value', () => {
      expect(COLLECTION).toBe('employee');
    });

    it('should be a string', () => {
      expect(typeof COLLECTION).toBe('string');
    });

    it('should not be empty', () => {
      expect(COLLECTION.length).toBeGreaterThan(0);
    });

    it('should be lowercase', () => {
      expect(COLLECTION).toBe(COLLECTION.toLowerCase());
    });
  });

  describe('Constants relationship', () => {
    it('should have consistent naming', () => {
      expect(MODEL.toLowerCase()).toBe('employee');
      expect(COLLECTION).toBe('employee');
    });

    it('should be different values', () => {
      expect(MODEL).not.toBe(COLLECTION);
    });

    it('should be related to employee domain', () => {
      expect(MODEL).toContain('Employee');
      expect(COLLECTION).toContain('employee');
    });
  });
});
