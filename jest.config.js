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

    'typesafe-i18n/angular': 'typesafe-i18n/angular/index.cjs',
    'typesafe-i18n/react': 'typesafe-i18n/react/index.cjs',
    'typesafe-i18n/solid': 'typesafe-i18n/solid/index.cjs',
    'typesafe-i18n/svelte': 'typesafe-i18n/svelte/index.cjs',
    'typesafe-i18n/vue': 'typesafe-i18n/vue/index.cjs',
    'typesafe-i18n/formatters': 'typesafe-i18n/formatters/index.cjs',
    'typesafe-i18n/detectors': 'typesafe-i18n/detectors/index.cjs',
  },
  transformIgnorePatterns: ['node_modules/(?!swiper|ssr-window|dom7)'],
};
