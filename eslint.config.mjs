import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';

const INDENT = 2;

export default defineConfig([
    globalIgnores(['main.js', 'styles.css', 'node_modules/', '*.config.*', 'version-bump.mjs']),
    js.configs.recommended,
    tseslint.configs.recommended,
    svelte.configs.recommended,
    {
        plugins: { '@stylistic': stylistic },
        languageOptions: {
            globals: { ...globals.node, ...globals.browser },
        },
        rules: {
            '@stylistic/indent': ['error', INDENT],
            '@stylistic/eol-last': ['error', 'always'],
            '@stylistic/no-tabs': 'error',
            '@stylistic/object-curly-spacing': ['error', 'always'],
            '@stylistic/max-len': ['error', {
                code: 100,
                tabWidth: INDENT,
                ignoreUrls: true,
                ignoreRegExpLiterals: true,
                ignoreComments: true,
            }],
        },
    },
    {
        // The svelte parser needs a dedicated indentation rule; @stylistic/indent
        // does not understand the template AST, so defer to svelte/indent there.
        files: ['**/*.svelte', '**/*.svelte.ts'],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
            },
        },
        rules: {
            '@stylistic/indent': 'off',
            'svelte/indent': ['error', { indent: INDENT }],
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
]);
