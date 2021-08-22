module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  env: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
  },
  overrides: [
    {
      files: ['*.ts'],
      extends: [
        'eslint:recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'prettier',
        'prettier/react',
      ],
      plugins: ['formatjs'],
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
        'import/order': [
          'error',
          {
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
          },
        ],
        'formatjs/enforce-id': 'error',
      },
    },
  ],
};
