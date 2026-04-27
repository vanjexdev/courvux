/**
 * vite-plugin-courvux
 *
 * Inlines `templateUrl` HTML files at build time, replacing them with
 * `template: `...`` so no runtime fetch() is needed.
 *
 * Benefits:
 *  - No network requests at runtime
 *  - Works without a web server (file:// protocol)
 *  - Enables tree-shaking of unused templates
 *  - HTML files are watched for HMR in dev mode
 *
 * Usage (vite.config.js):
 *   import courvux from './plugin/vite-plugin-courvux.js';
 *   export default { plugins: [courvux()] }
 *
 * @param {{ warnMissing?: boolean }} options
 * @returns {import('vite').Plugin}
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';

const TEMPLATE_URL_RE = /templateUrl\s*:\s*(['"`])((?:[^'"`\\]|\\.)*)\1/g;

export default function courvuxPlugin(options = {}) {
    const { warnMissing = true } = options;

    return {
        name: 'vite-plugin-courvux',
        enforce: 'pre',

        transform(code, id) {
            if (!/\.[jt]sx?$/.test(id)) return null;

            TEMPLATE_URL_RE.lastIndex = 0;
            const matches = [...code.matchAll(TEMPLATE_URL_RE)];
            if (matches.length === 0) return null;

            let result = code;
            let offset = 0;

            for (const match of matches) {
                const [full, , urlPath] = match;
                const origIndex = match.index;
                const startInResult = origIndex + offset;

                const absPath = resolve(dirname(id), urlPath);

                if (!existsSync(absPath)) {
                    if (warnMissing) {
                        this.warn(`[courvux] templateUrl not found: "${urlPath}" (from ${id})`);
                    }
                    continue;
                }

                const rawHtml = readFileSync(absPath, 'utf-8');
                // Escape backticks and template literal placeholders
                const escaped = rawHtml.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
                const replacement = `template: \`${escaped}\``;

                result =
                    result.slice(0, startInResult) +
                    replacement +
                    result.slice(startInResult + full.length);

                offset += replacement.length - full.length;

                // Watch HTML file so Vite HMR fires when it changes
                this.addWatchFile(absPath);
            }

            return { code: result, map: null };
        },
    };
}
