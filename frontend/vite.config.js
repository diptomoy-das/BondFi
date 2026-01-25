import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';

export default defineConfig({
    plugins: [
        react(),
        nodePolyfills({
            // Whether to polyfill `node:` protocol imports.
            protocolImports: true,
            globals: {
                Buffer: true,
                global: true,
                process: true,
            },
        }),
    ],
    define: {
        global: 'window',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        outDir: 'build',
    },
});
