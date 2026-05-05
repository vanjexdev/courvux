import { setHead } from '../../seo.js';

export default {
    data: {
        s_install: `# Clone + run from source (any platform)
git clone https://github.com/vanjexdev/courvux-tauri-example.git
cd courvux-tauri-example
pnpm install
pnpm tauri:dev

# Build a release binary for your host
pnpm tauri:build
# Linux Fedora 40+: prepend NO_STRIP=true (linuxdeploy gotcha)`,

        s_layout: `courvux-tauri-example/
├── package.json                  # Vite + frontend deps; Tauri CLI as devDep
├── vite.config.js                # tailwindcss + courvuxPrecompile plugins
├── index.html                    # CSP meta + #app mount point
├── src/
│   ├── main.js                   # Courvux app — entire UI lives here
│   ├── style.css                 # @import "tailwindcss" + .markdown-body
│   ├── icons.js                  # Lucide → static SVG strings
│   ├── markdown.js               # marked + Prism + DOMPurify pipeline
│   └── tauri.js                  # invoke() wrappers (note IO + folder picker)
├── src-tauri/
│   ├── Cargo.toml
│   ├── tauri.conf.json           # productName, window, CSP, bundle targets
│   ├── capabilities/default.json # IPC + dialog plugin permissions
│   └── src/
│       ├── main.rs               # thin wrapper, delegates to lib
│       └── lib.rs                # commands + atomic file IO + config persist
└── README.md`,

        s_csp: `<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self';
               style-src 'self' 'unsafe-inline';
               img-src 'self' data:;
               font-src 'self';
               connect-src 'self' ipc: http://ipc.localhost;
               object-src 'none';
               base-uri 'self';
               form-action 'self'" />`,

        s_storage: `# One Markdown file per note, with YAML frontmatter
~/.local/share/dev.vanjex.courvux-tauri-notepad/notes/
├── 1730812345678.md
├── 1730812400000.md
└── 1730812499000.md

# Each file:
---
title: My note
createdAt: 1730812345678
updatedAt: 1730812400000
---

# Hello

This is **markdown** with \`syntax-highlighted\` fences:

\`\`\`rust
fn main() { println!("hello tauri"); }
\`\`\``,
    },

    template: `
        <div class="prose">
            <h1>Notepad — Tauri demo</h1>
            <p>
                A small desktop notepad app, built end-to-end with Courvux,
                <a href="https://tauri.app/" target="_blank" rel="noopener">Tauri 2</a>,
                <a href="https://tailwindcss.com/" target="_blank" rel="noopener">Tailwind 4</a>,
                and the
                <router-link to="/csp" class="link">courvux-precompile</router-link>
                plugin. Source lives at
                <a href="https://github.com/vanjexdev/courvux-tauri-example" target="_blank" rel="noopener">vanjexdev/courvux-tauri-example</a>.
            </p>

            <p>
                The app exists for two reasons: it's a real-world test for the
                Courvux runtime under a strict-CSP webview, and it's the answer
                to "what does a Tauri + Courvux project look like?" for anyone
                evaluating the framework.
            </p>

            <div class="callout info">
                Linux bundles (AppImage, .deb, .rpm) attached to every release —
                <a href="https://github.com/vanjexdev/courvux-tauri-example/releases" target="_blank" rel="noopener">github.com/vanjexdev/courvux-tauri-example/releases</a>.
                macOS / Windows users build from source (instructions in the README).
            </div>

            <h2>What it shows</h2>
            <ul>
                <li><strong>Markdown editor with live preview</strong> — three view modes (Edit / Split / Preview) cycled via <code>Ctrl+P</code>. Render pipeline is <a href="https://marked.js.org/" target="_blank" rel="noopener">marked</a> → <a href="https://prismjs.com/" target="_blank" rel="noopener">Prism</a> for fenced-code syntax highlighting → <a href="https://github.com/cure53/DOMPurify" target="_blank" rel="noopener">DOMPurify</a> sanitization, so a hostile paste cannot execute scripts even with strict CSP.</li>
                <li><strong>Per-note Markdown files on disk.</strong> Each note is its own <code>&lt;id&gt;.md</code> file with YAML frontmatter (<code>title</code>, <code>createdAt</code>, <code>updatedAt</code>). Sync with Dropbox / Syncthing / git — the app reads them as plain text.</li>
                <li><strong>Atomic writes</strong> via tempfile + <code>fsync</code> + rename, so a mid-write crash never leaves a corrupt note.</li>
                <li><strong>User-picked storage folder</strong> — gear icon (or <code>Ctrl+,</code>) opens a settings panel with a native folder picker (<code>@tauri-apps/plugin-dialog</code>). Choice persists in <code>config.json</code>; "Reset to default" reverts.</li>
                <li><strong>Save state machine.</strong> New notes start <code>Unsaved</code> and require <code>Ctrl+S</code> for the first commit; after that, every keystroke promotes to <code>Dirty</code> and auto-saves 600 ms later. Status bar reflects the state in real time.</li>
                <li><strong>Window-close guard.</strong> <code>beforeunload</code> blocks accidental quit while the active note has unsaved changes.</li>
                <li><strong>Collapsible + resizable sidebar.</strong> Drag the right edge to resize (180-480 px); <code>Ctrl+B</code> toggles visibility. Width and open state both persist in <code>localStorage</code>.</li>
                <li><strong>Lucide icons</strong> throughout the UI instead of ASCII / emoji glyphs.</li>
                <li><strong>Migration from older formats.</strong> The first version stored notes as a single <code>notes.json</code> blob; a 0.2.0 → 0.3.0 user opens the app and the Rust side silently migrates each entry into its own <code>.md</code> file, then deletes the legacy file.</li>
            </ul>

            <h2>Strict CSP, no <code>unsafe-eval</code></h2>
            <p>
                Tauri 2 ships with a strict CSP by default. The notepad's
                <code>tauri.conf.json</code> and the <code>&lt;meta http-equiv&gt;</code>
                in <code>index.html</code> both declare:
            </p>
            <code-block :lang="'html'" :code="s_csp"></code-block>
            <p>
                That's only possible because <code>vite-plugin-courvux-precompile</code>
                walks every Courvux template at build time and turns each expression
                — <code>{{ count }}</code>, <code>:disabled="!flag"</code>,
                <code>@click="save()"</code>, <code>cv-model="form.title"</code> —
                into a JavaScript arrow function compiled at build time. The runtime
                checks that registry before falling back to <code>new Function</code>,
                so the fallback is never reached and the page can ship without
                <code>script-src 'unsafe-eval'</code>.
            </p>
            <p>
                Build-end report on the notepad's source:
            </p>
            <pre><code>[courvux-precompile] processed 1 file(s), 57 expression(s) precompiled, 0 template(s) fell back to runtime new Function.</code></pre>
            <p>
                The full story lives at <router-link to="/csp" class="link">/csp</router-link>.
            </p>

            <h2>Storage layout</h2>
            <p>Notes live as plain Markdown files in the platform's app-data directory (or wherever the user picks via the settings panel):</p>
            <code-block :lang="'bash'" :code="s_storage"></code-block>
            <p>
                Each file is human-editable. Open one in any text editor while
                the app is closed — the next time the notepad starts it picks
                up your changes. The <code>id</code> in the filename is the
                creation timestamp; titles can be renamed without touching
                the filename so links and references stay stable.
            </p>

            <h2>Source layout</h2>
            <code-block :lang="'text'" :code="s_layout"></code-block>

            <h2>Try it</h2>
            <code-block :lang="'bash'" :code="s_install"></code-block>
            <p>
                Per-platform prerequisites and the Fedora <code>NO_STRIP=true</code>
                gotcha are documented in the
                <a href="https://github.com/vanjexdev/courvux-tauri-example/blob/main/README.md" target="_blank" rel="noopener">repo README</a>.
            </p>

            <h2>Tech stack at a glance</h2>
            <table>
                <thead>
                    <tr><th>Layer</th><th>Pick</th><th>Why</th></tr>
                </thead>
                <tbody>
                    <tr><td>UI runtime</td><td>Courvux 0.7.1</td><td>~22 KB gzip everything-included; supports the strict-CSP precompile path</td></tr>
                    <tr><td>Build / bundler</td><td>Vite 6</td><td>Plugin ecosystem (tailwind, courvux-precompile), instant HMR</td></tr>
                    <tr><td>Styling</td><td>Tailwind 4</td><td>No config file, single <code>@import</code></td></tr>
                    <tr><td>Markdown</td><td>marked + DOMPurify</td><td>Fast parser; mandatory sanitization for hostile pastes</td></tr>
                    <tr><td>Code highlighting</td><td>Prism (Tomorrow Night)</td><td>Tiny core + per-language packs; matches the dark UI</td></tr>
                    <tr><td>Icons</td><td>Lucide v1</td><td>Already a Courvux dependency; SVG strings precomputed at module load</td></tr>
                    <tr><td>Desktop shell</td><td>Tauri 2</td><td>Rust backend, system webview, ~3-5x lighter than Electron</td></tr>
                    <tr><td>Native folder picker</td><td>tauri-plugin-dialog</td><td>OS-native dialog instead of browser <code>&lt;input type="file"&gt;</code></td></tr>
                    <tr><td>Note serialization</td><td>serde_yaml + serde_json</td><td>YAML frontmatter for human-readable Markdown files; JSON for the small <code>config.json</code></td></tr>
                </tbody>
            </table>

            <div class="callout">
                <strong>Footprint reality check.</strong> A typical idle session runs at
                ~400 MB RSS (≈135 MB Rust main + ≈248 MB <code>WebKitWebProcess</code>).
                Same ballpark as VS Code, half of Slack, ~60% of an equivalent Electron
                app. Tauri's binary on disk is ~10 MB; the AppImage portable bundle is
                ~100 MB because it carries WebKit + GTK + their runtime deps.
            </div>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/csp" style="font-size:13px; color:#555;">← Strict CSP</router-link>
                <a href="https://github.com/vanjexdev/courvux-tauri-example" target="_blank" rel="noopener" style="font-size:13px; color:#111; font-weight:600;">View source →</a>
            </div>
        </div>
    `,

    onMount() {
        setHead({
            title: 'Notepad — Tauri 2 demo',
            description: 'Desktop notepad app showcasing Courvux + Tauri 2 + Tailwind 4 + the courvux-precompile plugin: Markdown editor with live preview, atomic per-note Markdown files, native folder picker, strict CSP without unsafe-eval.',
            slug: '/projects/notepad',
        });
    },
};
