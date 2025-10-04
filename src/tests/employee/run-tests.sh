#!/bin/bash

# Employee Module Test Runner
# This script runs all employee module tests with proper setup

echo "🧪 Running Employee Module Tests..."

# Set test environment variables
export NODE_ENV=test
export TEST_MONGO_URI=${TEST_MONGO_URI:-"mongodb://localhost:27017/verto-test"}

# Check if MongoDB is running
if ! nc -z localhost 27017 2>/dev/null; then
    echo "⚠️  Warning: MongoDB might not be running on localhost:27017"
    echo "   Make sure MongoDB is started before running tests"
fi

# Run tests with coverage
echo "📊 Running tests with coverage..."
npm test -- --config=src/tests/employee/jest.config.js --coverage

# Check test results
if [ $? -eq 0 ]; then
    echo "✅ All employee tests passed!"
else
    echo "❌ Some tests failed. Check the output above."
    exit 1
fi

echo "📈 Coverage report generated in coverage/employee/"
echo "🎉 Employee module testing complete!"
