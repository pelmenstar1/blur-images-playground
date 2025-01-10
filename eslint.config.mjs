// @ts-check

import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { FlatCompat } from '@eslint/eslintrc';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: eslint.configs.recommended,
  allConfig: eslint.configs.all,
});

export default tseslint.config(
  {
    ignores: ['node_modules', 'yarn', '.next'],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  ...compat.extends('next'),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      ecmaVersion: 2017,
      sourceType: 'module',

      parserOptions: {
        project: ['tsconfig.json', 'tsconfig.eslint.json'],
      },
    },
  },
  prettierRecommended,
);
