import { setHead } from '../seo.js';

export default {
    methods: {
        goBack() { window.history.back(); },
    },
    template: `
        <div style="min-height:60vh; display:flex; align-items:center; justify-content:center; padding:4rem 1rem;">
            <div style="text-align:center; max-width:480px;">
                <p style="font-size:5rem; font-weight:700; margin:0 0 0.5rem; color:#111; line-height:1;">404</p>
                <h1 style="font-size:1.25rem; font-weight:600; margin:0 0 0.75rem; color:#111;">Page not found</h1>
                <p style="color:#666; font-size:14px; margin:0 0 2rem; line-height:1.6;">
                    The page you are looking for doesn't exist or was moved.
                    Check the URL, or use one of the options below.
                </p>
                <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
                    <button
                        @click="goBack()"
                        style="
                            padding:9px 18px; font-family:inherit; font-size:13px; font-weight:500;
                            background:#fff; color:#111; border:1px solid #d4d4d4; border-radius:6px;
                            cursor:pointer; transition:all .15s;
                        "
                        @mouseover="$event.currentTarget.style.background='#f5f5f5'"
                        @mouseout="$event.currentTarget.style.background='#fff'"
                    >← Back</button>
                    <router-link
                        to="/"
                        style="
                            padding:9px 18px; font-size:13px; font-weight:500;
                            background:#111; color:#fff; border:1px solid #111; border-radius:6px;
                            text-decoration:none; transition:opacity .15s;
                        "
                        @mouseover="$event.currentTarget.style.opacity='0.85'"
                        @mouseout="$event.currentTarget.style.opacity='1'"
                    >Home →</router-link>
                </div>
            </div>
        </div>
    `,
    onMount() {
        setHead({
            title: '404 — Page not found',
            description: 'The page you are looking for does not exist on Courvux docs.',
            slug: '/404',
        });
    },
};
