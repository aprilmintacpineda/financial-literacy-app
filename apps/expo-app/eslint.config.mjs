// https://docs.expo.dev/guides/using-eslint/
import js from '@eslint/js';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  importPlugin.flatConfigs.typescript,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/jsonc',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.md'],
    plugins: { markdown },
    language: 'markdown/gfm',
    extends: ['markdown/recommended'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { tseslint },
    extends: ['tseslint/recommended'],
  },
  eslintConfigPrettier,
  tseslint.config({
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          fixStyle: 'inline-type-imports',
          prefer: 'type-imports',
        },
      ],
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  }),
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,mts,cts}'],
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
