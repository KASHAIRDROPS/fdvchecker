import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnimatedNumber } from "@/hooks/use-animated-number";
import { computeMetrics } from "@/lib/metrics";
import type { CoinData } from "@/lib/coingecko";

interface MetricsGridProps {
  data: CoinData | null;
  loading?: boolean;
}

function fmt(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

function fmtSupply(n: number): string {
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString();
}

const AnimatedMetric = ({
  label,
  rawValue,
  formatter,
  loading,
  delay,
}: {
  label: string;
  rawValue: number;
  formatter: (n: number) => string;
  loading?: boolean;
  delay: number;
}) => {
  const animated = useAnimatedNumber(rawValue);

  return (
    <Card className="bg-card border-border transition-shadow hover:shadow-md hover:shadow-primary/5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-4">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
        {loading ? (
          <Skeleton className="h-7 w-24 mt-2" />
        ) : (
          <p className="mt-2 text-xl font-bold text-foreground tabular-nums animate-fade-in">
            {rawValue > 0 ? formatter(animated) : "—"}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const MetricsGrid = ({ data, loading }: MetricsGridProps) => {
  const { marketCap, fdv, maxSupply } = computeMetrics(data);

  const metrics = [
    { label: "Fully Diluted Valuation", value: data ? fdv : 0, formatter: fmt },
    { label: "Market Cap", value: data ? marketCap : 0, formatter: fmt },
    { label: "Circulating Supply", value: data?.circulating_supply ?? 0, formatter: fmtSupply },
    { label: "Max Supply", value: data ? maxSupply : 0, formatter: fmtSupply },
  ];

  return (
    <section className="grid grid-cols-2 gap-3">
      {metrics.map((metric, i) => (
        <AnimatedMetric
          key={metric.label}
          label={metric.label}
          rawValue={metric.value}
          formatter={metric.formatter}
          loading={loading}
          delay={i * 75}
        />
      ))}
    </section>
  );
};

export default MetricsGrid;
