import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import perfectionist from 'eslint-plugin-perfectionist'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: [
      'dist',
      'coverage',
      'scripts',
      'rollup.config.js',
      'eslint.config.js',
      'src/testWorkerMain.ts',
      '.tmp',
      '**/coverage/**',
      '**/fixtures/**',
    ],
  },
  {
    rules: {
      // '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      'no-useless-catch': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'no-ex-assign': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/restrict-plus-operands': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-undef': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/await-thenable': 'off',
      'no-useless-escape': 'off',
      '@typescript-eslint/no-deprecated': 'off',
      'no-constant-condition': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unnecessary-type-parameters': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      'prefer-const': 'off',
      '@typescript-eslint/return-await': 'off',
      'no-empty': 'off',
      '@typescript-eslint/no-dynamic-delete': 'off',
    },
  },
  {
    plugins: {
      perfectionist,
    },
    rules: {
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'natural',
          order: 'asc',
          newlinesBetween: 'never',
        },
      ],
    },
  },
)
