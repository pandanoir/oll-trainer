module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.ts?(x)', '!**/*.guard.ts', '!**/*.d.ts'],
  setupFiles: ['./jest.setup.ts'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    'swiper/react': 'swiper/react/swiper-react.js',
    '\\.?worker': '<rootDir>/src/worker/recordWorker.ts',
  },
  transformIgnorePatterns: ['node_modules/(?!swiper|ssr-window|dom7)'],
};
