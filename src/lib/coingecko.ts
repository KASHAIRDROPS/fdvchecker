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

// Debug: Test if API is reachable
export async function testApiConnection(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${BASE_URL}/ping`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    
    return response.ok;
  } catch {
    return false;
  }
}

async function fetchJson<T>(url: string, retries = 3): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 429) {
          // Rate limited - wait and retry
          const waitTime = Math.min(1000 * Math.pow(2, attempt), 5000);
          console.log(`Rate limited. Waiting ${waitTime}ms before retry ${attempt}/${retries}`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        throw new Error(`Request failed (${res.status}). Please try again.`);
      }
      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const text = await res.text();
        console.error("Expected JSON but got:", contentType, text.substring(0, 200));
        throw new Error("Unexpected response from API. Please try again.");
      }
      return res.json();
    } catch (error: any) {
      lastError = error;
      // If it's a network error and we have retries left, wait and retry
      if (!error.message.includes("Network error") || attempt === retries) {
        break;
      }
      const waitTime = 500 * attempt;
      console.log(`Network error. Retrying in ${waitTime}ms (attempt ${attempt}/${retries})...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
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
