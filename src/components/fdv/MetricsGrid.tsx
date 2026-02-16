import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { CoinData } from "@/lib/coingecko";

interface MetricsGridProps {
  data: CoinData | null;
  loading?: boolean;
}

function fmt(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toLocaleString()}`;
}

function fmtSupply(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  return n.toLocaleString();
}

const MetricsGrid = ({ data, loading }: MetricsGridProps) => {
  const price = data?.current_price ?? 0;
  const calculatedMarketCap = price * (data?.circulating_supply ?? 0);
  const calculatedFdv = price * (data?.max_supply ?? data?.total_supply ?? 0);

  const metrics = [
    { label: "Fully Diluted Valuation", value: fmt(data ? calculatedFdv : null) },
    { label: "Market Cap", value: fmt(data ? calculatedMarketCap : null) },
    { label: "Circulating Supply", value: fmtSupply(data?.circulating_supply) },
    { label: "Max Supply", value: fmtSupply(data?.max_supply) },
  ];

  return (
    <section className="grid grid-cols-2 gap-3">
      {metrics.map((metric) => (
        <Card key={metric.label} className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{metric.label}</p>
            {loading ? (
              <Skeleton className="h-6 w-20 mt-1" />
            ) : (
              <p className="mt-1 text-lg font-semibold text-foreground">{metric.value}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </section>
  );
};

export default MetricsGrid;
