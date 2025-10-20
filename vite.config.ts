// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },

    // Use NodeGlobalsPolyfillPlugin inside optimizeDeps.esbuildOptions.plugins
    optimizeDeps: {
        esbuildOptions: {
            // define global for ESM deps resolution
            define: {
                global: 'globalThis',
            },
            // only the supported options: buffer and process
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    process: true,
                    buffer: true,
                }),
            ],
        },
    },

    // For build we often also need to ensure commonjs conversion and avoid externalization
    build: {
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },

    // make `global` identifier available at runtime replacements
    define: {
        global: 'globalThis',
        // optionally:
        // 'process.env': {},
    },
});
