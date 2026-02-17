import type { CoinData } from "@/lib/coingecko";

export interface ComputedMetrics {
  marketCap: number;
  fdv: number;
  ratio: number | null;
  maxSupply: number;
}

export function computeMetrics(data: CoinData | null): ComputedMetrics {
  if (!data) return { marketCap: 0, fdv: 0, ratio: null, maxSupply: 0 };

  const price = data.current_price ?? 0;
  const circ = data.circulating_supply ?? 0;
  const max = data.max_supply ?? data.total_supply ?? circ;

  const marketCap = price * circ;
  const fdv = price * max;
  const ratio = marketCap > 0 ? fdv / marketCap : null;

  return { marketCap, fdv, ratio, maxSupply: max };
}
