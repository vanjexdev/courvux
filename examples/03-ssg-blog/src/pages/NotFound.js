import { useHead } from 'courvux';

export default {
    methods: { goBack() { window.history.back(); } },
    template: `
        <article style="text-align:center; padding:4rem 1rem;">
            <p style="font-size:4rem; margin:0;">404</p>
            <h1>Page not found</h1>
            <p>The page you are looking for doesn't exist.</p>
            <p>
                <button @click="goBack()">← Back</button>
                <router-link to="/" class="post-link" style="margin-left:8px;">Home →</router-link>
            </p>
        </article>
    `,
    onMount() {
        useHead({
            title:       '404 — Page not found',
            description: 'The page you are looking for does not exist.',
        });
    },
};
