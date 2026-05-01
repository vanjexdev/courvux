import { setHead } from '../seo.js';

export default {
    data: {
        install: `# From GitHub — pin a tag for stable installs
pnpm add github:vanjexdev/courvux#v0.4.0

# or rolling main
pnpm add github:vanjexdev/courvux`,
        counter: `import { createApp } from 'courvux';

createApp({
    template: \`
        <h1>Count: {{ count }}</h1>
        <button @click="count++">+1</button>
        <button @click="count = 0">Reset</button>
    \`,
    data: { count: 0 }
}).mount('#app');`,
    },
    template: `
        <div>
            <!-- Hero -->
            <div style="padding: 3rem 0 2rem; border-bottom: 1px solid #e8e8e8; margin-bottom: 2.5rem;">
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:1rem;">
                    <span style="font-size:2rem;">⚡</span>
                    <h1 style="font-size:2rem; font-weight:700; margin:0;">Courvux</h1>
                    <span class="badge">v0.4.0</span>
                </div>
                <p style="font-size:1rem; color:#444; margin-bottom:1.5rem; max-width:560px; line-height:1.6;">
                    Lightweight reactive UI framework. No virtual DOM —
                    direct DOM updates via Proxy-based reactivity.
                    Ships as a single ES module, no build step required.
                </p>
                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                    <router-link to="/installation" style="display:inline-block; padding:8px 18px; background:#111; color:#fff; border-radius:6px; text-decoration:none; font-size:13px; font-weight:600;">
                        Get Started →
                    </router-link>
                    <router-link to="/demo" style="display:inline-block; padding:8px 18px; background:#f0f0f0; color:#111; border-radius:6px; text-decoration:none; font-size:13px; border:1px solid #ddd;">
                        Live Demo
                    </router-link>
                </div>
            </div>

            <!-- Feature cards -->
            <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:16px; margin-bottom:2.5rem;">
                <div style="padding:16px; border:1px solid #e8e8e8; border-radius:8px; background:#fff;">
                    <div style="font-size:1.2rem; margin-bottom:8px;">🚀</div>
                    <div style="font-size:13px; font-weight:600; margin-bottom:4px;">~10 kB gzip</div>
                    <div style="font-size:12px; color:#666;">Single ES module. Zero runtime dependencies.</div>
                </div>
                <div style="padding:16px; border:1px solid #e8e8e8; border-radius:8px; background:#fff;">
                    <div style="font-size:1.2rem; margin-bottom:8px;">⚡</div>
                    <div style="font-size:13px; font-weight:600; margin-bottom:4px;">No virtual DOM</div>
                    <div style="font-size:12px; color:#666;">Direct DOM updates. Only changed nodes touched.</div>
                </div>
                <div style="padding:16px; border:1px solid #e8e8e8; border-radius:8px; background:#fff;">
                    <div style="font-size:1.2rem; margin-bottom:8px;">🔁</div>
                    <div style="font-size:13px; font-weight:600; margin-bottom:4px;">Proxy reactivity</div>
                    <div style="font-size:12px; color:#666;">Fine-grained subscriptions. No dirty checking.</div>
                </div>
                <div style="padding:16px; border:1px solid #e8e8e8; border-radius:8px; background:#fff;">
                    <div style="font-size:1.2rem; margin-bottom:8px;">🧩</div>
                    <div style="font-size:13px; font-weight:600; margin-bottom:4px;">Familiar syntax</div>
                    <div style="font-size:12px; color:#666;">Alpine-inspired directives. Vue-like components.</div>
                </div>
            </div>

            <!-- Install snippet -->
            <div class="prose">
                <h2>Install</h2>
                <code-block :lang="'bash'" :code="install" :label="'terminal'"></code-block>

                <h2>A counter in 10 lines</h2>
                <code-block :lang="'js'" :code="counter" :label="'main.js'"></code-block>

                <div class="callout info" style="margin-top:1.5rem;">
                    No build step required. Courvux works directly in the browser via an import map.
                    See <router-link to="/installation">Installation</router-link> for details.
                </div>
            </div>
        </div>
    `,
    onMount() {
        setHead({
            description: 'Lightweight reactive UI framework for the browser. No virtual DOM. Proxy-based reactivity. ~10 KB gzip.',
            slug: '/',
        });
    },
};
