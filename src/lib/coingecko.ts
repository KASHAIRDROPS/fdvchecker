export interface CoinSearchResult {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
}

export interface PlatformInfo {
  chain: string;
  contract_address: string;
}

export interface CoinData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  fully_diluted_valuation: number | null;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  platforms: PlatformInfo[];
}

const BASE_URL = "https://api.coingecko.com/api/v3";

// Production-ready CORS proxies
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://proxy.cors.sh/',
];

// Get all possible URLs to try (direct + all proxies)
const getFetchUrls = (endpoint: string) => {
  const direct = `${BASE_URL}${endpoint}`;
  const proxied = CORS_PROXIES.map(proxy => `${proxy}${encodeURIComponent(direct)}`);
  return [direct, ...proxied];
};

// ============ IN-MEMORY CACHE IMPLEMENTATION ============

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Cache configuration
const CACHE_TTL = 60 * 1000; // 60 seconds in milliseconds
const coinGeckoCache = new Map<string, CacheEntry<any>>();

/**
 * Generate cache key from URL and parameters
 */
function getCacheKey(url: string): string {
  // Normalize URL by sorting query parameters for consistent keys
  try {
  const urlObj = new URL(url);
  const params = Array.from(urlObj.searchParams.entries())
     .sort((a, b) => a[0].localeCompare(b[0]))
     .map(([key, value]) => `${key}=${value}`)
     .join('&');
  return `${urlObj.pathname}?${params}`;
  } catch {
  return url;
  }
}

/**
 * Get cached data if still valid
 */
function getCachedData<T>(cacheKey: string): T | null {
  const entry = coinGeckoCache.get(cacheKey);
  
  if (!entry) {
  return null;
  }
  
  const age = Date.now() - entry.timestamp;
  
  if (age < CACHE_TTL) {
  console.log(`💾 Cache HIT (${Math.round(age/ 1000)}s old)`);
  return entry.data as T;
  }
  
  // Cache expired, remove it
  console.log(`🗑️ Cache EXPIRED (${Math.round(age/ 1000)}s old), removing...`);
  coinGeckoCache.delete(cacheKey);
  return null;
}

/**
 * Store data in cache
 */
function setCachedData<T>(cacheKey: string, data: T): void {
  const entry: CacheEntry<T> = {
   data,
   timestamp: Date.now(),
  };
  
  coinGeckoCache.set(cacheKey, entry);
  console.log(`💾 Cached response (valid for ${CACHE_TTL / 1000}s)`);
  
  // Log cache size occasionally
  if (coinGeckoCache.size % 10 === 0) {
  console.log(`📊 Cache size: ${coinGeckoCache.size} entries`);
  }
}

/**
 * Clear entire cache (useful for debugging or manual refresh)
 */
export function clearCache(): void {
  coinGeckoCache.clear();
  console.log('🧹 Cache cleared');
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number; keys: string[] } {
  const now = Date.now();
  const validEntries: string[] = [];
  
  coinGeckoCache.forEach((entry, key) => {
  const age = now - entry.timestamp;
  if (age < CACHE_TTL) {
     validEntries.push(`${key} (${Math.round(age / 1000)}s old)`);
   }
  });
  
  return {
   size: validEntries.length,
   keys: validEntries,
  };
}

