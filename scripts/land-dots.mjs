// Builds src/data/land.json: a grid of dots that sit on land, for the live day-and-night map.
// Run once with `node scripts/land-dots.mjs`; the output is committed.
import { readFileSync, writeFileSync } from 'node:fs';
import { feature } from 'topojson-client';
import { geoContains } from 'd3-geo';

const world = JSON.parse(readFileSync(new URL('../node_modules/world-atlas/land-50m.json', import.meta.url)));
const land = feature(world, world.objects.land);
const STEP = 2; // degrees between dots
const LAT_MAX = 76, LAT_MIN = -56;
const rows = [];
for (let lat = LAT_MAX; lat >= LAT_MIN; lat -= STEP) {
  let bits = '';
  for (let lon = -180 + STEP / 2; lon < 180; lon += STEP) bits += geoContains(land, [lon, lat]) ? '1' : '0';
  rows.push(bits);
}
// Each row is stored as hex to keep the file small.
const hex = rows.map((r) => r.padEnd(Math.ceil(r.length / 4) * 4, '0').match(/.{4}/g).map((n) => parseInt(n, 2).toString(16)).join(''));
writeFileSync(new URL('../src/data/land.json', import.meta.url), JSON.stringify({ step: STEP, latMax: LAT_MAX, cols: 360 / STEP, rows: hex }));
console.log('rows', rows.length, 'dots', rows.join('').split('').filter((c) => c === '1').length);
