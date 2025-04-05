module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  collectCoverage: true,
  coverageReporters: ['text', 'html', 'lcov'],
  coverageDirectory: '<rootDir>/coverage/',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
};