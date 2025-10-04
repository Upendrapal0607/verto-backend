import mongoose from 'mongoose';

// Test database setup
const TEST_DB_URI = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/verto-test';

beforeAll(async () => {
  // Connect to test database
  await mongoose.connect(TEST_DB_URI);
});

afterAll(async () => {
  // Clean up and close connection
  await mongoose.connection.db?.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  // Clear all collections before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Mock console methods to reduce noise in tests
const originalConsole = { ...console };

beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
});
