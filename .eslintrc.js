module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['airbnb-typescript', 'prettier', 'plugin:prettier/recommended'],

  rules: {
    'no-underscore-dangle': ['off'],
    'no-restricted-syntax': ['off'],
    'import/extensions': ['off'],
    'react/prop-types': ['off'],
    'import/prefer-default-export': ['off'],
    '@typescript-eslint/dot-notation': ['off'],
    '@typescript-eslint/no-implied-eval': ['off'],
    '@typescript-eslint/no-throw-literal': ['off'],
    '@typescript-eslint/return-await': ['off'],

    '@typescript-eslint/no-unused-vars': ['warn'],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
};
