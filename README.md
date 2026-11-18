# Masjid Hearts: monthly giving landing page

A single, fast landing page for the Masjid Hearts monthly giving campaign:
**One Modest Gift. Dozens of Mosques. Endless Sadaqah.**

- Live preview: https://samisayyed1.github.io/masjid-hearts-landing/
- Main Masjid Hearts website (separate project): https://samisayyed1.github.io/masjid-hearts/
- Moving it to WordPress and a real domain: see [WORDPRESS.md](WORDPRESS.md)

Built with [Astro](https://astro.build). It outputs one static HTML page with its CSS, a little JavaScript and optimised images. Every push to `main` rebuilds and deploys it to GitHub Pages (`.github/workflows/deploy.yml`).

## What is on the page

| Section | What it does |
| --- | --- |
| Hero | Headline, both calls to action, the dome drawn from hearts, three key facts |
| Our story | The hadith that started the movement, and a count-up of masajid in the network |
| Somewhere, right now | **Live** world map of day, twilight and night, with the masajid pinned, plus the latest adhan for each of the five prayers, calculated in the browser from the sun's position |
| Centers of Light | Surah An-Nur 24:36, what communities need, and a carousel of masajid in the network |
| The model | Old way vs. MasjidHearts, then an animated diagram: many donors → one fund → dozens of masajid |
| Sadaqah Jariyah | Hadith from Sahih Muslim and the three rewards |
| Initiatives | Radiance, Flow, Expansion, Iqra, Imam |
| Giving tiers | $10, $25, $50 and $100 a month, plus "your own amount" |
| Our promise | Dashboard, Stories of Joy, local partnerships |
| Impact | Before-and-after slider for a featured project, plus project cards |
| Final call | Closing copy and the main button, with quick links to each tier |

On phones, a "Give monthly" bar slides up after the hero and hides itself where giving is already on screen.

## Where everything is edited

All words and data are in `src/content/`. No code changes are needed to update them.

| File | What is in it |
| --- | --- |
| `landing.json` | Every piece of copy on the page, in page order. Each giving tier can have its own `link`. |
| `settings.json` | Number of masajid, the donation link, the main site address, contact email |
| `masajid.json` | The masajid shown in the carousel and on the map (name, city, country, latitude, longitude, photo) |
| `projects.json` | Completed projects for the Impact section (before and after photos, summary). The one with `"featured": true` gets the slider. |

Photos go in `src/assets/masajid/` and `src/assets/projects/`. Put the filename in the JSON (for example `"image": "masjid-noor-dakar.jpg"`). Astro resizes and converts them automatically.

You can also edit these lists in the browser with [Pages CMS](https://app.pagescms.org): sign in with GitHub and open this repository. The editor is set up in `.pages.yml` (masajid, projects and settings).

### Replacing the placeholders

Every placeholder shows a dashed **PLACEHOLDER** tag on the page so nothing slips through. For each real entry, fill in the details and set `"placeholder": false` (or delete the line). The build prints what is still a placeholder:

```
npm run check
```

### Donation links

Until real links exist, every donate button opens the contact form on the main Masjid Hearts website with the amount already written in. To wire real donations:

- One link for everything: set `donateUrl` in `settings.json`.
- A different link per tier: set `link` on each tier in `landing.json` (this wins over `donateUrl`).
- "Your own amount" sends the visitor to `donateUrl` with `?give=AMOUNT` added.

## Working on it locally

```
npm install
npm run dev      # http://localhost:4321
npm run build    # checks the content, then builds to dist/
```

`npm run build` stops with a clear message if something is wrong (bad link, a photo that is missing, a map pin off the globe).

`src/data/land.json` (the dots on the map) is generated once by `npm run land-dots` from Natural Earth data. `src/data/cities.json` lists the cities used for the live adhan times.

## Brand

Green `#00483D`, gold `#CFB083` and white, from the Masjid Hearts brand guide. Headlines use Playfair Display as the web stand-in for Bastia Bold, body text uses Figtree, and Arabic uses Amiri. The logo, dome and hearts come from the brand files in `public/brand/`.
