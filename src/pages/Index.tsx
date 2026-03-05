import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/fdv/Header";
import SearchBar from "@/components/fdv/SearchBar";
import TokenOverview from "@/components/fdv/TokenOverview";
import MetricsGrid from "@/components/fdv/MetricsGrid";
import SupplyBar from "@/components/fdv/SupplyBar";
import FdvComparison from "@/components/fdv/FdvComparison";
import DilutionRiskLabel from "@/components/fdv/DilutionRiskLabel";
import FdvGapPercentage from "@/components/fdv/FdvGapPercentage";
import CirculatingSupplyPercentage from "@/components/fdv/CirculatingSupplyPercentage";
import Converter from "@/components/fdv/Converter";
import Footer from "@/components/fdv/Footer";
import { fetchCoinData, type CoinData, testApiConnection } from "@/lib/coingecko";
import { useRecentSearches } from "@/hooks/use-recent-searches";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const { recent, addRecent, clearRecent } = useRecentSearches();
  const handleSelect = useCallback(async (coinId: string, meta?: { name: string; symbol: string; thumb: string }) => {
    setLoading(true);
    setError(null);
    setCoinData(null);
    setSearchParams({ coin: coinId }, { replace: true });
    try {
      const data = await fetchCoinData(coinId);
      setCoinData(data);
      setLastUpdated(new Date());
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
    // Check API status on mount
    const checkApi = async () => {
      setApiStatus('checking');
      const isOnline = await testApiConnection();
      setApiStatus(isOnline ? 'online' : 'offline');
      console.log('CoinGecko API Status:', isOnline ? '✅ Online' : '❌ Offline');
    };
    checkApi();
  }, []);

  useEffect(() => {
    const coin = searchParams.get("coin") || "bitcoin";
    handleSelect(coin);
  }, []);

  // Auto-refresh price every 30s (markets only, skip detail to avoid rate limits)
  useEffect(() => {
    const coin = searchParams.get("coin");
    if (!coin) return;
    const interval = setInterval(async () => {
      try {
        const data = await fetchCoinData(coin, true);
        setCoinData(prev => prev ? { ...data, platforms: prev.platforms } : data);
        setLastUpdated(new Date());
      } catch {
        // silent fail on background refresh
      }
    }, 30_000);
    return () => clearInterval(interval);
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Header />
        <SearchBar onSelect={handleSelect} isLoading={loading} recentTokens={recent} onClearRecent={clearRecent} />

        {/* API Status Indicator */}
        {apiStatus === 'offline' && (
          <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-sm text-amber-500 animate-fade-in">
            <p className="font-semibold mb-1">⚠️ CoinGecko API is unreachable</p>
            <p className="text-xs text-muted-foreground">
              This could be due to: network issues, API downtime, or rate limiting.
              The app will automatically retry when the connection is restored.
            </p>
          </div>
        )}

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
          <TokenOverview data={coinData} loading={loading} lastUpdated={lastUpdated} />
          
          {/* Metrics Grid - Already responsive */}
          <MetricsGrid data={coinData} loading={loading} />
          
          {/* Supply Breakdown */}
          <SupplyBar data={coinData} loading={loading} />
          
          {/* Responsive Grid for Additional Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <CirculatingSupplyPercentage data={coinData} loading={loading} />
            <FdvComparison data={coinData} loading={loading} />
            <DilutionRiskLabel data={coinData} loading={loading} />
            <FdvGapPercentage data={coinData} loading={loading} />
          </div>
          
          <Converter data={coinData} loading={loading} />
        </div>

        <Footer />
      </div>
    </main>
  );
};

export default Index;
