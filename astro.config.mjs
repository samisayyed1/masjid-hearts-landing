import { defineConfig } from 'astro/config';

// SITE_URL and BASE_PATH are set by the GitHub Pages workflow.
// On a custom domain or subdomain GitHub sets them to the domain and "/" automatically.
export default defineConfig({
  site: process.env.SITE_URL || 'https://samisayyed1.github.io',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'auto' },
});
