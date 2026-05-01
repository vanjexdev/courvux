import './style.css';
import { createApp } from 'courvux';
import { CodeBlock } from './components/CodeBlock.js';
import router from './router.js';

// ── Sidebar nav definition ──────────────────────────────────────────────────
const NAV = [
    {
        key: 'start',
        label: 'Getting Started',
        items: [
            { to: '/', label: 'Introduction' },
            { to: '/installation', label: 'Installation' },
            { to: '/quick-start', label: 'Quick Start' },
        ]
    },
    {
        key: 'template',
        label: 'Template Syntax',
        items: [
            { to: '/template', label: 'Directives & Bindings' },
        ]
    },
    {
        key: 'components',
        label: 'Components',
        items: [
            { to: '/components', label: 'Components' },
            { to: '/reactivity', label: 'Reactivity' },
            { to: '/lifecycle', label: 'Lifecycle' },
        ]
    },
    {
        key: 'router',
        label: 'Router & Store',
        items: [
            { to: '/router', label: 'Router' },
            { to: '/store', label: 'Store' },
        ]
    },
    {
        key: 'advanced',
        label: 'Advanced',
        items: [
            { to: '/advanced', label: 'Directives & Plugins' },
        ]
    },
    {
        key: 'demo',
        label: 'Demo',
        items: [
            { to: '/demo', label: '⚡ TODO App' },
        ]
    },
];

// ── App ─────────────────────────────────────────────────────────────────────
createApp({
    router,
    components: { 'code-block': CodeBlock },
    data: {
        nav: NAV,
        open: NAV.reduce((acc, s) => { acc[s.key] = true; return acc; }, {}),
    },
    methods: {
        toggle(key) {
            this.open = { ...this.open, [key]: !this.open[key] };
        }
    },
    template: `
        <div style="display:flex; min-height:100vh;">

            <!-- ── Sidebar ──────────────────────────────────────── -->
            <aside style="
                width: 240px;
                min-width: 240px;
                background: #fff;
                border-right: 1px solid #e8e8e8;
                display: flex;
                flex-direction: column;
                height: 100vh;
                position: sticky;
                top: 0;
                overflow-y: auto;
            ">
                <!-- Logo -->
                <div style="padding: 20px 16px 12px; border-bottom: 1px solid #f0f0f0;">
                    <router-link to="/" style="text-decoration:none; display:flex; align-items:center; gap:8px;">
                        <span style="font-size:1.3rem;">⚡</span>
                        <span style="font-weight:700; font-size:15px; color:#111;">Courvux</span>
                        <span style="font-size:10px; color:#999; margin-left:2px;">v0.3.0</span>
                    </router-link>
                </div>

                <!-- Accordion nav -->
                <nav style="flex:1; padding: 12px 8px;">
                    <div cv-for="section in nav" :key="section.key" style="margin-bottom:4px;">
                        <!-- Section header -->
                        <button
                            @click="toggle(section.key)"
                            style="
                                width:100%; display:flex; align-items:center; justify-content:space-between;
                                padding:6px 8px; background:none; border:none; cursor:pointer;
                                font-family:inherit; font-size:11px; font-weight:600;
                                text-transform:uppercase; letter-spacing:.06em; color:#999;
                                border-radius:4px;
                            "
                            @mouseover="$event.currentTarget.style.color='#111'"
                            @mouseout="$event.currentTarget.style.color='#999'"
                        >
                            <span>{{ section.label }}</span>
                            <span style="font-size:10px; transition:transform .15s;"
                                  :style="open[section.key] ? 'transform:rotate(90deg)' : 'transform:rotate(0deg)'">▶</span>
                        </button>

                        <!-- Section items -->
                        <div cv-show="open[section.key]" style="padding-left:4px; margin-top:2px;">
                            <router-link
                                cv-for="item in section.items"
                                :key="item.to"
                                :to="item.to"
                                class="nav-link"
                            >{{ item.label }}</router-link>
                        </div>
                    </div>
                </nav>

                <!-- Footer -->
                <div style="padding: 14px 16px; border-top: 1px solid #f0f0f0; font-size:11px; color:#aaa; line-height:1.6;">
                    <div style="margin-bottom:8px;">
                        <span style="font-weight:600; color:#555;">Vanjex</span>
                        <span> · MIT License</span>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <a href="https://github.com/vanjexdev/courvux"
                           target="_blank"
                           style="color:#888; text-decoration:none; display:flex; align-items:center; gap:4px;"
                           @mouseover="$event.target.style.color='#111'"
                           @mouseout="$event.target.style.color='#888'"
                        >⬡ GitHub</a>
                        <a href="https://github.com/vanjexdev/courvux/issues"
                           target="_blank"
                           style="color:#888; text-decoration:none;"
                           @mouseover="$event.target.style.color='#111'"
                           @mouseout="$event.target.style.color='#888'"
                        >⬡ Issues / Support</a>
                        <a href="https://ko-fi.com/vanjexdev"
                           target="_blank"
                           style="color:#888; text-decoration:none;"
                           @mouseover="$event.target.style.color='#111'"
                           @mouseout="$event.target.style.color='#888'"
                        >♥ Buy me a coffee</a>
                    </div>
                </div>
            </aside>

            <!-- ── Content ───────────────────────────────────────── -->
            <main style="flex:1; overflow-y:auto; min-height:100vh;">
                <div style="max-width:780px; margin:0 auto; padding:2.5rem 2rem 4rem;">
                    <router-view />
                </div>
            </main>
        </div>
    `
}).mount('#app');
