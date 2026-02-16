import { Card, CardContent } from "@/components/ui/card";
import type { CoinData } from "@/lib/coingecko";

interface MetricsGridProps {
  data: CoinData | null;
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

const MetricsGrid = ({ data }: MetricsGridProps) => {
  const metrics = [
    { label: "Fully Diluted Valuation", value: fmt(data?.fully_diluted_valuation) },
    { label: "Market Cap", value: fmt(data?.market_cap) },
    { label: "Circulating Supply", value: fmtSupply(data?.circulating_supply) },
    { label: "Total Supply", value: fmtSupply(data?.total_supply) },
  ];

  return (
    <section className="grid grid-cols-2 gap-3">
      {metrics.map((metric) => (
        <Card key={metric.label} className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{metric.label}</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{metric.value}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};

export default MetricsGrid;
