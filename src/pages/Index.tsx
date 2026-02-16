import { useState } from "react";
import Header from "@/components/fdv/Header";
import SearchBar from "@/components/fdv/SearchBar";
import TokenOverview from "@/components/fdv/TokenOverview";
import MetricsGrid from "@/components/fdv/MetricsGrid";
import SupplyBar from "@/components/fdv/SupplyBar";
import FdvComparison from "@/components/fdv/FdvComparison";
import Footer from "@/components/fdv/Footer";
import { fetchCoinData, type CoinData } from "@/lib/coingecko";

const Index = () => {
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = async (coinId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCoinData(coinId);
      setCoinData(data);
    } catch (e: any) {
      setError(e.message || "Token not found");
      setCoinData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-md px-4 py-2 space-y-4">
        <Header />
        <SearchBar onSelect={handleSelect} isLoading={loading} />

        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <TokenOverview data={coinData} />
        <MetricsGrid data={coinData} />
        <SupplyBar data={coinData} />
        <FdvComparison data={coinData} />
        <Footer />
      </div>
    </main>
  );
};

export default Index;
