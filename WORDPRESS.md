# Moving the landing page to WordPress and the Madinah subdomain

This page is one static HTML file. There are two ways to put it on WordPress. Pick whichever fits the existing Masjid Hearts WordPress setup.

## Option A: host the built page as is (fastest, pixel-perfect)

1. Run `npm install && npm run build`, or download the latest build from the repository's Actions tab.
2. Upload the contents of `dist/` to the subdomain's web root (for example `give.<madinah-domain>`).
   Or, inside WordPress, use a plugin that serves a static HTML page on a URL.
3. Set the GitHub Pages environment variables if rebuilding for the new address:
   `SITE_URL=https://<subdomain>` and `BASE_PATH=/`.

## Option B: rebuild it as a WordPress page template

1. Create a page template (for example `page-landing.php`) in the child theme.
2. Copy the `<body>` markup from `dist/index.html` into the template.
3. Copy the page's CSS from `dist/_astro/*.css` into the theme (or enqueue it), and the JavaScript from `dist/_astro/*.js` (or the inline scripts).
4. Copy the fonts: Playfair Display, Figtree and Amiri (Google Fonts or self-hosted).
5. Copy `src/data/land.json` and `src/data/cities.json` if the live map is rebuilt in PHP; or keep the built JavaScript, which already contains them.
6. Wire the content to WordPress fields (ACF or similar). The JSON files in `src/content/` show every field you need: copy, giving tiers, masajid (name, city, country, latitude, longitude, photo) and projects (before and after photos).

## Things to wire before launch

- [ ] **Donation links.** Every "Give $X a month" button, "Give monthly", "Become a founding donor" and "Start your monthly giving" must go to the real Madinah donation form. Put one link in `settings.json → donateUrl`, or one per tier in `landing.json → tiers.items[].link`. The "Your own amount" box adds `?give=AMOUNT` to the link.
- [ ] **Subdomain.** Point the Madinah subdomain at the host and switch on HTTPS.
- [ ] **Real masajid and projects.** Replace the placeholders (names, photos, map coordinates, before and after photos). See README.md.
- [ ] **Imam Initiative copy.** The fifth initiative has a draft line marked "Copy to confirm".
- [ ] **Contact email** in `settings.json`.
- [ ] **Social preview image** (`public/og.png`) if a campaign-specific one is wanted.
- [ ] Test on a phone: the bottom "Give monthly" bar, the map, the slider and the tier buttons.

## Things that must keep working

- The live map and adhan times run entirely in the visitor's browser. No API, no key, nothing to host.
- Animations respect "reduce motion" settings.
- All images have descriptions, and the slider works with the keyboard (arrow keys).