// Debug: Test if API is reachable
export async function testApiConnection(): Promise<boolean> {
  try {
  const controller= new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    // Try direct connection first
  const response = await fetch(`${BASE_URL}/ping`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    
  return response.ok;
  } catch(error) {
 console.error('Direct API connection failed:', error.message);
  return false;
  }
}

// Fallback mock data for demo mode
export function getFallbackData(): CoinData {
 return {
   id: "bitcoin",
   name: "Bitcoin",
   symbol: "BTC",
   image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  current_price: 67432.50,
  price_change_percentage_24h: 2.34,
  market_cap: 1324567890123,
   fully_diluted_valuation: 1417890123456,
   circulating_supply: 19645312,
   total_supply: 21000000,
  max_supply: 21000000,
   platforms: [],
  };
}

async function fetchJson<T>(url: string, retries = 3): Promise<T> {
 // Generate cache key
 const cacheKey = getCacheKey(url);

 // Check cache first
 const cachedData = getCachedData<T>(cacheKey);
 if (cachedData) {
  return cachedData;
 }

console.log(`🌐 Fetching from API (cache miss)...`);
  
 let lastError: any;
  
  // Get all possible URLs to try (direct + 3 proxies = 4 total endpoints)
 const urls = getFetchUrls(url.replace(BASE_URL, ''));
  
 console.log(`   Endpoints to try: ${urls.length} (1 direct + ${CORS_PROXIES.length} proxies)`);
  
 for (let attempt = 1; attempt <= retries; attempt++) {
 console.log(`\n📡 Attempt ${attempt}/${retries}:`);
   
   // Try each URL in sequence
   for (const tryUrl of urls) {
     try {
     const controller= new AbortController();
     const timeoutId = setTimeout(() => controller.abort(), 10000);
       
     const isProxy = !tryUrl.includes(BASE_URL);
     const proxyName = CORS_PROXIES.find(p => tryUrl.includes(p)) || 'direct';
       
     console.log(`   → Trying ${proxyName === 'direct' ? '✅ Direct' : '🔗 ' + proxyName}...`);
       
     const res = await fetch(tryUrl, { signal: controller.signal });
       clearTimeout(timeoutId);
       
     if (!res.ok) {
       if (res.status === 429) {
           // Rate limited- handle gracefully with longer wait
        const waitTime= Math.min(3000 * Math.pow(2, attempt), 10000);
        console.log(`   ⏱️ Rate limited (429). Waiting ${waitTime/1000}s before retry...`);
        console.log(`   💡 Tip: This is why we have caching! Reducing API calls.`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          break; // Break inner loop, continue outer retry loop
         }
         throw new Error(`Request failed (${res.status}). Please try again.`);
       }
       
     const contentType = res.headers.get("content-type");
     if (!contentType?.includes("application/json")) {
       const text = await res.text();
       console.error(`   ❌ Expected JSON but got: ${contentType}`);
         throw new Error("Unexpected response from API. Please try again.");
       }
       
     console.log(`   ✅ Success with ${proxyName === 'direct' ? 'direct connection' : proxyName}!`);
      
      // Parse response
    const data = await res.json();
      
      // Cache the successful response
    setCachedData(cacheKey, data);
      
    return data;
     } catch(error: any) {
       lastError = error;
     const proxyName = CORS_PROXIES.find(p => tryUrl.includes(p)) || 'direct';
     console.log(`   ❌ Failed ${proxyName === 'direct' ? 'direct' : proxyName}: ${error.message.substring(0, 60)}`);
       // Continue to next URL
     }
   }
   
   // If all URLs failed and we have retries left, wait before trying again
  if (attempt < retries) {
   const waitTime= 1000 * attempt;
   console.log(`\n⏳ All endpoints failed. Retrying in ${waitTime}ms...\n`);
     await new Promise(resolve => setTimeout(resolve, waitTime));
   }
  }
  
 console.error('\n❌ All attempts failed. Using fallback data.');
  
  // If we have a rate limit error, provide helpful message
 if (lastError?.message?.includes('429')) {
 console.warn('💡 CoinGecko rate limit reached. Consider:');
 console.warn('   - Waiting a few minutes before refreshing');
 console.warn('   - The app will use cached data when available');
 console.warn('   - Demo mode will activate if this continues');
 }
  
 throw lastError || new Error("Network error — check your connection and try again.");
}

export async function searchTokens(query: string): Promise<CoinSearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  const data = await fetchJson<any>(`${BASE_URL}/search?query=${encodeURIComponent(query.trim())}`);
  return (data.coins ?? []).slice(0, 8).map((c: any) => ({
    id: c.id,
    name: c.name,
    symbol: c.symbol,
    thumb: c.thumb,
  }));
}

export async function fetchCoinData(coinId: string, skipDetail = false): Promise<CoinData> {
  // Fetch market data and detail (for platforms) in parallel
  const [marketData, detailData] = await Promise.all([
    fetchJson<any[]>(
      `${BASE_URL}/coins/markets?vs_currency=usd&ids=${encodeURIComponent(coinId)}&sparkline=false`
    ),
    skipDetail
      ? Promise.resolve(null)
      : fetchJson<any>(
          `${BASE_URL}/coins/${encodeURIComponent(coinId)}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false`
        ).catch(() => null),
  ]);

  if (!marketData.length) throw new Error("Token not found.");

  const coin = marketData[0];

  // Parse platforms from detail endpoint
  const platforms: PlatformInfo[] = [];
  if (detailData?.detail_platforms) {
    for (const [chain, info] of Object.entries<any>(detailData.detail_platforms)) {
      if (chain && chain !== "" && info?.contract_address) {
        platforms.push({
          chain: chain.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
          contract_address: info.contract_address,
        });
      }
    }
  }

  return {
    id: coin.id,
    name: coin.name,
    symbol: (coin.symbol ?? "").toUpperCase(),
    image: coin.image,
    current_price: coin.current_price,
    price_change_percentage_24h: coin.price_change_percentage_24h,
    market_cap: coin.market_cap,
    fully_diluted_valuation: coin.fully_diluted_valuation,
    circulating_supply: coin.circulating_supply,
    total_supply: coin.total_supply,
    max_supply: coin.max_supply ?? null,
    platforms,
  };
}
