// Sun position and prayer times, calculated in the browser from the date alone.
// Formulas: the standard low-precision solar coordinates (accurate to about a minute),
// with Muslim World League angles: Fajr 18°, Isha 17°, Asr shadow factor 1.

const rad = Math.PI / 180;
const deg = 180 / Math.PI;

/** Solar declination (degrees) and equation of time (hours) for a moment. */
export function solar(date: Date) {
  const d = date.getTime() / 86400000 + 2440587.5 - 2451545.0;
  const g = (357.529 + 0.98560028 * d) * rad;
  const q = 280.459 + 0.98564736 * d;
  const L = (q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * rad;
  const e = (23.439 - 0.00000036 * d) * rad;
  const ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L)) * deg / 15;
  const decl = Math.asin(Math.sin(e) * Math.sin(L)) * deg;
  let eqt = q / 15 - ra;
  eqt = ((eqt % 24) + 36) % 24 - 12; // wrap to −12..12 hours
  return { decl, eqt };
}

/** Where the sun is directly overhead right now. */
export function subsolar(date: Date) {
  const { decl, eqt } = solar(date);
  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  let lon = -15 * (utcHours - 12 + eqt);
  lon = ((lon + 540) % 360) - 180;
  return { lat: decl, lon };
}

/** Sun altitude in degrees at a place, given the subsolar point. */
export function altitude(lat: number, lon: number, sun: { lat: number; lon: number }) {
  const h = (lon - sun.lon) * rad;
  const v = Math.sin(lat * rad) * Math.sin(sun.lat * rad) + Math.cos(lat * rad) * Math.cos(sun.lat * rad) * Math.cos(h);
  return Math.asin(Math.max(-1, Math.min(1, v))) * deg;
}

export const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
export type Prayer = (typeof PRAYERS)[number];

/** Hours from solar noon until the sun reaches `alt` degrees, or null if it never does that day. */
function hourAngle(alt: number, lat: number, decl: number) {
  const c = (Math.sin(alt * rad) - Math.sin(lat * rad) * Math.sin(decl * rad)) / (Math.cos(lat * rad) * Math.cos(decl * rad));
  if (c < -1 || c > 1) return null;
  return Math.acos(c) * deg / 15;
}

/** The five prayer start times (as Dates) for the UTC day containing `day`. */
export function prayerTimes(day: Date, lat: number, lon: number): { prayer: Prayer; at: Date }[] {
  const midnight = Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate());
  const { decl, eqt } = solar(new Date(midnight + 12 * 3600000 - (lon / 15) * 3600000));
  const noon = 12 - lon / 15 - eqt; // UTC hours
  const at = (h: number) => new Date(midnight + h * 3600000);
  const out: { prayer: Prayer; at: Date }[] = [];
  const fajr = hourAngle(-18, lat, decl);
  const asrAlt = Math.atan(1 / (1 + Math.tan(Math.abs(lat - decl) * rad))) * deg;
  const asr = hourAngle(asrAlt, lat, decl);
  const sunset = hourAngle(-0.833, lat, decl);
  const isha = hourAngle(-17, lat, decl);
  if (fajr !== null) out.push({ prayer: 'Fajr', at: at(noon - fajr) });
  out.push({ prayer: 'Dhuhr', at: at(noon + 2 / 60) });
  if (asr !== null) out.push({ prayer: 'Asr', at: at(noon + asr) });
  if (sunset !== null) out.push({ prayer: 'Maghrib', at: at(noon + sunset) });
  if (isha !== null) out.push({ prayer: 'Isha', at: at(noon + isha) });
  return out;
}

export interface City { name: string; country: string; lat: number; lon: number; tz: string }

/** For each prayer, the city where it began most recently before `now`. */
export function latestAdhans(now: Date, cities: City[]) {
  const best = new Map<Prayer, { city: City; at: Date }>();
  for (const city of cities) {
    for (const offset of [-1, 0, 1]) {
      const day = new Date(now.getTime() + offset * 86400000);
      for (const p of prayerTimes(day, city.lat, city.lon)) {
        if (p.at > now) continue;
        const cur = best.get(p.prayer);
        if (!cur || p.at > cur.at) best.set(p.prayer, { city, at: p.at });
      }
    }
  }
  return PRAYERS.filter((p) => best.has(p)).map((p) => ({ prayer: p, ...best.get(p)! }));
}
