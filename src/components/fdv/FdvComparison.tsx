import { Card, CardContent } from "@/components/ui/card";
import type { CoinData } from "@/lib/coingecko";

interface FdvComparisonProps {
  data: CoinData | null;
}

const FdvComparison = ({ data }: FdvComparisonProps) => {
  const fdv = data?.fully_diluted_valuation;
  const mc = data?.market_cap;
  const ratio = fdv && mc && mc > 0 ? (fdv / mc).toFixed(2) : null;

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4 space-y-2">
        <p className="text-xs text-muted-foreground">FDV / Market Cap Ratio</p>
        <p className="text-2xl font-bold text-foreground">{ratio ? `${ratio}x` : "—"}</p>
        <p className="text-xs text-muted-foreground">
          A ratio closer to 1 means most tokens are already in circulation.
        </p>
      </CardContent>
    </Card>
  );
};

export default FdvComparison;
