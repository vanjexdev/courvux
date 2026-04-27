/**
 * ssr-test.mjs — Prueba manual de renderToString con happy-dom
 * Ejecutar: node ssr-test.mjs
 */

import { Window } from 'happy-dom';

// 1. Configurar el entorno DOM global (happy-dom)
const window = new Window();
globalThis.document = window.document;
globalThis.window = window;
globalThis.Node = window.Node;
globalThis.Element = window.Element;
globalThis.HTMLElement = window.HTMLElement;
globalThis.Comment = window.Comment;
globalThis.MutationObserver = window.MutationObserver ?? class {};

// 2. Importar renderToString del dist compilado
const { renderToString } = await import('./dist/index.js');

// ─── Tests ───────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        const result = fn();
        const ok = result instanceof Promise ? result.then(() => {
            console.log(`  ✅ ${name}`);
            passed++;
        }).catch(err => {
            console.error(`  ❌ ${name}\n     ${err.message}`);
            failed++;
        }) : result;
        if (!(result instanceof Promise)) {
            console.log(`  ✅ ${name}`);
            passed++;
        }
        return ok;
    } catch (err) {
        console.error(`  ❌ ${name}\n     ${err.message}`);
        failed++;
    }
}

async function testAsync(name, fn) {
    try {
        await fn();
        console.log(`  ✅ ${name}`);
        passed++;
    } catch (err) {
        console.error(`  ❌ ${name}\n     ${err.message}`);
        failed++;
    }
}

// ─── Casos de prueba ─────────────────────────────────────────────────────────

console.log('\n── Interpolación {{ }} ─────────────────────────────────────────');

await testAsync('texto simple', async () => {
    const html = await renderToString({
        template: '<p>{{ mensaje }}</p>',
        data: { mensaje: 'Hola SSR' }
    });
    console.log('     →', html);
    if (!html.includes('Hola SSR')) throw new Error(`Esperaba "Hola SSR", recibí: ${html}`);
    if (!html.includes('data-courvux-ssr')) throw new Error('Falta data-courvux-ssr attr');
});

await testAsync('expresión aritmética', async () => {
    const html = await renderToString({
        template: '<span>{{ a + b }}</span>',
        data: { a: 3, b: 7 }
    });
    console.log('     →', html);
    if (!html.includes('10')) throw new Error(`Esperaba "10", recibí: ${html}`);
});

await testAsync('override de data en renderToString', async () => {
    const html = await renderToString(
        { template: '<h1>{{ titulo }}</h1>', data: { titulo: 'Por defecto' } },
        { data: { titulo: 'Override del server' } }
    );
    console.log('     →', html);
    if (!html.includes('Override del server')) throw new Error(`Override no aplicó: ${html}`);
});

console.log('\n── cv-if ───────────────────────────────────────────────────────');

await testAsync('cv-if true → muestra elemento', async () => {
    const html = await renderToString({
        template: '<div><p cv-if="mostrar">Visible</p><p cv-else>Oculto</p></div>',
        data: { mostrar: true }
    });
    console.log('     →', html);
    if (!html.includes('Visible')) throw new Error(`Falta "Visible": ${html}`);
    if (html.includes('Oculto')) throw new Error(`"Oculto" no debería estar: ${html}`);
});

await testAsync('cv-if false → muestra cv-else', async () => {
    const html = await renderToString({
        template: '<div><p cv-if="mostrar">Visible</p><p cv-else>Oculto</p></div>',
        data: { mostrar: false }
    });
    console.log('     →', html);
    if (html.includes('Visible')) throw new Error(`"Visible" no debería estar: ${html}`);
    if (!html.includes('Oculto')) throw new Error(`Falta "Oculto": ${html}`);
});

console.log('\n── cv-for ──────────────────────────────────────────────────────');

await testAsync('lista de items', async () => {
    const html = await renderToString({
        template: '<ul><li cv-for="item in frutas">{{ item }}</li></ul>',
        data: { frutas: ['manzana', 'pera', 'uva'] }
    });
    console.log('     →', html);
    if (!html.includes('manzana')) throw new Error(`Falta "manzana": ${html}`);
    if (!html.includes('pera'))    throw new Error(`Falta "pera": ${html}`);
    if (!html.includes('uva'))     throw new Error(`Falta "uva": ${html}`);
});

await testAsync('cv-for con index', async () => {
    const html = await renderToString({
        template: '<ul><li cv-for="(item, i) in items">{{ i }}: {{ item }}</li></ul>',
        data: { items: ['A', 'B'] }
    });
    console.log('     →', html);
    if (!html.includes('0: A')) throw new Error(`Falta "0: A": ${html}`);
    if (!html.includes('1: B')) throw new Error(`Falta "1: B": ${html}`);
});

console.log('\n── :attr bindings ──────────────────────────────────────────────');

await testAsync(':class binding', async () => {
    const html = await renderToString({
        template: '<div :class="activo ? \'verde\' : \'rojo\'">texto</div>',
        data: { activo: true }
    });
    console.log('     →', html);
    if (!html.includes('verde')) throw new Error(`Falta clase "verde": ${html}`);
});

await testAsync(':href binding', async () => {
    const html = await renderToString({
        template: '<a :href="url">link</a>',
        data: { url: 'https://example.com' }
    });
    console.log('     →', html);
    if (!html.includes('https://example.com')) throw new Error(`Falta href: ${html}`);
});

console.log('\n── computed ────────────────────────────────────────────────────');

await testAsync('computed en template', async () => {
    const html = await renderToString({
        template: '<p>{{ doble }}</p>',
        data: { n: 5 },
        computed: {
            doble() { return this.n * 2; }
        }
    });
    console.log('     →', html);
    if (!html.includes('10')) throw new Error(`Esperaba "10": ${html}`);
});

// ─── Resumen ─────────────────────────────────────────────────────────────────
console.log(`\n── Resultado: ${passed} ✅  ${failed} ❌ ──────────────────────────────────\n`);
if (failed > 0) process.exit(1);
