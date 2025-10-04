module.exports = {
  displayName: 'Employee Tests',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/tests/employee/setup.ts'],
  testMatch: [
    '<rootDir>/src/tests/employee/**/*.test.ts'
  ],
  collectCoverageFrom: [
    'src/modules/employee/**/*.ts',
    '!src/modules/employee/**/*.d.ts',
    '!src/modules/employee/**/index.ts'
  ],
  coverageDirectory: 'coverage/employee',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testTimeout: 10000
};
