import "./style.css";
import { createApp } from "courvux";
import { CodeBlock } from "./components/CodeBlock.js";
import router, { setOnRouteChange } from "./router.js";

// ── Sidebar nav definition ──────────────────────────────────────────────────
const NAV = [
  {
    key: "start",
    label: "Getting Started",
    items: [
      { to: "/", label: "Introduction" },
      { to: "/installation", label: "Installation" },
      { to: "/quick-start", label: "Quick Start" },
    ],
  },
  {
    key: "template",
    label: "Template Syntax",
    items: [{ to: "/template", label: "Directives & Bindings" }],
  },
  {
    key: "components",
    label: "Components",
    items: [
      { to: "/components", label: "Components" },
      { to: "/reactivity", label: "Reactivity" },
      { to: "/lifecycle", label: "Lifecycle" },
      { to: "/composables", label: "Composables" },
      { to: "/event-bus", label: "Event Bus" },
    ],
  },
  {
    key: "router",
    label: "Router & Store",
    items: [
      { to: "/router", label: "Router" },
      { to: "/store", label: "Store" },
    ],
  },
  {
    key: "seo",
    label: "SEO & SSG",
    items: [
      { to: "/head", label: "useHead" },
      { to: "/ssg", label: "Static Generation" },
    ],
  },
  {
    key: "tooling",
    label: "Tooling",
    items: [
      { to: "/devtools", label: "DevTools" },
      { to: "/testing", label: "Testing" },
      { to: "/pwa", label: "PWA" },
    ],
  },
  {
    key: "advanced",
    label: "Advanced",
    items: [{ to: "/advanced", label: "Directives & Plugins" }],
  },
  {
    key: "demo",
    label: "Demo",
    items: [{ to: "/demo", label: "⚡ TODO App" }],
  },
];

