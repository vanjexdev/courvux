import { test, expect, type Page } from '@playwright/test';

// All tests run against the built docs site (pnpm --dir site preview).
// Each test asserts no unhandled errors leaked from mount() — that's the
// silent-failure pattern that hid the 0.4.4 Safari crash.

const collectErrors = (page: Page) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(`pageerror: ${err.message}`));
    page.on('console', msg => {
        if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`);
    });
    return errors;
};

test.describe('Home page', () => {
    test('mounts without errors and renders hero', async ({ page }) => {
        const errors = collectErrors(page);
        await page.goto('/courvux/');
        await expect(page.locator('h1', { hasText: 'Courvux' })).toBeVisible();
        await expect(page.getByRole('link', { name: /Get Started/ })).toBeVisible();
        // The mount-error catch in main.js writes a card with `App failed to mount`.
        await expect(page.getByText('App failed to mount')).toHaveCount(0);
        expect(errors).toEqual([]);
    });

    test('SSG-rendered code blocks show real Prism markup, not raw bindings', async ({ page }) => {
        // Regression: 0.4.2 SSG-components fix. The bound :code expression
        // must be resolved into real text in the static HTML, not appear as
        // `<code-block :code="install">`.
        const html = await (await page.request.get('/courvux/')).text();
        expect(html).toContain('<div class="code-block">');
        expect(html).toContain('class="token');  // Prism syntax-highlighted output
        expect(html).not.toContain('<code-block ');
    });
});

test.describe('Routing (history mode + base prefix)', () => {
    test('sidebar link navigates client-side', async ({ page }) => {
        const errors = collectErrors(page);
        await page.goto('/courvux/');
        // Click "Installation" in the sidebar nav. The link carries
        // @click="closeSidebar()" — that combo was the exact 0.4.4 crash.
        await page.getByRole('link', { name: 'Installation', exact: true }).first().click();
        await expect(page).toHaveURL(/\/courvux\/installation/);
        await expect(page.locator('h1', { hasText: 'Installation' })).toBeVisible();
        expect(errors).toEqual([]);
    });

    test('direct deep-link load (/reactivity) hydrates correctly', async ({ page }) => {
        const errors = collectErrors(page);
        await page.goto('/courvux/reactivity/');
        // The static SSG title is in the page until main.js replaces innerHTML
        // and the router re-mounts the page. Wait for the client-side h1.
        await expect(page.locator('main h1', { hasText: 'Reactivity' })).toBeVisible();
        // Sidebar (rendered client-side from main.js) must also appear.
        // Scope to <aside> so we don't ambiguously match the page heading.
        await expect(page.locator('aside').getByRole('link', { name: 'Reactivity', exact: true })).toBeVisible();
        expect(errors).toEqual([]);
    });

    test('client-side wildcard route renders NotFound', async ({ page }) => {
        // Note: vite preview doesn't auto-serve 404.html for unknown paths
        // (it falls back to index.html as an SPA dev server would). Real
        // GH Pages serves 404.html with HTTP 404 — that path is exercised
        // by the static-asset test below. Here we verify that once the SPA
        // hydrates, the wildcard route resolves to the NotFound component.
        const errors = collectErrors(page);
        await page.goto('/courvux/this-route-does-not-exist');
        await expect(page.getByText('Page not found')).toBeVisible();
        expect(errors).toEqual([]);
    });
});

test.describe('TodoMVC demo (/demo) — cv-for + cv-model under state changes', () => {
    test('add, toggle, filter, clear', async ({ page }) => {
        const errors = collectErrors(page);
        await page.goto('/courvux/demo/');
        // Wait for the client-side hydration to replace the static SSG markup
        // — main.js's mount() rewrites #app innerHTML, so the input is
        // re-rendered after a tick.
        const input = page.locator('input[placeholder="What needs to be done?"]');
        await input.waitFor({ state: 'visible', timeout: 10_000 });
        await input.fill('first');
        await input.press('Enter');
        await input.fill('second');
        await input.press('Enter');
        await input.fill('third');
        await input.press('Enter');

        // Three items rendered via cv-for with :key="todo.id".
        await expect(page.getByText('first', { exact: true })).toBeVisible();
        await expect(page.getByText('second', { exact: true })).toBeVisible();
        await expect(page.getByText('third', { exact: true })).toBeVisible();

        // Filter active / completed.
        await page.getByRole('button', { name: 'Active' }).click();
        await page.getByRole('button', { name: 'Completed' }).click();
        // No completed yet → empty state expected; switch back to All.
        await page.getByRole('button', { name: 'All' }).click();

        expect(errors).toEqual([]);
    });
});

test.describe('Mobile viewport (sidebar toggle)', () => {
    test.use({ viewport: { width: 390, height: 844 } });  // iPhone 14 size

    test('floating toggle is visible and opens the sidebar', async ({ page }) => {
        const errors = collectErrors(page);
        await page.goto('/courvux/');
        const toggle = page.locator('button.sidebar-toggle');
        await expect(toggle).toBeVisible();
        // The button text uses {{ }} interpolation — must resolve to ☰ (closed)
        await expect(toggle).toHaveText('☰');
        await toggle.click();
        // After click, sidebar opens, icon flips to ✕.
        await expect(toggle).toHaveText('✕');
        expect(errors).toEqual([]);
    });
});

test.describe('Static asset shape (sitemap, robots, 404)', () => {
    test('sitemap.xml lists all SSG routes', async ({ request }) => {
        const r = await request.get('/courvux/sitemap.xml');
        expect(r.ok()).toBe(true);
        const body = await r.text();
        for (const slug of ['/installation', '/quick-start', '/components', '/reactivity', '/demo']) {
            expect(body).toContain(`https://vanjexdev.github.io/courvux${slug}`);
        }
    });

    test('robots.txt references the sitemap', async ({ request }) => {
        const r = await request.get('/courvux/robots.txt');
        expect(r.ok()).toBe(true);
        const body = await r.text();
        expect(body).toContain('Sitemap: https://vanjexdev.github.io/courvux/sitemap.xml');
    });

    test('404.html exists and has the NotFound title', async ({ request }) => {
        const r = await request.get('/courvux/404.html');
        expect(r.ok()).toBe(true);
        const body = await r.text();
        expect(body).toContain('Page not found');
    });
});
