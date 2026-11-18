import settings from '../content/settings.json';

/** A path inside the site, with the GitHub Pages base path added. */
export const url = (p: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}${p}`;

/**
 * Where a donate button goes, in order of preference:
 * 1. the tier's own link (set per tier in landing.json),
 * 2. the main donation link (settings.json → donateUrl),
 * 3. until those exist, the contact form on the main Masjid Hearts website with the amount filled in.
 */
export function giveHref(amount?: number, link?: string) {
  if (link) return link;
  if (settings.donateUrl) return settings.donateUrl;
  const base = settings.mainSite.replace(/\/?$/, '/');
  return amount ? `${base}?give=${amount}#contact` : `${base}#contact`;
}

export const count = settings.masajidCount;
export const fill = (s: string) => s.replaceAll('{count}', String(count));
export { settings };
