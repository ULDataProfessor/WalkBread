import js from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

const baseConfig = {
  ...js.configs.recommended,
  files: ['**/*.js', '**/*.mjs'],
  languageOptions: {
    ...js.configs.recommended.languageOptions,
    ecmaVersion: 'latest',
    sourceType: 'script',
    globals: {
      ...globals.browser,
      L: 'readonly',
      app: 'writable',
    },
  },
  plugins: {
    prettier: prettierPlugin,
  },
  rules: {
    ...js.configs.recommended.rules,
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prettier/prettier': 'warn',
  },
};

export default [
  {
    ignores: ['node_modules', 'css/**', '.venv/**', 'package-lock.json'],
  },
  baseConfig,
  {
    files: ['sw.js'],
    languageOptions: {
      globals: {
        self: 'readonly',
        caches: 'readonly',
        fetch: 'readonly',
        clients: 'readonly',
      },
    },
  },
  {
    files: ['tailwind.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        module: 'readonly',
        require: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
    },
  },
  {
    files: ['eslint.config.mjs'],
    languageOptions: {
      sourceType: 'module',
    },
  },
];
