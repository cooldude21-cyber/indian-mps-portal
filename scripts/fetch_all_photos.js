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
  const hist = JSON.parse(fs.readFileSync(path.join(rootDir, 'historical_leaders.json'), 'utf-8'));

  const nameMap = new Map(); // cleanName -> [raw variations]

  const addName = (raw) => {
    if (!raw) return;
    const clean = cleanPoliticianName(raw);
    if (!clean || clean.length < 3) return;
    const lower = clean.toLowerCase();
    if (!nameMap.has(lower)) {
      nameMap.set(lower, { clean, raws: new Set([raw]) });
    } else {
      nameMap.get(lower).raws.add(raw);
    }
  };

  hist.forEach(h => addName(h.name));
  ls.forEach(m => addName(m.name));
  rs.forEach(r => addName(r.name));

  console.log(`Total unique names to resolve: ${nameMap.size}. Existing cached: ${Object.keys(cache).length}`);

  const uncached = [];
  for (const [lower, item] of nameMap.entries()) {
    if (!cache[lower] || !cache[lower].startsWith('http')) {
      uncached.push(item);
    }
  }

  console.log(`Uncached names to query in batches: ${uncached.length}`);

  // Batch query 40 titles at a time
  const batchSize = 40;
  let addedCount = 0;

  for (let i = 0; i < uncached.length; i += batchSize) {
    const batch = uncached.slice(i, i + batchSize);
    const titles = batch.map(b => b.clean).join('|');
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(titles)}&prop=pageimages&pithumbsize=600&format=json`;

    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'IndianParliamentDossier/2.0 (parliament-dossier@archive.org)'
        }
      });
      if (res.ok) {
        const data = await res.json();
        const pages = data?.query?.pages || {};
        for (const p of Object.values(pages)) {
          if (p.title && p.thumbnail && p.thumbnail.source) {
            const photoUrl = p.thumbnail.source;
            const lowerTitle = p.title.toLowerCase();
            cache[lowerTitle] = photoUrl;
            
            // Map against batch items
            for (const item of batch) {
              if (item.clean.toLowerCase() === lowerTitle || item.clean.toLowerCase().includes(lowerTitle) || lowerTitle.includes(item.clean.toLowerCase())) {
                cache[item.clean.toLowerCase()] = photoUrl;
                for (const raw of item.raws) {
                  cache[raw.toLowerCase().trim()] = photoUrl;
                }
              }
            }
            addedCount++;
          }
        }
      }
    } catch (err) {
      console.warn(`Batch ${i} error:`, err.message);
    }

    if (i % 200 === 0 && i > 0) {
      console.log(`Progress: ${i}/${uncached.length} processed. Photos found so far: ${addedCount}`);
      fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
    }

    // Brief delay to be polite to Wikipedia
    await new Promise(resolve => setTimeout(resolve, 150));
  }

  fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
  console.log(`Finished Batch Pass 1. Total photos in cache: ${Object.keys(cache).length} (New added: ${addedCount})`);
}

run();
