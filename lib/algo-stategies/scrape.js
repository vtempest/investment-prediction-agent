import axios from 'axios';
import fs from 'node:fs';
import path from 'node:path';

const CACHE_PATH = path.join(process.cwd(), 'tv_scripts_cache.json');

function loadCache() {
  if (!fs.existsSync(CACHE_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf8');
}

// --- Fetch scripts using TradingView's JSON API ---

async function fetchScriptsPage(page = 1) {
  // Use TradingView's component-data-only JSON API endpoint
  const url = page === 1 
    ? 'https://www.tradingview.com/scripts/?component-data-only=1'
    : `https://www.tradingview.com/scripts/page-${page}/?component-data-only=1`;

  const res = await axios.get(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'application/json'
    }
  });

  const jsonData = res.data;
  
  // Extract the ideas array from the JSON response
  const items = jsonData?.data?.ideas?.data?.items || [];

  const ideas = items.map(item => {
    // Extract user information
    const author_name = item.user?.username || null;
    
    // Build the full URL
    const url = item.chart_url || `https://www.tradingview.com/script/${item.image_url}/`;
    
    // Extract counts
    const likes_count = item.likes_count || 0;
    const comments_count = item.comments_count || 0;
    const views_count = item.views_count || 0;
    
    // Extract dates
    const created_at = item.created_at || null;
    const updated_at = item.updated_at || null;
    
    return {
      id: item.id,
      url,
      name: item.name || null,
      description: item.description || null,
      author_name,
      likes_count,
      comments_count,
      views_count,
      created_at,
      updated_at,
      script_type: item.script_type || null,
      script_access: item.script_access || null,
      is_hot: item.is_hot || false,
      is_picked: item.is_picked || false,
      symbol: item.symbol || null
    };
  });

  return ideas;
}





async function enrichWithPineFacade(idea, cache) {
  if (cache[idea.url] && cache[idea.url].pine_facade_data) {
    return cache[idea.url];
  }

  try {
    const res = await axios.get(idea.url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    const html = res.data;

    const m = html.match(
      /"script_id_part"\s*:\s*"([^"]+)"(?:[^}]+?"version_maj"\s*:\s*(\d+))?/
    ); // [web:40][file:22]
    if (!m) {
      console.log(`No script_id_part found for ${idea.url}`);
      return idea;
    }

    const scriptIdPart = m[1];
    const versionMaj = m[2] ? Number(m[2]) : 3;
    const encodedId = encodeURIComponent(scriptIdPart);

    const pineUrl = `https://pine-facade.tradingview.com/pine-facade/get/${encodedId}/${versionMaj}?no_4xx=true`; // [web:40][web:43]
    console.log(
      `Fetching pine-facade for ${idea.url} -> ${scriptIdPart} (version_maj=${versionMaj})`
    );

    const pineRes = await axios.get(pineUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    const pineData = pineRes.data; // [web:40]
    let { created, updated, scriptName, source } = pineData;

    created = new Date(created).toISOString().split('T')[0];
    updated = new Date(updated).toISOString().split('T')[0];

    const enriched = {
      ...idea, // keeps likes_count, comments_count, etc.
        created,
        updated,
        source
    };

    cache[idea.url] = enriched;
    console.log(`Enriched ${idea.url}`);

    return enriched;
  } catch (err) {
    console.log(`Error enriching ${idea.url}: ${err.message}`);
    return idea;
  }
}



async function run() {
  const cache = loadCache();

  const pageNums = [1, 2];
  const allIdeas = [];
  for (const p of pageNums) {
    const ideas = await fetchScriptsPage(p);
    allIdeas.push(...ideas);
  }

  const results = [];
  for (const idea of allIdeas) {
    const enriched = await enrichWithPineFacade(idea, cache);
    results.push(enriched);
    // periodic cache flush
    if (results.length % 10 === 0) saveCache(cache);
  }

  // final cache save
  saveCache(cache);

  // also write a snapshot of this run
  fs.writeFileSync(
    path.join(process.cwd(), 'tv_scripts_run.json'),
    JSON.stringify(results, null, 2),
    'utf8'
  );

  console.log(`Done. Total items: ${results.length}`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
