'use strict';

module.exports = {
  root: true,
  // Only use overrides
  // https://github.com/ember-cli/eslint-plugin-ember?tab=readme-ov-file#gtsgjs
  overrides: [
    {
      files: ['**/*.js', '**/*.ts'],
      env: { browser: true },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
      },
      plugins: ['ember', 'import'],
      extends: [
        'eslint:recommended',
        'plugin:ember/recommended',
        'plugin:prettier/recommended',
      ],
      rules: {
        // require relative imports use full extensions
        'import/extensions': ['error', 'always', { ignorePackages: true }],
        // Add any custom rules here
        '@typescript-eslint/no-explicit-any': 0,
      },
    },
    // ts files
    {
      files: ['**/*.ts'],
      extends: [
        'eslint:recommended',
        'plugin:ember/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
      ],
      rules: {
        // require relative imports use full extensions
        'import/extensions': ['error', 'always', { ignorePackages: true }],
        // Add any custom rules here
        '@typescript-eslint/no-explicit-any': 0,
      },
    },
    {
      files: ['**/*.gts'],
      parser: 'ember-eslint-parser',
      plugins: ['ember', 'import'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:ember/recommended',
        'plugin:ember/recommended-gts',
        'plugin:prettier/recommended',
      ],
      rules: {
        // require relative imports use full extensions
        'import/extensions': ['error', 'always', { ignorePackages: true }],
        // Add any custom rules here
      },
    },
    {
      files: ['**/*.gjs'],
      parser: 'ember-eslint-parser',
      plugins: ['ember', 'import'],
      extends: [
        'eslint:recommended',
        'plugin:ember/recommended',
        'plugin:ember/recommended-gjs',
        'plugin:prettier/recommended',
      ],
      rules: {
        // require relative imports use full extensions
        'import/extensions': ['error', 'always', { ignorePackages: true }],
        // Add any custom rules here
      },
    },
    // node files
    {
      files: [
        './.eslintrc.cjs',
        './.prettierrc.cjs',
        './.template-lintrc.cjs',
        './addon-main.cjs',
      ],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true,
      },
      plugins: ['n'],
      extends: [
        'eslint:recommended',
        'plugin:n/recommended',
        'plugin:prettier/recommended',
      ],
    },
  ],
};
