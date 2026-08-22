import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

function cleanPoliticianName(raw) {
  if (!raw) return '';
  let str = raw.trim();
  if (str.includes(',')) {
    const parts = str.split(',').map(s => s.trim());
    if (parts.length === 2) {
      let [surname, rest] = parts;
      rest = rest.replace(/^(Shri|Smt\.|Smt|Dr\.|Dr|Prof\.|Prof|Kumari|Sri|Maulana|Haji|Advocate)\s+/i, '').trim();
      str = rest + ' ' + surname;
    }
  }
  str = str.replace(/([A-Za-z])\.([A-Za-z])/g, '$1. $2');
  str = str.replace(/\(.*?\)/g, ' ');
  str = str.replace(/^(Shri|Smt\.|Smt|Dr\.|Dr|Prof\.|Prof|Kumari|Sri|Maulana|Haji|Advocate|Sh\.)\s+/i, '');
  str = str.replace(/\bAlias\s+[A-Za-z]+/i, ' ');
  str = str.replace(/\s+/g, ' ').trim();
  return str;
}

async function fetchWikiSearch(cleanName, extraHint = '') {
  const query = `${cleanName} ${extraHint}`.trim();
  const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&prop=pageimages&pithumbsize=600&format=json`;
  
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'IndianParliamentDossier/3.0 (info@parliament-research.org)'
      }
    });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data?.query?.pages;
    if (pages) {
      const p = Object.values(pages)[0];
      if (p && p.thumbnail && p.thumbnail.source) {
        return {
          title: p.title,
          photoUrl: p.thumbnail.source
        };
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
}

async function run() {
  const cacheFile = path.join(rootDir, 'photo_cache.json');
  let cache = {};
  if (fs.existsSync(cacheFile)) {
    try {
      cache = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
    } catch (e) {}
  }

  const ls = JSON.parse(fs.readFileSync(path.join(rootDir, 'mps.json'), 'utf-8'));
  const rs = JSON.parse(fs.readFileSync(path.join(rootDir, 'rajya_sabha.json'), 'utf-8'));

  const pending = [];

  // Prioritize Lok Sabha sitting and Rajya Sabha members
  ls.forEach(m => {
    const clean = cleanPoliticianName(m.name);
    const key = clean.toLowerCase();
    const rawKey = m.name.toLowerCase().trim();
    if (!cache[key] && !cache[rawKey]) {
      pending.push({ name: clean, raw: m.name, hint: 'politician Indian MP' });
    }
  });

  rs.forEach(r => {
    const clean = cleanPoliticianName(r.name);
    const key = clean.toLowerCase();
    const rawKey = r.name.toLowerCase().trim();
    if (!cache[key] && !cache[rawKey]) {
      pending.push({ name: clean, raw: r.name, hint: 'Rajya Sabha' });
    }
  });

  console.log(`Starting deep search for ${pending.length} remaining members...`);

  let foundCount = 0;
  for (let i = 0; i < pending.length; i++) {
    const item = pending[i];
    const key = item.name.toLowerCase();
    const rawKey = item.raw.toLowerCase().trim();

    if (cache[key] || cache[rawKey]) continue;

    const result = await fetchWikiSearch(item.name, item.hint);
    if (result && result.photoUrl) {
      cache[key] = result.photoUrl;
      cache[rawKey] = result.photoUrl;
      cache[result.title.toLowerCase()] = result.photoUrl;
      foundCount++;
    }

    if (i % 50 === 0 && i > 0) {
      console.log(`Checked ${i}/${pending.length}. Added ${foundCount} new portraits. Total cache: ${Object.keys(cache).length}`);
      fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
    }

    // Delay to respect Wikipedia API limits
    await new Promise(r => setTimeout(r, 60));
  }

  fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
  console.log(`Done! Added ${foundCount} portraits. Total in cache: ${Object.keys(cache).length}`);
}

run();
