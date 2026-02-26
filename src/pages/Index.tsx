import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/fdv/Header";
import SearchBar from "@/components/fdv/SearchBar";
import TokenOverview from "@/components/fdv/TokenOverview";
import MetricsGrid from "@/components/fdv/MetricsGrid";
import SupplyBar from "@/components/fdv/SupplyBar";
import FdvComparison from "@/components/fdv/FdvComparison";
import Footer from "@/components/fdv/Footer";
import { fetchCoinData, type CoinData } from "@/lib/coingecko";
import { useRecentSearches } from "@/hooks/use-recent-searches";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { recent, addRecent, clearRecent } = useRecentSearches();
  const handleSelect = useCallback(async (coinId: string, meta?: { name: string; symbol: string; thumb: string }) => {
    setLoading(true);
    setError(null);
    setCoinData(null);
    setSearchParams({ coin: coinId }, { replace: true });
    try {
      const data = await fetchCoinData(coinId);
      setCoinData(data);
      addRecent({
        id: coinId,
        name: meta?.name ?? data.name,
        symbol: meta?.symbol ?? data.symbol,
        thumb: meta?.thumb ?? data.image,
      });
    } catch (e: any) {
      setError(e.message || "Token not found");
      setCoinData(null);
    } finally {
      setLoading(false);
    }
  }, [setSearchParams, addRecent]);

  useEffect(() => {
    const coin = searchParams.get("coin") || "bitcoin";
    handleSelect(coin);
  }, []);

  // Auto-refresh price every 30s
  useEffect(() => {
    const coin = searchParams.get("coin");
    if (!coin) return;
    const interval = setInterval(async () => {
      try {
        const data = await fetchCoinData(coin);
        setCoinData(data);
      } catch {
        // silent fail on background refresh
      }
    }, 30_000);
    return () => clearInterval(interval);
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-md px-4 sm:px-6 py-2 space-y-5">
        <Header />
        <SearchBar onSelect={handleSelect} isLoading={loading} recentTokens={recent} onClearRecent={clearRecent} />

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive animate-fade-in flex items-center justify-between gap-3">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => handleSelect(searchParams.get("coin") || "bitcoin")}
              className="shrink-0 text-xs font-medium underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        <div className="space-y-4">
          <TokenOverview data={coinData} loading={loading} />
          <MetricsGrid data={coinData} loading={loading} />
          <SupplyBar data={coinData} loading={loading} />
          <FdvComparison data={coinData} loading={loading} />
        </div>

        <Footer />
      </div>
    </main>
  );
};

export default Index;
