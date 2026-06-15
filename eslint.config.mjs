import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

export default tseslint.config(
    {
        ignores: ['main.js', 'styles.css', 'node_modules/', '*.config.*', 'version-bump.mjs'],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...svelte.configs.recommended,
    {
        languageOptions: {
            globals: { ...globals.node, ...globals.browser },
        },
    },
    {
        files: ['**/*.svelte', '**/*.svelte.ts'],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
            },
        },
    },
    {
        rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],
            '@typescript-eslint/ban-ts-comment': 'off',
            'no-prototype-builtins': 'off',
            '@typescript-eslint/no-empty-function': 'off',
        },
    },
);
