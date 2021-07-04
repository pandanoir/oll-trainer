module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
    'prettier/react',
  ],
  env: {
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    project: './tsconfig.json',
  },
  rules: {
    'react/prop-types': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-empty': ['error', { allowEmptyCatch: true }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};
