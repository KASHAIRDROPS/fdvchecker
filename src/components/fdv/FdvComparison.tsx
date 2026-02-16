import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { CoinData } from "@/lib/coingecko";

interface FdvComparisonProps {
  data: CoinData | null;
  loading?: boolean;
}

function getInsight(ratio: number | null, name?: string): string {
  const token = name ?? "This token";
  if (!ratio) return "Search a token to see how its FDV compares to Market Cap.";
  if (ratio <= 1.05) return `${token}'s FDV is nearly equal to its Market Cap — almost all tokens are already circulating.`;
  if (ratio <= 1.5) return `${token} has a small amount of supply yet to unlock, so its FDV is slightly above Market Cap.`;
  if (ratio <= 3) return `${token}'s FDV is noticeably higher than Market Cap — a significant portion of tokens are not yet in circulation.`;
  return `${token}'s FDV is much larger than its Market Cap — most of the total supply has not entered circulation yet.`;
}

const FdvComparison = ({ data, loading }: FdvComparisonProps) => {
  const price = data?.current_price ?? 0;
  const mc = price * (data?.circulating_supply ?? 0);
  const fdv = price * (data?.max_supply ?? data?.total_supply ?? 0);
  const ratioNum = data && mc > 0 ? fdv / mc : null;
  const ratioStr = ratioNum ? ratioNum.toFixed(2) : null;

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4 space-y-2">
        <p className="text-xs text-muted-foreground">FDV / Market Cap Ratio</p>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <p className="text-2xl font-bold text-foreground">{ratioStr ? `${ratioStr}x` : "—"}</p>
        )}
        {loading ? (
          <Skeleton className="h-4 w-full" />
        ) : (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {getInsight(ratioNum, data?.name)}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default FdvComparison;
