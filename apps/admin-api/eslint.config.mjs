import { config } from '@crm/eslint-config/base';

export default [
  ...config,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        babelOptions: {
          parserOpts: {
            plugins: ['decorators-legacy', 'jsx'],
          },
        },
      },
    },
  },
];