// ── App ─────────────────────────────────────────────────────────────────────
createApp({
  router,
  components: { "code-block": CodeBlock },
    data: {
        nav: NAV,
        open: NAV.reduce((acc, s) => {
            acc[s.key] = true;
            return acc;
        }, {}),
        sidebarOpen: false,
    },
  methods: {
    toggle(key) {
      this.open = { ...this.open, [key]: !this.open[key] };
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
      if (this.sidebarOpen) {
        document.body.style.overflow = "hidden";
        this.$nextTick(() => {
          const sidebar = document.querySelector(".sidebar");
          if (sidebar) {
            sidebar.style.transform = "translateX(0)";
          }
        });
      } else {
        document.body.style.overflow = "";
        const sidebar = document.querySelector(".sidebar");
        if (sidebar) {
          sidebar.style.transform = "translateX(-100%)";
        }
      }
    },
    closeSidebar() {
      if (window.innerWidth <= 1024) {
        this.sidebarOpen = false;
        document.body.style.overflow = "";
        const sidebar = document.querySelector(".sidebar");
        if (sidebar) {
          sidebar.style.transform = "translateX(-100%)";
        }
      }
    },
  },
  onMount() {
    setOnRouteChange(() => {
      this.closeSidebar();
    });
  },
    onBeforeMount() {
        if (typeof window !== "undefined") {
            window.addEventListener("resize", () => {
                if (window.innerWidth > 1024 && this.sidebarOpen) {
                    this.sidebarOpen = false;
                    document.body.style.overflow = "";
                    const sidebar = document.querySelector(".sidebar");
                    if (sidebar) {
                        sidebar.style.transform = "";
                    }
                }
            });
            if (import.meta.env.VITE_ENABLE_DEVTOOLS === "true") {
                import("courvux").then(({ setupDevTools, mountDevOverlay }) => {
                    const hook = setupDevTools();
                    mountDevOverlay(hook);
                });
            }
        }
    },
  template: `
        <div style="display:flex; min-height:100vh; position:relative;">

            <!-- Skip to content link (accessibility) -->
            <a href="#main-content" class="skip-link" style="position:absolute; left:-9999px; top:auto; width:1px; height:1px; overflow:hidden; z-index:9999; background:#111; color:#fff; padding:8px 16px; font-size:14px; border-radius:4px; text-decoration:none;"
               @focus="$event.target.style.left='8px'; $event.target.style.top='8px'; $event.target.style.width='auto'; $event.target.style.height='auto'; $event.target.style.overflow='visible';"
               @blur="$event.target.style.left='-9999px'; $event.target.style.top='auto'; $event.target.style.width='1px'; $event.target.style.height='1px'; $event.target.style.overflow='hidden';"
            >Skip to content</a>

            <!-- ── Sidebar overlay (mobile) ────────────────────── -->
            <div class="sidebar-overlay" cv-show="sidebarOpen" @click="closeSidebar" style="position:fixed; inset:0; background:rgba(0,0,0,0.4); z-index:40; opacity:0; transition:opacity .2s;"
                 :style="sidebarOpen ? 'opacity:1' : 'opacity:0'"></div>

            <!-- ── Sidebar ──────────────────────────────────────── -->
            <aside class="sidebar" aria-label="Sidebar navigation" style="
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
                z-index: 50;
                transition: transform .25s ease;
            ">
                <!-- Logo -->
                <div style="padding: 20px 16px 12px; border-bottom: 1px solid #f0f0f0;">
                    <router-link to="/" @click="closeSidebar()" style="text-decoration:none; display:flex; align-items:center; gap:8px;" aria-label="Courvux v0.4.1 home">
                        <span style="font-size:1.3rem;" aria-hidden="true">⚡</span>
                        <span style="font-weight:700; font-size:15px; color:#111;">Courvux</span>
                        <span style="font-size:10px; color:#666; margin-left:2px;">v0.4.1</span>
                    </router-link>
                </div>

                <!-- Accordion nav -->
                <nav style="flex:1; padding: 12px 8px;">
                    <div cv-for="section in nav" :key="section.key" style="margin-bottom:4px;">
                        <!-- Section header -->
                        <button
                            @click="toggle(section.key)"
                            :aria-expanded="open[section.key] ? 'true' : 'false'"
                            style="
                                width:100%; display:flex; align-items:center; justify-content:space-between;
                                padding:6px 8px; background:none; border:none; cursor:pointer;
                                font-family:inherit; font-size:11px; font-weight:600;
                                text-transform:uppercase; letter-spacing:.06em; color:#666;
                                border-radius:4px;
                            "
                            @mouseover="$event.currentTarget.style.color='#111'"
                            @mouseout="$event.currentTarget.style.color='#666'"
                        >
                            <span>{{ section.label }}</span>
                            <span style="font-size:10px; transition:transform .15s;"
                                  :style="open[section.key] ? 'transform:rotate(90deg)' : 'transform:rotate(0deg)'"
                                  aria-hidden="true">▶</span>
                        </button>

                        <!-- Section items -->
                        <div cv-show="open[section.key]" style="padding-left:4px; margin-top:2px;">
                            <router-link
                                cv-for="item in section.items"
                                :key="item.to"
                                :to="item.to"
                                @click="closeSidebar()"
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
                           rel="noopener noreferrer"
                           style="color:#555; text-decoration:none; display:flex; align-items:center; gap:4px; min-height:24px; padding:2px 0;"
                           @mouseover="$event.target.style.color='#111'"
                           @mouseout="$event.target.style.color='#555'"
                        >⬡ GitHub</a>
                        <a href="https://github.com/vanjexdev/courvux/issues"
                           target="_blank"
                           rel="noopener noreferrer"
                           style="color:#555; text-decoration:none; display:flex; align-items:center; gap:4px; min-height:24px; padding:2px 0;"
                           @mouseover="$event.target.style.color='#111'"
                           @mouseout="$event.target.style.color='#555'"
                        >⬡ Issues / Support</a>
                        <a href="https://ko-fi.com/vanjexdev"
                           target="_blank"
                           rel="noopener noreferrer"
                           style="color:#555; text-decoration:none; display:flex; align-items:center; gap:4px; min-height:24px; padding:2px 0;"
                           @mouseover="$event.target.style.color='#111'"
                           @mouseout="$event.target.style.color='#555'"
                        >♥ Buy me a coffee</a>
                    </div>
                </div>
            </aside>

            <!-- ── Floating sidebar toggle (mobile) ────────────── -->
            <button class="sidebar-toggle"
                    @click="toggleSidebar()"
                    :aria-label="sidebarOpen ? 'Close navigation' : 'Open navigation'"
                    :aria-expanded="sidebarOpen ? 'true' : 'false'"
                    style="
                        display:none;
                        position:fixed;
                        bottom:20px;
                        right:20px;
                        width:48px;
                        height:48px;
                        border-radius:50%;
                        background:#111;
                        color:#fff;
                        border:none;
                        cursor:pointer;
                        font-size:20px;
                        z-index:45;
                        box-shadow:0 2px 12px rgba(0,0,0,0.25);
                        align-items:center;
                        justify-content:center;
                        transition:transform .15s;
                    "
                    @mouseover="$event.currentTarget.style.transform='scale(1.1)'"
                    @mouseout="$event.currentTarget.style.transform='scale(1)'"
            >
                <span class="sidebar-toggle-icon" aria-hidden="true"
                      style="display:inline-block; transition:transform .2s; line-height:1; font-size:22px;">{{ sidebarOpen ? '✕' : '☰' }}</span>
            </button>

            <!-- ── Content ───────────────────────────────────────── -->
            <main id="main-content" role="main" style="flex:1; overflow-y:auto; min-height:100vh;">
                <div style="max-width:780px; margin:0 auto; padding:2.5rem 2rem 4rem;">
                    <router-view />
                </div>
            </main>
        </div>
    `,
}).mount("#app");
