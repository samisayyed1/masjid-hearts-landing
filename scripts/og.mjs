// Builds public/og.png, the image shown when the page link is shared. Run: node scripts/og.mjs
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
const dome = JSON.parse(readFileSync(new URL('../src/data/dome.json', import.meta.url)));
const logo = JSON.parse(readFileSync(new URL('../src/data/logo.json', import.meta.url)));
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><radialGradient id="g" cx="0.78" cy="0.35" r="0.8"><stop offset="0" stop-color="#0b6150"/><stop offset="0.45" stop-color="#00483D"/><stop offset="1" stop-color="#00332b"/></radialGradient>
  <radialGradient id="h"><stop offset="0" stop-color="#CFB083" stop-opacity="0.35"/><stop offset="1" stop-color="#CFB083" stop-opacity="0"/></radialGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <circle cx="1000" cy="300" r="240" fill="url(#h)"/>
  <svg x="850" y="140" width="300" height="310" viewBox="4400 4150 12200 12700"><g fill="#CFB083">${dome.hearts.map((d) => `<path d="${d}"/>`).join('')}<path d="${dome.finial}"/></g></svg>
  <svg x="72" y="58" width="190" height="81" viewBox="2900 7250 15250 6500"><path fill="#CFB083" fill-rule="evenodd" d="${logo.mark}"/><path fill="#FFFFFF" d="${logo.word}"/></svg>
  <g font-family="Playfair Display, Georgia, 'Times New Roman', serif" font-weight="700" fill="#FFFFFF">
    <text x="72" y="268" font-size="68">One Modest Gift.</text>
    <text x="72" y="356" font-size="68">Dozens of Mosques.</text>
    <text x="72" y="444" font-size="68" font-style="italic" font-weight="400" fill="#CFB083">Endless Sadaqah.</text>
  </g>
  <text x="72" y="534" font-family="Helvetica, Arial, sans-serif" font-size="27" fill="#e7d6b8" letter-spacing="1">Monthly Sadaqah Jariyah for dozens of masajid · from $10 a month</text>
</svg>`;
await sharp(Buffer.from(svg)).png().toFile('public/og.png');
console.log('public/og.png written');
