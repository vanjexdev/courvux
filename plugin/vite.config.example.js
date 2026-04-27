/**
 * Example vite.config.js for an app using Courvux.
 * The courvux plugin inlines all templateUrl HTML files at build time.
 */
import courvux from './plugin/vite-plugin-courvux.js';

export default {
    plugins: [courvux()],
    // Optional: disable eval CSP warning when using compiled templates
    // server: { headers: { 'Content-Security-Policy': "script-src 'self'" } }
};
