module.exports = {
  preset: 'ts-jest',

  testEnvironment: 'node',
  
  clearMocks: true,

  roots: ['<rootDir>/src'],

  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};