module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.ts?(x)'],
  setupFiles: ['./jest.setup.ts'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
};
