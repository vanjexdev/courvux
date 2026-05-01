import { setHead } from '../seo.js';

export default {
  data: {
    s1: `# Latest commit on main (rolling)
pnpm add github:vanjexdev/courvux

# Pin to a tagged release (recommended for production)
pnpm add github:vanjexdev/courvux#v0.4.0`,
    s2: `<script type="importmap">
{
  "imports": {
    "courvux": "./node_modules/courvux/dist/index.js"
  }
}
<\/script>
<script type="module" src="./main.js"><\/script>`,
    s3: `import { createApp } from 'courvux';`,
    s4: `// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
    // Courvux resolves automatically from node_modules
});`,
    s5: `// tsconfig.json — add Courvux types
{
  "compilerOptions": {
    "types": ["courvux"]
  }
}`,
    sCdn: `<!-- Latest from main branch -->
<script type="module">
  import { createApp } from 'https://cdn.jsdelivr.net/gh/vanjexdev/courvux@main/dist/index.js';

  createApp({
    data: { count: 0 },
    template: \`<button @click="count++">Clicks: {{ count }}</button>\`
  }).mount('#app');
<\/script>`,
    sCdnMap: `<!-- Pin to a specific version (recommended for production) -->
<script type="importmap">
{
  "imports": {
    "courvux": "https://cdn.jsdelivr.net/gh/vanjexdev/courvux@v0.4.0/dist/index.js"
  }
}
<\/script>

<script type="module">
  import { createApp, createStore, createRouter } from 'courvux';
<\/script>`,
  },
  onMount() {
    setHead({
        title: 'Installation',
        description: 'Install Courvux from GitHub or via import map / CDN. Vite plugin for templateUrl inlining and jsDelivr CDN setup.',
        slug: '/installation',
    });

    const placeholder = this.$refs.pen;
    if (!placeholder) return;
    const iframe = document.createElement('iframe');
    iframe.src = 'https://codepen.io/jesusuzcategui-the-bold/embed/VYmZNgZ?default-tab=html%2Cresult&theme-id=dark';
    iframe.height = '420';
    iframe.style.cssText = 'width:100%; border:0; border-radius:8px; display:block; margin-bottom:1rem;';
    iframe.scrolling = 'no';
    iframe.setAttribute('frameborder', 'no');
    iframe.setAttribute('allowtransparency', 'true');
    iframe.allowFullscreen = true;
    iframe.title = 'Courvux CDN demo on CodePen';
    placeholder.replaceWith(iframe);
  },
  template: `
        <div class="prose">
            <h1>Installation</h1>
            <p>Courvux ships as a single minified ES module with no runtime dependencies.</p>

            <h2>CDN — jsDelivr</h2>
            <p>No install, no build step. Drop a <code>&lt;script type="module"&gt;</code> anywhere:</p>
            <code-block :lang="'html'" :code="sCdn" :label="'index.html'"></code-block>
            <p>Or use an import map to keep <code>import ... from 'courvux'</code> clean across multiple files:</p>
            <code-block :lang="'html'" :code="sCdnMap" :label="'index.html'"></code-block>
            <div class="callout info">
                Pin to a tag or commit hash in production — <code>@main</code> always resolves to the latest commit and may include breaking changes.
            </div>
            
            <p style="margin-top:1.25rem; font-size:0.875rem; color:#333;">Try it live — no install required:</p>
            <p cv-ref="pen" style="margin:0 0 1rem; color:#888; font-size:12px;">Loading pen…</p>

            <h2>From GitHub</h2>
            <p>Install directly from the GitHub repository — pin a tag for stable installs:</p>
            <code-block :lang="'bash'" :code="s1" :label="'terminal'"></code-block>

            <h2>Without a bundler — Import Map</h2>
            <p>Add an import map before your module script. No build step needed.</p>
            <code-block :lang="'html'" :code="s2" :label="'index.html'"></code-block>

            <h2>With Vite / bundler</h2>
            <p>Import directly — Courvux resolves from <code>node_modules</code> automatically:</p>
            <code-block :lang="'js'" :code="s3" :label="'main.js'"></code-block>
            <code-block :lang="'js'" :code="s4" :label="'vite.config.js'"></code-block>

            <h2>TypeScript</h2>
            <p>Type declarations are included in the package at <code>dist/index.d.ts</code>.</p>
            <code-block :lang="'json'" :code="s5" :label="'tsconfig.json'"></code-block>

            <h2>Updating</h2>
            <div class="callout">
                <code>dist/</code> is committed to the repo. Courvux does not run a build step on install.
                To update, remove and re-add the package.
            </div>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/" style="font-size:13px; color:#555;">← Home</router-link>
                <router-link to="/quick-start" style="font-size:13px; color:#111; font-weight:600;">Quick Start →</router-link>
            </div>
        </div>
    `,
};
