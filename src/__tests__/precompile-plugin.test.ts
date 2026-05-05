// Tests for the Vite plugin's pure helpers (extractExpressions, compileHtml).
// We don't spin up Vite — these helpers are exported precisely so the harness
// can exercise them without a build orchestrator.

import { describe, it, expect } from 'vitest';
// @ts-expect-error — plain .js plugin, no .d.ts
import { extractExpressions, compileHtml } from '../../plugin/vite-plugin-courvux-precompile.js';
// @ts-expect-error — wasm-pack output has no bundled types
import * as wasm from 'courvux-precompiler';

describe('extractExpressions — what the precompiler sees', () => {
    it('catches text-node interpolations', () => {
        const html = `<h1>{{ user.name }}</h1><p>{{ count }} click{{ count === 1 ? '' : 's' }}</p>`;
        expect(extractExpressions(html)).toEqual([
            'user.name', 'count', "count === 1 ? '' : 's'",
        ]);
    });

    it('catches `:attr` bindings even when the value contains `>`', () => {
        // The original tag-by-tag scanner broke here because `[^>]*` was
        // terminated by the `>` inside `count > 0`. The current scanner
        // matches attribute patterns globally instead.
        const html = `<div :class="{ active: count > 0 }" :disabled="loading"></div>`;
        const exprs = extractExpressions(html);
        expect(exprs).toContain('{ active: count > 0 }');
        expect(exprs).toContain('loading');
    });

    it('catches `@event` handlers including modifier suffixes', () => {
        const html = `<button @click="inc()" @click.prevent="reset()" @keydown.enter="save()"></button>`;
        expect(extractExpressions(html).sort()).toEqual(['inc()', 'reset()', 'save()']);
    });

    it('extracts only the collection expression from cv-for', () => {
        // `(item, idx) in items` — the `(item, idx) in` part is binding
        // syntax, not an expression. Only `items` should be extracted.
        const html = `<li cv-for="(item, idx) in items" :key="item.id">{{ idx }}: {{ item.name }}</li>`;
        const exprs = extractExpressions(html);
        expect(exprs).toContain('items');
        expect(exprs).not.toContain('(item, idx) in items');
    });

    it('catches cv-if / cv-else-if / cv-show / cv-model / cv-html', () => {
        const html = `
            <div cv-if="count > 0">A</div>
            <div cv-else-if="count < 0">B</div>
            <div cv-show="visible">C</div>
            <input cv-model="form.email" />
            <span cv-html="markdown"></span>
            <span cv-html.raw="trustedHtml"></span>
        `;
        const exprs = extractExpressions(html);
        expect(exprs).toEqual(expect.arrayContaining([
            'count > 0', 'count < 0', 'visible', 'form.email', 'markdown', 'trustedHtml',
        ]));
    });

    it('does not attempt to extract from non-expression attrs', () => {
        const html = `<a class="link" href="/about" id="x" data-foo="bar">link</a>`;
        // None of class / href / id / data-* are Courvux expression sites.
        expect(extractExpressions(html)).toEqual([]);
    });
});

describe('compileHtml — round-trip via the WASM precompiler', () => {
    it('produces a function per unique expression and dedupes', () => {
        const html = `<p>{{ count }}</p><p>{{ count }}</p><p>{{ count + 1 }}</p>`;
        const { exprMap, exprCount, skipped } = compileHtml(html, wasm, { file: 'test.html', warn: false });
        // Two unique expressions: 'count' (twice) and 'count + 1' (once).
        expect(exprCount).toBe(2);
        expect(Object.keys(exprMap).sort()).toEqual(['count', 'count + 1']);
        expect(skipped).toEqual([]);
    });

    it('reports skipped expressions when WASM compile fails — no fatal throw', () => {
        // Block-body arrows aren't in the supported subset.
        const html = `<button @click="() => { return 1; }">x</button>`;
        const { skipped } = compileHtml(html, wasm, { file: 'test.html', warn: false });
        expect(skipped.length).toBeGreaterThan(0);
        expect(skipped[0].reason).toMatch(/invalid expression/);
    });

    it('emitted JS evaluates back to the right value against a mock state', () => {
        const html = `<p :class="active ? 'on' : 'off'">{{ user.name }}</p>`;
        const { exprMap } = compileHtml(html, wasm, { file: 'test.html', warn: false });
        const state = { active: true, user: { name: 'Ada' } };
        // The plugin emits the function-source string; evaluate via Function
        // so we exercise the actual emitted code, not a parser re-roundtrip.
        const classFn = new Function('return ' + exprMap[`active ? 'on' : 'off'`])();
        const nameFn  = new Function('return ' + exprMap['user.name'])();
        expect(classFn(state)).toBe('on');
        expect(nameFn(state)).toBe('Ada');
    });
});
