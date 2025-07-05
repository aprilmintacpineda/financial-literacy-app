// https://docs.expo.dev/guides/using-eslint/
const expoConfig = require('eslint-config-expo/flat');
const eslintConfigPrettier = require('eslint-config-prettier/flat');
const { defineConfig } = require('eslint/config');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  eslintConfigPrettier,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    rules: {
      'brace-style': ['error', '1tbs', { allowSingleLine: false }],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'no-return-await': 'error',
      'import/order': [
        'error',
        {
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      curly: ['error', 'multi-or-nest', 'consistent'],
      'linebreak-style': ['error', 'unix'],
      'no-duplicate-imports': [
        'error',
        {
          includeExports: true,
        },
      ],
      'rest-spread-spacing': ['error', 'never'],
      'no-inline-comments': [
        'error',
        {
          ignorePattern: '_prettier-hack',
        },
      ],
      'prefer-spread': ['error'],
      'prefer-const': 'error',
      'no-useless-call': ['error'],
      'no-trailing-spaces': ['error'],
      'space-before-blocks': ['error', 'always'],
      'no-floating-decimal': ['error'],
      'comma-dangle': ['error', 'always-multiline'],
      'array-bracket-spacing': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'switch-colon-spacing': [
        'error',
        {
          after: true,
          before: false,
        },
      ],
      'space-unary-ops': [
        'error',
        {
          words: true,
          nonwords: false,
        },
      ],
      'space-before-function-paren': [
        'error',
        {
          anonymous: 'always',
          named: 'always',
          asyncArrow: 'always',
        },
      ],
      'keyword-spacing': [
        'error',
        {
          before: true,
          after: true,
        },
      ],
      'space-in-parens': ['error', 'never'],
      'block-spacing': 'error',
      'key-spacing': [
        'error',
        {
          singleLine: {
            beforeColon: false,
            afterColon: true,
            mode: 'strict',
          },
          multiLine: {
            beforeColon: false,
            afterColon: true,
            mode: 'strict',
          },
        },
      ],
      'generator-star-spacing': [
        'error',
        {
          before: false,
          after: true,
        },
      ],
      eqeqeq: 'error',
      'no-empty': 'error',
    },
  },
]);
