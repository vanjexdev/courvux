import { useHead } from 'courvux';
import { POSTS } from '../posts.js';

const findPost = (slug) => POSTS.find(p => p.slug === slug) ?? null;

export default {
    data: { post: null },
    template: `
        <article cv-if="post">
            <p class="back"><router-link to="/">← Back to all posts</router-link></p>
            <h1>{{ post.title }}</h1>
            <p class="meta">{{ post.date }}</p>
            <div cv-html="post.body"></div>
        </article>

        <article cv-else>
            <p>Post not found.</p>
            <p class="back"><router-link to="/">← Back to all posts</router-link></p>
        </article>
    `,
    onBeforeMount() {
        // Resolve which post this page is for from the current URL. The SSG
        // plugin sets window.location to the route being rendered, so this
        // works both at build time and at runtime hydration.
        const slug = window.location.pathname.replace(/\/$/, '').split('/').pop();
        this.post = findPost(slug);
    },
    onMount() {
        if (this.post) {
            useHead({
                title:       this.post.title,
                description: this.post.description,
                link: [{ rel: 'canonical', href: `https://example.com/posts/${this.post.slug}` }],
                meta: [
                    { name: 'description',           content: this.post.description },
                    { property: 'og:title',          content: this.post.title },
                    { property: 'og:description',   content: this.post.description },
                    { property: 'og:type',          content: 'article' },
                    { property: 'article:published_time', content: this.post.date },
                ],
            });
        }
    },
};
