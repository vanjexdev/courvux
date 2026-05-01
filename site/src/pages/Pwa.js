import { setHead } from '../seo.js';

export default {
    data: {
        s_manifest: `{
  "name":             "My App",
  "short_name":       "MyApp",
  "description":      "A Courvux application",
  "start_url":        "/",
  "display":          "standalone",
  "background_color": "#ffffff",
  "theme_color":      "#3b82f6",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}`,

        s_link: `<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#3b82f6" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />`,

        s_workbox: `import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            manifest: false,                              // use your own public/manifest.json
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                runtimeCaching: [{
                    urlPattern: /^https:\\/\\/api\\.yourapp\\.com\\//,
                    handler: 'NetworkFirst',
                    options: {
                        cacheName: 'api-cache',
                        networkTimeoutSeconds: 5,
                        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
                    },
                }],
            },
        }),
    ],
});`,

        s_pwa: `// src/pwa.ts
export interface PWAState {
    installable: boolean;
    installed:   boolean;
    online:      boolean;
    prompt:      (() => Promise<void>) | null;
}

export function createPWA(): PWAState {
    const state: PWAState = {
        installable: false,
        installed:   window.matchMedia('(display-mode: standalone)').matches,
        online:      navigator.onLine,
        prompt:      null,
    };

    let deferredPrompt: any = null;

    window.addEventListener('beforeinstallprompt', (e: any) => {
        e.preventDefault();
        deferredPrompt = e;
        state.installable = true;
        state.prompt = async () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                state.installed   = true;
                state.installable = false;
            }
            deferredPrompt = null;
            state.prompt   = null;
        };
    });

    window.addEventListener('appinstalled', () => {
        state.installed   = true;
        state.installable = false;
        deferredPrompt    = null;
    });

    window.addEventListener('online',  () => { state.online = true; });
    window.addEventListener('offline', () => { state.online = false; });

    return state;
}`,

        s_use: `import { createApp } from 'courvux';
import { createPWA } from './pwa';

const pwa = createPWA();

createApp({
    data: { pwa },
    template: \`<router-view></router-view>\`,
    // ...
}).mount('#app');`,

        s_template: `<!-- Offline banner -->
<div cv-if="!pwa.online" class="offline-banner">
    Sin conexión — usando datos en caché
</div>

<!-- Install button -->
<button cv-if="pwa.installable && !pwa.installed" @click="pwa.prompt()">
    Instalar aplicación
</button>`,
    },
    template: `
        <div class="prose">
            <h1>Progressive Web App (PWA)</h1>
            <p>Courvux does not bundle PWA tooling — the manifest and service worker strategy are always app-specific. This page covers the minimal setup to make any Courvux app installable and offline-capable.</p>

            <h2>Web App Manifest</h2>
            <p>Create <code>public/manifest.json</code>:</p>
            <code-block :lang="'json'" :code="s_manifest"></code-block>

            <p>Link it in <code>index.html</code>:</p>
            <code-block :lang="'html'" :code="s_link"></code-block>

            <h2>Service Worker with Workbox</h2>
            <p>Use <code>vite-plugin-pwa</code> to generate a service worker. Configure runtime caching strategies for your API endpoints.</p>
            <code-block :lang="'js'" :code="s_workbox"></code-block>

            <h3>Cache strategies at a glance</h3>
            <table>
                <thead><tr><th>Strategy</th><th>Best for</th></tr></thead>
                <tbody>
                    <tr><td><code>CacheFirst</code></td><td>Static assets (fonts, images, icons)</td></tr>
                    <tr><td><code>NetworkFirst</code></td><td>API calls — fresh when online, fallback when offline</td></tr>
                    <tr><td><code>StaleWhileRevalidate</code></td><td>Non-critical data — instant from cache, updates in background</td></tr>
                </tbody>
            </table>

            <h2>Install prompt utility</h2>
            <p>The browser fires <code>beforeinstallprompt</code> when the app is installable, but only once. Capture it early — before any user interaction — and surface it at the right moment.</p>
            <code-block :lang="'ts'" :code="s_pwa"></code-block>

            <p>Use it in your app:</p>
            <code-block :lang="'js'" :code="s_use"></code-block>
            <p>Then in any template:</p>
            <code-block :lang="'html'" :code="s_template"></code-block>

            <div class="callout info">
                <strong>Safari / iOS:</strong> The install prompt API is not supported. Users must add to home screen manually via the share button. Detect iOS with <code>navigator.userAgent.includes('iPhone')</code> and show a custom instruction.
            </div>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/testing" style="font-size:13px; color:#555;">← Testing</router-link>
                <router-link to="/advanced" style="font-size:13px; color:#111; font-weight:600;">Advanced →</router-link>
            </div>
        </div>
    `,
    onMount() {
        setHead({
            title: 'Progressive Web App',
            description: 'Make any Courvux app installable and offline-capable: manifest, vite-plugin-pwa, install prompt utility.',
            slug: '/pwa',
        });
    },
};
