import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
})

const eslintConfig = [
  // Global ignores
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      'public/**',
      'scripts/**',
      'flocken_ads/**',
      'next-env.d.ts',
    ],
  },

  // Extend Next.js recommended config
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Custom rules for source files
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // Enforce const when variable is not reassigned
      'prefer-const': 'error',

      // Warn on unused variables (don't error during development)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // Warn on explicit any (gradual migration)
      '@typescript-eslint/no-explicit-any': 'warn',

      // React specific
      'react/no-unescaped-entities': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
    },
  },
]

export default eslintConfig
