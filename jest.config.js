/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testRegex: '^.+Spec\\.ts$',
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
  },
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
};
