module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.ts?(x)'],
  setupFiles: ['./jest.setup.ts'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    'swiper/react': 'swiper/react/swiper-react.js',
  },
  transformIgnorePatterns: ['node_modules/(?!swiper|ssr-window|dom7)'],
};
