import globals from 'globals'
import js from '@eslint/js'
import astro from 'eslint-plugin-astro'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  // Ignore patterns
  {
    ignores: ['dist/**', '.astro/**', 'test-results/**', 'playwright-report/**', 'out/**', '**/*.d.ts'],
  },

  // Base configuration for all files
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },

  // ESLint recommended rules
  js.configs.recommended,

  // Astro recommended and strict accessibility rules
  ...astro.configs['flat/recommended'],
  ...astro.configs['flat/jsx-a11y-strict'],

  // JavaScript files
  {
    files: ['**/*.js'],
    rules: {
      'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
    },
  },

  // Astro files
  {
    files: ['**/*.astro'],
    rules: {
      'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
    },
  },

  // TypeScript files
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': tseslint,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' }],
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
]
