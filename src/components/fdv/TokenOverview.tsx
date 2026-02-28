import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import type { CoinData } from "@/lib/coingecko";
import { computeMetrics } from "@/lib/metrics";

interface TokenOverviewProps {
  data: CoinData | null;
  loading?: boolean;
}

function fmtCompact(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

const TokenOverview = ({ data, loading }: TokenOverviewProps) => {
  const change = data?.price_change_percentage_24h;
  const changeColor = change != null ? (change >= 0 ? "text-primary" : "text-destructive") : "";

  const { marketCap, fdv, ratio } = computeMetrics(data);
  const circ = data?.circulating_supply ?? 0;
  const max = data?.max_supply ?? data?.total_supply ?? 0;
  const pct = max > 0 ? (circ / max) * 100 : 0;

  // Determine risk level based on ratio
  let riskLabel = "—";
  let riskColor = "bg-muted-foreground";
  if (ratio !== null) {
    if (ratio <= 1.5) {
      riskLabel = "HEALTHY";
      riskColor = "bg-primary";
    } else if (ratio <= 3) {
      riskLabel = "MODERATE";
      riskColor = "bg-yellow-500";
    } else {
      riskLabel = "HIGH RISK";
      riskColor = "bg-destructive";
    }
  }

  return (
    <Card className="bg-card border-border animate-fade-in">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start gap-4">
          {loading ? (
            <Skeleton className="h-12 w-12 rounded-full shrink-0" />
          ) : data?.image ? (
            <img src={data.image} alt={data.name} className="h-12 w-12 rounded-full shrink-0" />
          ) : (
            <div className="h-12 w-12 rounded-full bg-secondary shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            {loading ? (
              <>
                <Skeleton className="h-5 w-32 mb-1.5" />
                <Skeleton className="h-8 w-24 mb-2" />
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-1">
                  {data?.name ?? "—"} <span className="uppercase font-medium">{data?.symbol ?? ""}</span>
                </p>
                <p className="font-bold text-foreground text-3xl tabular-nums mb-1">
                  {data ? `$${data.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
                </p>
                <p className={`text-sm font-medium ${changeColor || "text-muted-foreground"}`}>
                  {change != null ? `${change >= 0 ? "+" : ""}${change.toFixed(2)}%` : "—"}
                </p>
              </>
            )}
          </div>
          <div className="shrink-0">
            {loading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <div className={`${riskColor} text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5`}>
                {riskLabel !== "HEALTHY" && <AlertTriangle className="h-3 w-3" />}
                {riskLabel}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <>
            <Skeleton className="h-2 w-full rounded-full" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </>
        ) : data ? (
          <>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Market Cap</p>
                <p className="font-bold text-foreground">{fmtCompact(marketCap)}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground text-xs">FDV</p>
                <p className="font-bold text-foreground">{fmtCompact(fdv)}</p>
              </div>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default TokenOverview;
