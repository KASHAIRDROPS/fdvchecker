import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { computeMetrics } from "@/lib/metrics";
import type { CoinData } from "@/lib/coingecko";

interface FdvGapPercentageProps {
  data: CoinData | null;
  loading?: boolean;
}

const FdvGapPercentage = ({ data, loading }: FdvGapPercentageProps) => {
  const { gapPercentage } = computeMetrics(data);

  const formatGap = (value: number | null): string => {
    if (value === null || value === undefined) return "—";
    const sign = value >= 0 ? "+" : "−";
    const absValue = Math.abs(value);
    return `${sign}${absValue.toFixed(2)}%`;
  };

  const getGapColor = (value: number | null): string => {
    if (value === null || value === undefined) return "text-foreground";
    if (value <= 5) return "text-green-600 dark:text-green-400";
    if (value <= 20) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Card className="bg-card border-border animate-fade-in">
      <CardContent className="p-5 space-y-3">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">FDV Gap Percentage</p>
        {loading ? (
          <Skeleton className="h-9 w-24" />
        ) : (
          <p className={`text-3xl font-semibold font-mono tabular-nums ${getGapColor(gapPercentage)}`}>
            {formatGap(gapPercentage)}
          </p>
        )}
        {loading ? (
          <Skeleton className="h-3 w-full" />
        ) : (
          <p className="text-xs text-muted-foreground leading-relaxed">
            Represents how much higher the fully diluted valuation is compared to current market cap.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default FdvGapPercentage;
