import path from 'node:path';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import builtins from 'builtin-modules';

export default defineConfig(({ mode }) => {
    const prod = mode === 'production';

    return {
        plugins: [svelte()],
        build: {
            sourcemap: prod ? false : 'inline',
            minify: prod,
            // Output straight into the plugin root so Obsidian picks it up.
            outDir: '.',
            emptyOutDir: false,
            lib: {
                entry: path.resolve(__dirname, 'src/main.ts'),
                formats: ['cjs'],
            },
            rollupOptions: {
                output: {
                    entryFileNames: 'main.js',
                    assetFileNames: 'styles.css',
                },
                external: [
                    'obsidian',
                    'electron',
                    '@codemirror/autocomplete',
                    '@codemirror/collab',
                    '@codemirror/commands',
                    '@codemirror/language',
                    '@codemirror/lint',
                    '@codemirror/search',
                    '@codemirror/state',
                    '@codemirror/view',
                    '@lezer/common',
                    '@lezer/highlight',
                    '@lezer/lr',
                    ...builtins,
                ],
            },
        },
    };
});
