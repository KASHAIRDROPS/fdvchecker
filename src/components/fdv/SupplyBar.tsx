import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { CoinData } from "@/lib/coingecko";

interface SupplyBarProps {
  data: CoinData | null;
  loading?: boolean;
}

const SupplyBar = ({ data, loading }: SupplyBarProps) => {
  const circ = data?.circulating_supply ?? 0;
  const total = data?.max_supply ?? data?.total_supply ?? 0;
  const pct = total > 0 ? Math.round((circ / total) * 100) : 0;

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Circulating Supply</span>
          {loading ? <Skeleton className="h-3 w-8" /> : <span>{data ? `${pct}%` : "—%"}</span>}
        </div>
        <Progress value={data ? pct : 0} className="h-3 bg-secondary" />
        <div className="flex justify-between text-xs text-muted-foreground">
          {loading ? (
            <>
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-24" />
            </>
          ) : (
            <>
              <span>Circulating: {data ? circ.toLocaleString() : "—"}</span>
              <span>Max: {data ? (total > 0 ? total.toLocaleString() : "∞") : "—"}</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplyBar;
