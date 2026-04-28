export default {
    data: {
        s_interp: `<!-- Text interpolation -->
<p>{{ count }}</p>
<p>{{ price * qty }}</p>
<p>{{ active ? 'On' : 'Off' }}</p>
<p>{{ name.toUpperCase() }}</p>`,
        s_bind: `<!-- Property binding -->
<input :disabled="count > 10" />
<img :src="avatarUrl" :alt="user.name" />

<!-- Class binding (object | array | string) -->
<div :class="{ active: isOn, 'text-muted': !isOn }"></div>
<div :class="['base', isOn ? 'on' : 'off']"></div>

<!-- Style binding -->
<span :style="{ color: textColor, fontSize: size + 'px' }"></span>
<span :style="'color:red; font-weight:bold'"></span>`,
        s_events: `<!-- Method reference -->
<button @click="increment">+1</button>

<!-- Inline expression -->
<button @click="count++">+</button>
<button @click="count = 0">Reset</button>

<!-- $event — raw DOM event -->
<input @input="search = $event.target.value" />

<!-- Modifiers -->
<form @submit.prevent="onSubmit">...</form>
<button @click.stop="doThing">...</button>
<button @click.once="runOnce">...</button>

<!-- Key modifiers -->
<input @keydown.enter="submit" />
<input @keydown.esc="cancel" />

<!-- cv:on: prefix (alternative to @) -->
<button cv:on:click="increment">+1</button>`,
        s_cvfor: `<!-- Array -->
<li cv-for="item in items">{{ item }}</li>
<li cv-for="(item, index) in items">{{ index }}: {{ item }}</li>

<!-- Object -->
<li cv-for="(val, key) in person">{{ key }}: {{ val }}</li>

<!-- Keyed — recommended for dynamic lists -->
<li cv-for="user in users" :key="user.id">
    {{ user.name }}
</li>`,
        s_cvif: `<!-- Elements are added/removed from the DOM -->
<p cv-if="count > 10">High</p>
<p cv-else-if="count > 0">Low</p>
<p cv-else>Zero</p>`,
        s_cvshow: `<!-- Toggles display:none — stays in DOM -->
<div cv-show="isVisible">Panel content</div>

<!-- With Alpine-style transition -->
<div cv-show="open" cv-transition>Fade in/out</div>
<div cv-show="open" cv-transition.scale>Scale + fade</div>`,
        s_cvmodel: `<!-- Text input -->
<input type="text" cv-model="name" />

<!-- Checkbox → boolean -->
<input type="checkbox" cv-model="active" />

<!-- Select -->
<select cv-model="country">
    <option value="us">United States</option>
    <option value="mx">Mexico</option>
</select>

<!-- Modifiers -->
<input cv-model.lazy="query" />     <!-- update on blur -->
<input cv-model.trim="username" />  <!-- strip whitespace -->
<input cv-model.number="price" />   <!-- coerce to number -->
<input cv-model.debounce="search" />        <!-- 300ms debounce -->
<input cv-model.debounce.500="search" />    <!-- custom delay -->`,
        s_cvhtml: `<!-- Raw innerHTML — use only with trusted content -->
<div cv-html="richContent"></div>

<!-- Sanitized — strips scripts, event handlers, javascript: URLs -->
<div cv-html.sanitize="userContent"></div>`,
        s_cvdata: `<!-- Inline reactive scope — no component registration needed -->
<div cv-data="{ count: 0 }">
    <button @click="count--">−</button>
    <span>{{ count }}</span>
    <button @click="count++">+</button>
</div>

<!-- With methods -->
<div cv-data="{ open: false, toggle() { this.open = !this.open } }">
    <button @click="toggle()">{{ open ? 'Close' : 'Open' }}</button>
    <p cv-show="open">Content</p>
</div>

<!-- Nested scopes — child inherits parent keys -->
<div cv-data="{ user: 'Alice' }">
    <div cv-data="{ role: 'admin' }">
        {{ user }} — {{ role }}
    </div>
</div>`,
        s_misc: `<!-- cv-once — render once, skip future updates -->
<strong cv-once>{{ initialValue }}</strong>

<!-- cv-ref — store element reference in $refs -->
<input cv-ref="myInput" />

<!-- cv-teleport — move to another DOM node -->
<div cv-show="modal" cv-teleport="body">...</div>

<!-- cv-cloak — hide until mounted -->
<div id="app" cv-cloak></div>`,
    },
    template: `
        <div class="prose">
            <h1>Template Syntax</h1>
            <p>Courvux templates are plain HTML with directives and expression bindings.
               All expressions are full JavaScript (requires no strict CSP).</p>

            <h2>Interpolation</h2>
            <p>Use <code>{{ }}</code> inside text nodes for reactive values:</p>
            <code-block :lang="'html'" :code="s_interp"></code-block>

            <h2>Property & class & style bindings</h2>
            <p>Prefix any attribute with <code>:</code> to evaluate it as a JavaScript expression:</p>
            <code-block :lang="'html'" :code="s_bind"></code-block>

            <h2>Event binding</h2>
            <p>Use <code>@event</code> or <code>cv:on:event</code>. Access the raw event via <code>$event</code>.</p>
            <code-block :lang="'html'" :code="s_events"></code-block>

            <h2>cv-for — list rendering</h2>
            <p>Add <code>:key</code> for keyed reconciliation — Courvux reuses existing DOM nodes for matching keys.</p>
            <code-block :lang="'html'" :code="s_cvfor"></code-block>

            <h2>cv-if / cv-else-if / cv-else</h2>
            <p>Nodes are inserted and removed from the DOM.</p>
            <code-block :lang="'html'" :code="s_cvif"></code-block>

            <h2>cv-show</h2>
            <p>Toggles <code>display: none</code>. Node stays in the DOM.</p>
            <code-block :lang="'html'" :code="s_cvshow"></code-block>

            <h2>cv-model — two-way binding</h2>
            <code-block :lang="'html'" :code="s_cvmodel"></code-block>

            <h2>cv-html</h2>
            <code-block :lang="'html'" :code="s_cvhtml"></code-block>

            <h2>cv-data — inline scope</h2>
            <p>Self-contained reactive scope without component registration. Lighter than components — no lifecycle, no slots, no emits.</p>
            <code-block :lang="'html'" :code="s_cvdata"></code-block>

            <h2>Misc directives</h2>
            <code-block :lang="'html'" :code="s_misc"></code-block>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/quick-start" style="font-size:13px; color:#555;">← Quick Start</router-link>
                <router-link to="/components" style="font-size:13px; color:#111; font-weight:600;">Components →</router-link>
            </div>
        </div>
    `
};
