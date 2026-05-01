import { useHead } from 'courvux';

const SITE_NAME = 'Courvux';
const BASE_URL  = 'https://vanjexdev.github.io/courvux';

/**
 * Page-level SEO metadata. Call once per page from `onMount`.
 *   setHead({ title, description, slug })
 *
 * - `title`       — page title (without site suffix)
 * - `description` — meta description, also used for og:description
 * - `slug`        — path under the base URL (e.g. '/installation', '/' for home)
 */
export function setHead({ title, description, slug = '/' }) {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Lightweight reactive UI framework`;
    const url = BASE_URL + slug;

    // Home page (no `title`) gets the SITE_NAME tagline directly without applying titleTemplate
    return useHead({
        title: title ?? `${SITE_NAME} — Lightweight reactive UI framework`,
        titleTemplate: title ? `%s — ${SITE_NAME}` : undefined,
        meta: [
            { name: 'description',          content: description },
            { property: 'og:title',         content: fullTitle },
            { property: 'og:description',   content: description },
            { property: 'og:type',          content: 'website' },
            { property: 'og:url',           content: url },
            { property: 'og:site_name',     content: SITE_NAME },
            { name: 'twitter:card',         content: 'summary_large_image' },
            { name: 'twitter:title',        content: fullTitle },
            { name: 'twitter:description',  content: description },
        ],
        link: [
            { rel: 'canonical', href: url },
        ],
    });
}
