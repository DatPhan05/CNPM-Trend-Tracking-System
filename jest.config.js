module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: false,
  restoreMocks: false,
  // Provide required environment variables for the test environment
  testEnvironmentOptions: {},
  setupFiles: ["<rootDir>/jest.setup.js"],
};
