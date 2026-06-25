import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier/flat';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
});

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'eslint.config.js']),
  ...compat.extends('airbnb'),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/dot-notation': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-use-before-define': [
        'error',
        { functions: false, classes: true, variables: true, typedefs: true },
      ],
      'arrow-body-style': ['error', 'as-needed'],
      camelcase: ['error', { properties: 'never', ignoreDestructuring: false }],
      'consistent-return': 'off',
      curly: ['error', 'multi-line'],
      eqeqeq: ['error', 'always'],
      'no-alert': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-void': 'off',
      'no-else-return': 'error',
      'no-multi-assign': 'error',
      'no-nested-ternary': 'error',
      'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['state'] }],
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message: 'Gunakan Object.keys/Object.entries agar iterasi eksplisit.',
        },
        {
          selector: 'LabeledStatement',
          message: 'Label membuat flow sulit dibaca; ekstrak ke fungsi eksplisit.',
        },
        {
          selector: 'WithStatement',
          message: 'with tidak aman dan membuat scope ambigu.',
        },
      ],
      'no-shadow': 'off',
      'no-underscore-dangle': ['error', { allow: ['__dirname'] }],
      'no-unneeded-ternary': 'error',
      'no-use-before-define': 'off',
      'import/extensions': 'off',
      'import/no-unresolved': 'off',
      'import/prefer-default-export': 'off',
      'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
      'react/jsx-no-bind': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 'off',
      'object-shorthand': ['error', 'always'],
      'one-var': ['error', 'never'],
      'operator-assignment': ['error', 'always'],
      'prefer-const': 'error',
      'prefer-destructuring': ['error', { array: false, object: true }],
      'prefer-template': 'error',
    },
  },
  {
    files: [
      '**/*.{test,spec}.{ts,tsx}',
      '**/*.integration.test.{ts,tsx}',
      'src/test/**/*.{ts,tsx}',
    ],
    rules: {
      'import/no-extraneous-dependencies': 'off',
      'no-script-url': 'off',
    },
  },
  prettierConfig,
]);
