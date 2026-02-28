import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity } from "lucide-react";
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

const MetricCard = ({
  label,
  value,
  subtitle,
  loading,
  icon,
}: {
  label: string;
  value: string;
  subtitle: string;
  loading?: boolean;
  icon?: React.ReactNode;
}) => {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</p>
        </div>
        {loading ? (
          <>
            <Skeleton className="h-7 w-24 mb-2" />
            <Skeleton className="h-3 w-32" />
          </>
        ) : (
          <>
            <p className="text-2xl font-bold text-foreground tabular-nums mb-1">
              {value}
            </p>
            <p className="text-xs text-muted-foreground">
              {subtitle}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const MetricsGrid = ({ data, loading }: MetricsGridProps) => {
  const { marketCap, fdv, ratio } = computeMetrics(data);
  const circ = data?.circulating_supply ?? 0;
  const total = data?.total_supply ?? 0;
  const max = data?.max_supply ?? total;
  const volume = data?.total_volume ?? 0;

  const circPct = total > 0 ? ((circ / total) * 100).toFixed(1) : "0";
  const tokensToUnlock = max > 0 ? ((max - circ) / max * 100).toFixed(1) : "0";
  const tokensToUnlockAmount = max > 0 ? max - circ : 0;
  const volumeRatio = marketCap > 0 ? ((volume / marketCap) * 100).toFixed(2) : "0";
  const fdvPremium = fdv - marketCap;

  const riskStatus = ratio !== null && ratio <= 1.5 ? "Healthy ratio" : ratio !== null && ratio <= 3 ? "Moderate risk" : "High dilution risk";

  const metrics = [
    {
      label: "FDV / MC RATIO",
      value: ratio !== null ? `${ratio.toFixed(2)}x` : "—",
      subtitle: riskStatus,
      icon: <Activity className="h-3.5 w-3.5 text-primary" />,
    },
    {
      label: "CIRCULATING SUPPLY",
      value: circ > 0 ? fmtSupply(circ) : "—",
      subtitle: `${circPct}% of total`,
      icon: null,
    },
    {
      label: "TOTAL SUPPLY",
      value: total > 0 ? fmtSupply(total) : "—",
      subtitle: max === total ? "No max supply" : "Max supply set",
      icon: null,
    },
    {
      label: "TOKENS TO UNLOCK",
      value: tokensToUnlock !== "0" ? `${tokensToUnlock}%` : "—",
      subtitle: tokensToUnlockAmount > 0 ? `${fmtSupply(tokensToUnlockAmount)} tokens` : "Fully unlocked",
      icon: null,
    },
    {
      label: "24H VOLUME",
      value: volume > 0 ? fmt(volume) : "—",
      subtitle: `${volumeRatio}% of MC`,
      icon: null,
    },
    {
      label: "FDV PREMIUM",
      value: fdvPremium > 0 ? fmt(fdvPremium) : "—",
      subtitle: "Potential dilution value",
      icon: null,
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3">
      {metrics.map((metric, i) => (
        <MetricCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          subtitle={metric.subtitle}
          loading={loading}
          icon={metric.icon}
        />
      ))}
    </section>
  );
};

export default MetricsGrid;
