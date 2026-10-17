import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { DESTINATIONS } from '@/data/destinations';
export async function GET() {
  let html = await readFile(path.join(process.cwd(), 'public/landing/index.html'), 'utf8');
  const cards = DESTINATIONS.map(d => ({
    id: d.id, n: d.name, p: d.location, k: d.id === 'ngu-hanh-son' ? 'mountain' : 'dinh',
    c: ['Di sản', 'Lịch sử'], tag: 'Hành trình tương tác', dist: d.era,
    time: d.stats.recommendedTime, stops: d.checkpoints.length, lv: 'Khám phá',
    d: d.tagline, s: d.checkpoints.map(cp => cp.name)
  }));
  html = html.replace(/window\.VIEN_DATA = [\s\S]*?;<\/script>/,
    'window.VIEN_DATA = ' + JSON.stringify(cards).replace(/</g, '\\u003c') + ';</script>');
  html = html.replace('data-count="14"', `data-count="${cards.length}"`)
    .replace('data-count="5"', `data-count="${cards[0]?.stops || 0}"`);
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
