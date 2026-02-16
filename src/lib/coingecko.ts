export interface CoinSearchResult {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
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
}

const BASE_URL = "https://api.coingecko.com/api/v3";

export async function searchTokens(query: string): Promise<CoinSearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  const res = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query.trim())}`);
  if (!res.ok) {
    if (res.status === 429) throw new Error("Rate limited — please wait a moment and try again.");
    throw new Error("Search failed. Please try again.");
  }

  const data = await res.json();
  return (data.coins ?? []).slice(0, 8).map((c: any) => ({
    id: c.id,
    name: c.name,
    symbol: c.symbol,
    thumb: c.thumb,
  }));
}

export async function fetchCoinData(coinId: string): Promise<CoinData> {
  const res = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=usd&ids=${encodeURIComponent(coinId)}&sparkline=false`
  );
  if (!res.ok) {
    if (res.status === 429) throw new Error("Rate limited — please wait a moment and try again.");
    throw new Error("Failed to fetch token data. Please try again.");
  }

  const data = await res.json();
  if (!data.length) throw new Error("Token not found.");

  const coin = data[0];
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
  };
}
