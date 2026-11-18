// Runs before every build. Stops the build on real mistakes; lists what is still a placeholder.
import { readFileSync, existsSync, readdirSync } from 'node:fs';

const read = (p) => {
  try { return JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), 'utf8')); }
  catch (e) { fail(`${p} is not valid JSON: ${e.message}`); return {}; }
};
const errors = [], todo = [];
function fail(m) { errors.push(m); }
const https = (v) => !v || /^https:\/\/\S+$/.test(v);
const photo = (dir, v, where) => {
  if (!v) return;
  const name = v.split('/').pop();
  if (!readdirSync(new URL(`../src/assets/${dir}/`, import.meta.url)).includes(name)) fail(`${where}: photo "${name}" is not in src/assets/${dir}/`);
};

const settings = read('src/content/settings.json');
const landing = read('src/content/landing.json');
const { masajid = [] } = read('src/content/masajid.json');
const { projects = [] } = read('src/content/projects.json');

if (!Number.isInteger(settings.masajidCount) || settings.masajidCount < 1) fail('settings.json: masajidCount must be a whole number');
if (!https(settings.donateUrl)) fail('settings.json: donateUrl must start with https://');
if (!https(settings.mainSite) || !settings.mainSite) fail('settings.json: mainSite must start with https://');
if (settings.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(settings.email)) fail('settings.json: email does not look like an email address');
if (!settings.donateUrl) todo.push('Donation link (settings.json → donateUrl): buttons go to the main site contact form for now');

(landing.tiers?.items || []).forEach((t, i) => {
  if (!Number.isFinite(t.amount) || t.amount <= 0) fail(`landing.json: tier ${i + 1} needs an amount`);
  if (!https(t.link)) fail(`landing.json: tier "${t.name}" link must start with https://`);
});
(landing.initiatives?.items || []).filter((x) => x.draft).forEach((x) => todo.push(`Copy to confirm: ${x.name} (landing.json → initiatives)`));

masajid.forEach((m, i) => {
  const at = `masajid.json #${i + 1} (${m.name})`;
  if (!m.name || !m.country) fail(`${at}: needs a name and a country`);
  if (m.lat != null && (typeof m.lat !== 'number' || m.lat < -90 || m.lat > 90)) fail(`${at}: lat must be between -90 and 90`);
  if (m.lng != null && (typeof m.lng !== 'number' || m.lng < -180 || m.lng > 180)) fail(`${at}: lng must be between -180 and 180`);
  photo('masajid', m.image, at);
});
projects.forEach((p, i) => {
  const at = `projects.json #${i + 1} (${p.title})`;
  photo('projects', p.before, at); photo('projects', p.after, at);
});
const phM = masajid.filter((m) => m.placeholder).length, phP = projects.filter((p) => p.placeholder).length;
if (phM) todo.push(`${phM} placeholder masajid (src/content/masajid.json)`);
if (phP) todo.push(`${phP} placeholder projects (src/content/projects.json)`);

if (todo.length) console.log(`Still to fill in:\n  - ${todo.join('\n  - ')}`);
if (errors.length) { console.error(`\nContent problems:\n  - ${errors.join('\n  - ')}`); process.exit(1); }
console.log('Content check passed.');
