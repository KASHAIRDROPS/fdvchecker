import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnimatedNumber } from "@/hooks/use-animated-number";
import type { CoinData } from "@/lib/coingecko";

interface CirculatingSupplyPercentageProps {
  data: CoinData | null;
  loading?: boolean;
}

const CirculatingSupplyPercentage = ({ data, loading }: CirculatingSupplyPercentageProps) => {
  const circ = data?.circulating_supply ?? 0;
  const max = data?.max_supply ?? data?.total_supply ?? 0;
  const pct = max > 0 ? (circ / max) * 100 : null;
  const animatedPct = useAnimatedNumber(data && pct ? pct : 0, 800);

  return (
    <Card className="bg-card border-border animate-fade-in">
      <CardContent className="p-4 sm:p-5 space-y-2.5 sm:space-y-3">
        <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-muted-foreground">Circulating Supply</p>
        {loading ? (
          <Skeleton className="h-9 w-24" />
        ) : (
          <p className="text-2xl sm:text-3xl font-semibold font-mono tabular-nums break-all text-foreground">
            {pct !== null ? `${animatedPct.toFixed(1)}%` : "—"}
          </p>
        )}
        {loading ? (
          <Skeleton className="h-3.5 w-full" />
        ) : (
          <>
            <p className="text-xs text-muted-foreground leading-relaxed break-words">
              Percentage of total token supply currently circulating.
            </p>
            {data && max > 0 && (
              <p className="text-[10px] text-muted-foreground/70 font-mono tabular-nums break-all">
                {circ.toLocaleString(undefined, { maximumFractionDigits: 0 })} / {max.toLocaleString(undefined, { maximumFractionDigits: 0 })} tokens
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CirculatingSupplyPercentage;
