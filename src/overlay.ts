import { DevToolsHook, DevToolsComponentInstance, DevToolsStoreEntry } from './devtools.js';

const CSS = `
#cvd{position:fixed;bottom:16px;right:16px;z-index:2147483647;font-family:monospace;font-size:12px;line-height:1.4}
#cvd *{box-sizing:border-box;margin:0;padding:0}
#cvd-badge{background:#5b4cf5;color:#fff;padding:4px 10px;border-radius:6px;cursor:pointer;font-size:11px;font-weight:700;letter-spacing:.5px;user-select:none;box-shadow:0 2px 8px rgba(0,0,0,.4)}
#cvd-badge:hover{background:#7066f7}
#cvd-panel{background:#16161e;color:#c9c9d3;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,.6);width:380px;max-height:70vh;display:flex;flex-direction:column;border:1px solid #2a2a3d;overflow:hidden}
#cvd-head{display:flex;align-items:center;gap:6px;padding:8px 10px;background:#1f1f30;cursor:move;border-bottom:1px solid #2a2a3d}
#cvd-title{flex:1;font-weight:700;font-size:11px;color:#7066f7;letter-spacing:.8px}
#cvd-tabs{display:flex;gap:2px}
.cvd-tab{background:none;border:none;color:#888;padding:3px 8px;border-radius:4px;cursor:pointer;font:inherit;font-size:11px}
.cvd-tab.active,.cvd-tab:hover{background:#2a2a3d;color:#c9c9d3}
#cvd-close{background:none;border:none;color:#666;cursor:pointer;font-size:14px;line-height:1;padding:0 2px}
#cvd-close:hover{color:#e06c75}
#cvd-body{overflow-y:auto;flex:1;padding:6px}
#cvd-body::-webkit-scrollbar{width:4px}
#cvd-body::-webkit-scrollbar-track{background:#1a1a28}
#cvd-body::-webkit-scrollbar-thumb{background:#3a3a52;border-radius:2px}
.cvd-inst{border:1px solid #2a2a3d;border-radius:6px;margin-bottom:6px;overflow:hidden}
.cvd-inst-head{display:flex;align-items:center;gap:6px;padding:5px 8px;background:#1f1f30;cursor:pointer}
.cvd-inst-head:hover{background:#252538}
.cvd-inst-name{font-weight:700;color:#82aaff;flex:1}
.cvd-inst-id{color:#555;font-size:10px}
.cvd-arrow{color:#555;font-size:10px;transition:transform .15s}
.cvd-inst.open .cvd-arrow{transform:rotate(90deg)}
.cvd-kv{display:none;padding:6px 8px;background:#16161e;border-top:1px solid #2a2a3d}
.cvd-inst.open .cvd-kv{display:block}
.cvd-row{display:flex;align-items:baseline;gap:6px;padding:2px 0;border-bottom:1px solid #1e1e2a}
.cvd-row:last-child{border-bottom:none}
.cvd-key{color:#c792ea;min-width:90px;flex-shrink:0}
.cvd-val{color:#c3e88d;flex:1;word-break:break-all;cursor:pointer;padding:1px 4px;border-radius:3px}
.cvd-val:hover{background:#252538}
.cvd-val.editing{background:transparent;padding:0}
.cvd-edit{background:#252538;border:1px solid #5b4cf5;color:#c3e88d;font:inherit;width:100%;border-radius:3px;padding:1px 4px;outline:none}
.cvd-store-key{color:#ffcb6b}
.cvd-empty{color:#555;text-align:center;padding:20px;font-style:italic}
.cvd-badge-dot{display:inline-block;width:6px;height:6px;background:#61d46a;border-radius:50%;margin-right:5px;animation:cvd-pulse 2s infinite}
@keyframes cvd-pulse{0%,100%{opacity:1}50%{opacity:.4}}
.cvd-count{color:#888;font-size:10px}
`;

function injectCss() {
    if (document.getElementById('cvd-styles')) return;
    const s = document.createElement('style');
    s.id = 'cvd-styles';
    s.textContent = CSS;
    document.head.appendChild(s);
}

function formatVal(v: any): string {
    if (v === null) return 'null';
    if (v === undefined) return 'undefined';
    if (typeof v === 'string') return `"${v}"`;
    if (typeof v === 'object') return JSON.stringify(v);
    return String(v);
}

