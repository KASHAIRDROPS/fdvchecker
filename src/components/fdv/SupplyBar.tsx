import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">Supply Breakdown</p>
          {loading ? (
            <Skeleton className="h-5 w-20" />
          ) : (
            <span className="text-sm font-semibold text-primary">
              {data ? `${pct}% unlocked` : "—"}
            </span>
          )}
        </div>

        {loading ? (
          <Skeleton className="h-4 w-full rounded-full" />
        ) : (
          <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${data ? pct : 0}%` }}
            />
          </div>
        )}

        <div className="flex justify-between text-xs">
          {loading ? (
            <>
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-28" />
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">
                  Circulating: {data ? fmtCompact(circ) : "—"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                <span className="text-muted-foreground">
                  Locked: {data ? (max > 0 ? `${locked}%` : "∞") : "—"}
                </span>
              </div>
            </>
          )}
        </div>

        {data && max > 0 && (
          <p className="text-xs text-muted-foreground">
            Max Supply: {fmtCompact(max)}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SupplyBar;
