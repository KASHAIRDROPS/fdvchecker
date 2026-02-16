import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { CoinData } from "@/lib/coingecko";

interface FdvComparisonProps {
  data: CoinData | null;
  loading?: boolean;
}

const FdvComparison = ({ data, loading }: FdvComparisonProps) => {
  const price = data?.current_price ?? 0;
  const mc = price * (data?.circulating_supply ?? 0);
  const fdv = price * (data?.max_supply ?? data?.total_supply ?? 0);
  const ratio = data && mc > 0 ? (fdv / mc).toFixed(2) : null;

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4 space-y-2">
        <p className="text-xs text-muted-foreground">FDV / Market Cap Ratio</p>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <p className="text-2xl font-bold text-foreground">{ratio ? `${ratio}x` : "—"}</p>
        )}
        <p className="text-xs text-muted-foreground">
          A ratio closer to 1 means most tokens are already in circulation.
        </p>
      </CardContent>
    </Card>
  );
};

export default FdvComparison;