function parseVal(s: string): any {
    try { return JSON.parse(s); } catch { return s; }
}

export function mountDevOverlay(hook: DevToolsHook): void {
    if (typeof document === 'undefined') return;
    injectCss();

    // Root container
    const root = document.createElement('div');
    root.id = 'cvd';
    document.body.appendChild(root);

    let panelVisible = false;
    let activeTab: 'components' | 'store' = 'components';
    let openInstances = new Set<number>();

    // Badge (collapsed state)
    const badge = document.createElement('div');
    badge.id = 'cvd-badge';
    badge.innerHTML = '<span class="cvd-badge-dot"></span>COURVUX';
    root.appendChild(badge);

    // Panel
    const panel = document.createElement('div');
    panel.id = 'cvd-panel';
    panel.style.display = 'none';
    root.appendChild(panel);

    // Header (draggable)
    panel.innerHTML = `
        <div id="cvd-head">
            <span id="cvd-title">⚡ COURVUX DEVTOOLS</span>
            <div id="cvd-tabs">
                <button class="cvd-tab active" data-tab="components">Components</button>
                <button class="cvd-tab" data-tab="store">Store</button>
            </div>
            <button id="cvd-close">✕</button>
        </div>
        <div id="cvd-body"></div>
    `;

    const body = panel.querySelector('#cvd-body') as HTMLElement;

    // Toggle panel
    badge.addEventListener('click', () => {
        panelVisible = true;
        badge.style.display = 'none';
        panel.style.display = 'flex';
        render();
    });

    panel.querySelector('#cvd-close')!.addEventListener('click', () => {
        panelVisible = false;
        panel.style.display = 'none';
        badge.style.display = '';
    });

    // Tabs
    panel.querySelectorAll('.cvd-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            activeTab = (btn as HTMLElement).dataset.tab as any;
            panel.querySelectorAll('.cvd-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            render();
        });
    });

    // Drag — capture initial cursor + root position once on pointerdown,
    // then translate by delta on every pointermove. Avoids the
    // getBoundingClientRect() forced reflow Lighthouse flags as
    // forced-reflow-insight (overlay.ts was the source of a ~64ms reflow).
    const head = panel.querySelector('#cvd-head') as HTMLElement;
    head.addEventListener('pointerdown', e => {
        if ((e.target as HTMLElement).closest('button')) return;
        head.setPointerCapture(e.pointerId);

        const startX = e.clientX, startY = e.clientY;
        // offsetLeft/Top are layout reads, but happen once per drag (not
        // during page load) and read pre-existing layout — far cheaper
        // than getBoundingClientRect().
        const startLeft = root.offsetLeft;
        const startTop  = root.offsetTop;

        const move = (ev: PointerEvent) => {
            root.style.right  = 'auto';
            root.style.bottom = 'auto';
            root.style.left   = `${startLeft + (ev.clientX - startX)}px`;
            root.style.top    = `${startTop  + (ev.clientY - startY)}px`;
        };
        const up = (ev: PointerEvent) => {
            head.releasePointerCapture(ev.pointerId);
            head.removeEventListener('pointermove', move);
            head.removeEventListener('pointerup', up);
            head.removeEventListener('pointercancel', up);
        };
        head.addEventListener('pointermove', move);
        head.addEventListener('pointerup', up);
        head.addEventListener('pointercancel', up);
    });

    // Render
    function renderComponents() {
        const instances = hook.instances;
        if (!instances.length) {
            body.innerHTML = '<div class="cvd-empty">No hay componentes montados</div>';
            return;
        }
        body.innerHTML = instances.map(inst => {
            const state = inst.getState();
            const keys = Object.keys(state);
            const isOpen = openInstances.has(inst.id);
            return `
                <div class="cvd-inst${isOpen ? ' open' : ''}" data-id="${inst.id}">
                    <div class="cvd-inst-head">
                        <span class="cvd-arrow">▶</span>
                        <span class="cvd-inst-name">&lt;${inst.name}&gt;</span>
                        <span class="cvd-count">${keys.length} keys</span>
                        <span class="cvd-inst-id">#${inst.id}</span>
                    </div>
                    <div class="cvd-kv">
                        ${keys.length ? keys.map(k => `
                            <div class="cvd-row">
                                <span class="cvd-key">${k}</span>
                                <span class="cvd-val" data-inst="${inst.id}" data-key="${k}" title="click to edit">${formatVal(state[k])}</span>
                            </div>
                        `).join('') : '<span style="color:#555">— sin datos reactivos —</span>'}
                    </div>
                </div>
            `;
        }).join('');

        // Instance toggle
        body.querySelectorAll('.cvd-inst-head').forEach(h => {
            h.addEventListener('click', () => {
                const el = h.closest('.cvd-inst') as HTMLElement;
                const id = parseInt(el.dataset.id!);
                if (openInstances.has(id)) openInstances.delete(id);
                else openInstances.add(id);
                el.classList.toggle('open');
            });
        });

        // Inline edit
        body.querySelectorAll('.cvd-val').forEach(valEl => {
            valEl.addEventListener('click', e => {
                e.stopPropagation();
                const el = valEl as HTMLElement;
                if (el.querySelector('input')) return;
                const instId = parseInt(el.dataset.inst!);
                const key = el.dataset.key!;
                const inst = hook.instances.find(i => i.id === instId);
                if (!inst) return;
                const current = formatVal(inst.getState()[key]);
                el.classList.add('editing');
                el.innerHTML = `<input class="cvd-edit" value='${current.replace(/'/g, "&#39;")}'>`;
                const input = el.querySelector('input') as HTMLInputElement;
                input.focus();
                input.select();
                const commit = () => {
                    inst.setState(key, parseVal(input.value));
                    el.classList.remove('editing');
                };
                input.addEventListener('blur', commit);
                input.addEventListener('keydown', ev => {
                    if (ev.key === 'Enter') { ev.preventDefault(); commit(); }
                    if (ev.key === 'Escape') { el.classList.remove('editing'); render(); }
                });
            });
        });
    }

    function renderStore() {
        if (!hook.stores.length) {
            body.innerHTML = '<div class="cvd-empty">No hay store registrado</div>';
            return;
        }
        body.innerHTML = hook.stores.map((entry, si) => {
            const state = entry.getState();
            const keys = Object.keys(state);
            return `
                <div class="cvd-inst open" data-store="${si}">
                    <div class="cvd-inst-head">
                        <span class="cvd-arrow" style="transform:rotate(90deg)">▶</span>
                        <span class="cvd-inst-name" style="color:#ffcb6b">Store</span>
                        <span class="cvd-count">${keys.length} keys</span>
                    </div>
                    <div class="cvd-kv">
                        ${keys.map(k => `
                            <div class="cvd-row">
                                <span class="cvd-key cvd-store-key">${k}</span>
                                <span class="cvd-val" data-store="${si}" data-key="${k}" title="click to edit">${formatVal(state[k])}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');

        // Toggle store section
        body.querySelectorAll('.cvd-inst-head').forEach(h => {
            h.addEventListener('click', () => h.closest('.cvd-inst')!.classList.toggle('open'));
        });

        // Inline edit store
        body.querySelectorAll('[data-store][data-key]').forEach(valEl => {
            valEl.addEventListener('click', e => {
                e.stopPropagation();
                const el = valEl as HTMLElement;
                if (el.querySelector('input')) return;
                const si = parseInt(el.dataset.store!);
                const key = el.dataset.key!;
                const entry = hook.stores[si];
                if (!entry) return;
                const current = formatVal(entry.getState()[key]);
                el.classList.add('editing');
                el.innerHTML = `<input class="cvd-edit" value='${current.replace(/'/g, "&#39;")}'>`;
                const input = el.querySelector('input') as HTMLInputElement;
                input.focus();
                input.select();
                const commit = () => {
                    entry.setState(key, parseVal(input.value));
                    el.classList.remove('editing');
                };
                input.addEventListener('blur', commit);
                input.addEventListener('keydown', ev => {
                    if (ev.key === 'Enter') { ev.preventDefault(); commit(); }
                    if (ev.key === 'Escape') { el.classList.remove('editing'); render(); }
                });
            });
        });
    }

    function render() {
        if (!panelVisible) return;
        if (activeTab === 'components') renderComponents();
        else renderStore();
    }

    // Subscribe to devtools events
    hook.on('mount', () => render());
    hook.on('update', () => render());
    hook.on('destroy', () => render());
    hook.on('store-update', () => render());
}
