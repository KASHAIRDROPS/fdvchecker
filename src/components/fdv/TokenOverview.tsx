import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { CoinData } from "@/lib/coingecko";

interface TokenOverviewProps {
  data: CoinData | null;
  loading?: boolean;
}

const TokenOverview = ({ data, loading }: TokenOverviewProps) => {
  const change = data?.price_change_percentage_24h;
  const changeColor = change != null ? (change >= 0 ? "text-primary" : "text-destructive") : "";

  return (
    <Card className="bg-card border-primary/30 shadow-[0_0_15px_-3px_hsl(155_80%_44%/0.15)] animate-fade-in">
      <CardContent className="flex items-center gap-4 p-5">
        {loading ? (
          <Skeleton className="h-11 w-11 rounded-full shrink-0" />
        ) : data?.image ? (
          <img src={data.image} alt={data.name} className="h-11 w-11 rounded-full shrink-0" />
        ) : (
          <div className="h-11 w-11 rounded-full bg-secondary shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          {loading ? (
            <>
              <Skeleton className="h-5 w-28 mb-1.5" />
              <Skeleton className="h-3 w-14" />
            </>
          ) : (
            <>
              <p className="font-bold text-foreground truncate text-lg leading-tight">{data?.name ?? "—"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{data?.symbol ?? "Search a token"}</p>
            </>
          )}
        </div>
        <div className="text-right shrink-0">
          {loading ? (
            <>
              <Skeleton className="h-5 w-24 mb-1.5 ml-auto" />
              <Skeleton className="h-3 w-16 ml-auto" />
            </>
          ) : (
            <>
              <p className="font-bold text-foreground text-lg tabular-nums">
                {data ? `$${data.current_price.toLocaleString()}` : "—"}
              </p>
              <p className={`text-xs mt-0.5 font-medium ${changeColor || "text-muted-foreground"}`}>
                {change != null ? `${change >= 0 ? "+" : ""}${change.toFixed(2)}%` : "24h: —"}
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenOverview;
