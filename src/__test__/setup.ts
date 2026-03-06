import mongoose from "mongoose";
import { MONGODB_URI } from "../config/index";

// Setup database connection for tests
beforeAll(async () => {
  // Use a test database URI
  const testDbUri = process.env.TEST_MONGODB_URI || MONGODB_URI.replace(/myevents-db$/, "test-myevents-db");
  
  try {
    await mongoose.connect(testDbUri);
    console.log("Connected to test database");
    
    // Clear all collections at the start of the test run
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
});

// Cleanup after all tests
afterAll(async () => {
  try {
    await mongoose.connection.close();
    console.log("Disconnected from test database");
  } catch (error) {
    console.error("Database disconnection error:", error);
  }
});

// No global beforeEach - let individual test suites manage their data
// Each test suite should use afterAll hooks to clean up created data
