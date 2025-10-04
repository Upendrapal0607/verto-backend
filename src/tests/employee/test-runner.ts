#!/usr/bin/env ts-node

/**
 * Employee Module Test Runner
 * 
 * This script provides a simple way to run employee module tests
 * with proper setup and configuration.
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const TEST_DIR = __dirname;
const PROJECT_ROOT = join(__dirname, '../../../..');

console.log('🧪 Employee Module Test Runner');
console.log('================================');

// Check if we're in the right directory
if (!existsSync(join(PROJECT_ROOT, 'package.json'))) {
  console.error('❌ Error: Not in project root directory');
  process.exit(1);
}

// Set environment variables
process.env.NODE_ENV = 'test';
process.env.TEST_MONGO_URI = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/verto-test';

console.log('📁 Test Directory:', TEST_DIR);
console.log('🏠 Project Root:', PROJECT_ROOT);
console.log('🗄️  Test Database:', process.env.TEST_MONGO_URI);

// Check if MongoDB is available
try {
  execSync('nc -z localhost 27017', { stdio: 'ignore' });
  console.log('✅ MongoDB connection available');
} catch (error) {
  console.log('⚠️  Warning: MongoDB might not be running on localhost:27017');
  console.log('   Make sure MongoDB is started before running tests');
}

// Run the tests
console.log('\n🚀 Running Employee Module Tests...');
console.log('=====================================');

try {
  const testCommand = `cd "${PROJECT_ROOT}" && npm test -- --config="${join(TEST_DIR, 'jest.config.js')}" --coverage`;
  console.log('📝 Command:', testCommand);
  
  execSync(testCommand, { 
    stdio: 'inherit',
    cwd: PROJECT_ROOT 
  });
  
  console.log('\n✅ All employee tests completed successfully!');
  console.log('📈 Coverage report available in coverage/employee/');
  
} catch (error) {
  console.error('\n❌ Tests failed!');
  console.error('Check the output above for details.');
  process.exit(1);
}

console.log('\n🎉 Employee module testing complete!');
