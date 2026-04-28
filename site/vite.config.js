import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    base: '/cv-framework/',
    plugins: [tailwindcss()],
    resolve: {
        alias: {
            courvux: path.resolve(__dirname, '../dist/index.js'),
        }
    },
    build: {
        outDir: '../docs',
        emptyOutDir: true,
    }
});
