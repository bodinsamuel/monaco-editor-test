module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'airbnb-typescript',
    'prettier',
  ],

  rules: {
    'import/extensions': ['off'],
    'react/prop-types': ['off'],
    "import/prefer-default-export": ['off'],
    "@typescript-eslint/dot-notation": ['off'],
    "@typescript-eslint/no-implied-eval": ['off'],
    "@typescript-eslint/no-throw-literal": ['off'],
    "@typescript-eslint/return-await": ["off"]
  }
};
