import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';
import courvuxSsg from '../plugin/vite-plugin-courvux-ssg.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    base: '/courvux/',
    plugins: [
        tailwindcss(),
        courvuxSsg({
            // Reuse the same routes that the client router consumes
            routes: async () => (await import('./src/routes-data.js')).default,
            baseUrl: 'https://vanjexdev.github.io/courvux',
        }),
    ],
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
