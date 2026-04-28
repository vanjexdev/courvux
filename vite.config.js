import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            formats: ['es'],
            fileName: () => 'index.js'
        },
        minify: 'esbuild',
        outDir: 'dist',
        emptyOutDir: true
    },
    test: {
        environment: 'happy-dom',
        globals: true,
        include: ['src/__tests__/**/*.test.ts'],
    },
};
