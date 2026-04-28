import Prism from 'prismjs';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-markup.js';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-typescript.js';

const LANG_LABEL = { js: 'JavaScript', ts: 'TypeScript', html: 'HTML', bash: 'Shell', json: 'JSON' };

function dedent(str) {
    const lines = str.split('\n');
    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    const min = lines
        .filter(l => l.trim())
        .reduce((m, l) => Math.min(m, l.match(/^(\s*)/)[1].length), Infinity);
    return lines.map(l => l.slice(min)).join('\n');
}

export const CodeBlock = {
    data: { lang: 'js', code: '', label: '', copied: false },
    template: `
        <div class="code-block">
            <div class="code-header">
                <span class="code-lang">{{ label || langLabel }}</span>
                <button class="copy-btn" @click="copy()">
                    {{ copied ? '✓ Copied' : 'Copy' }}
                </button>
            </div>
            <pre class="language-placeholder"><code cv-ref="el" :class="'language-' + lang"></code></pre>
        </div>
    `,
    computed: {
        langLabel() { return LANG_LABEL[this.lang] || this.lang.toUpperCase(); }
    },
    methods: {
        copy() {
            navigator.clipboard?.writeText(this._cleanCode).then(() => {
                this.copied = true;
                setTimeout(() => { this.copied = false; }, 1800);
            });
        }
    },
    onMount() {
        const el = this.$refs.el;
        if (!el) return;
        this._cleanCode = dedent(this.code);
        el.textContent = this._cleanCode;
        Prism.highlightElement(el);
    }
};
