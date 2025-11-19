module.exports = {
  preset: 'ts-jest',

  testEnvironment: 'node',
  
  clearMocks: true,

  roots: ['<rootDir>/src', '<rootDir>/tests'],

  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};