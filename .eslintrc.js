module.exports = {
  extends: [
    'next/core-web-vitals',
    'next/typescript',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: ['tsconfig.json', 'tsconfig.eslint.json'],
    tsconfigRootDir: __dirname,
  },
};
