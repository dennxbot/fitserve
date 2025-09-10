module.exports = {
  testEnvironment: 'node',
  rootDir: '../',
  testMatch: [
    '<rootDir>/tests/**/*.test.js'
  ],
  collectCoverageFrom: [
    'backend/**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/jest.config.js'
  ],
  setupFilesAfterEnv: [],
  testTimeout: 30000,
  verbose: true,
  forceExit: true,
  detectOpenHandles: true
};