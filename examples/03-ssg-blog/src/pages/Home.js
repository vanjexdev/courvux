import { useHead } from 'courvux';
import { POSTS } from '../posts.js';

export default {
    data: { posts: POSTS },
    template: `
        <article>
            <h1>The Blog</h1>
            <p class="muted">A small example of static-site generation with Courvux.</p>

            <ul class="posts">
                <li cv-for="post in posts" :key="post.slug">
                    <router-link :to="'/posts/' + post.slug" class="post-link">
                        <h2>{{ post.title }}</h2>
                        <p class="meta">{{ post.date }}</p>
                        <p>{{ post.description }}</p>
                    </router-link>
                </li>
            </ul>
        </article>
    `,
    onMount() {
        useHead({
            title:        'The Blog',
            description:  'A small example of static-site generation with Courvux.',
            link:         [{ rel: 'canonical', href: 'https://example.com/' }],
            meta: [
                { name: 'description',          content: 'A small example of static-site generation with Courvux.' },
                { property: 'og:title',         content: 'The Blog' },
                { property: 'og:type',          content: 'website' },
            ],
        });
    },
};
