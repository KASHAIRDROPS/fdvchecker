import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnimatedNumber } from "@/hooks/use-animated-number";
import type { CoinData } from "@/lib/coingecko";

interface SupplyBarProps {
  data: CoinData | null;
  loading?: boolean;
}

function fmtCompact(n: number): string {
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString();
}

const SupplyBar = ({ data, loading }: SupplyBarProps) => {
  const circ = data?.circulating_supply ?? 0;
  const max = data?.max_supply ?? data?.total_supply ?? 0;
  const pct = max > 0 ? Math.round((circ / max) * 100) : 0;
  const locked = max > 0 ? 100 - pct : 0;
  const animatedPct = useAnimatedNumber(data ? pct : 0, 800);

  return (
    <Card className="bg-card border-border animate-fade-in">
      <CardContent className="p-4 sm:p-5 space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold tracking-tight text-foreground">Supply Breakdown</p>
          {loading ? (
            <Skeleton className="h-5 w-20 sm:w-24 shrink-0" />
          ) : (
            <span className="text-sm font-semibold text-primary font-mono tabular-nums shrink-0 whitespace-nowrap">
              {data ? `${pct}% unlocked` : "—"}
            </span>
          )}
        </div>

        {loading ? (
          <Skeleton className="h-5 w-full rounded-full" />
        ) : (
          <div className="relative h-5 w-full overflow-hidden rounded-full bg-secondary shrink-0">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
              style={{ width: `${animatedPct}%` }}
            />
            {data && pct > 8 && (
              <span className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-[11px] font-semibold font-mono text-primary-foreground truncate px-2">
                {Math.round(animatedPct)}%
              </span>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0 text-xs">
          {loading ? (
            <>
              <Skeleton className="h-3 w-full sm:w-28" />
              <Skeleton className="h-3 w-full sm:w-28" />
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="h-2.5 w-2.5 rounded-full bg-primary shrink-0" />
                <span className="text-muted-foreground truncate">
                  Circulating: <span className="font-medium text-foreground">{data ? fmtCompact(circ) : "—"}</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 min-w-0 sm:mt-0 mt-0.5">
                <span className="h-2.5 w-2.5 rounded-full bg-secondary border border-border shrink-0" />
                <span className="text-muted-foreground truncate">
                  Locked: <span className="font-medium text-foreground">{data ? (max > 0 ? `${locked}%` : "∞") : "—"}</span>
                </span>
              </div>
            </>
          )}
        </div>

        {data && max > 0 && (
          <p className="text-[11px] text-muted-foreground pt-2 sm:pt-3 border-t border-border">
            Max Supply: <span className="font-medium text-foreground">{fmtCompact(max)}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SupplyBar;
