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
    <Card className="bg-card border-border">
      <CardContent className="flex items-center gap-4 p-4">
        {loading ? (
          <Skeleton className="h-10 w-10 rounded-full" />
        ) : data?.image ? (
          <img src={data.image} alt={data.name} className="h-10 w-10 rounded-full" />
        ) : (
          <div className="h-10 w-10 rounded-full bg-secondary" />
        )}
        <div className="flex-1 min-w-0">
          {loading ? (
            <>
              <Skeleton className="h-5 w-24 mb-1" />
              <Skeleton className="h-3 w-12" />
            </>
          ) : (
            <>
              <p className="font-semibold text-foreground truncate">{data?.name ?? "—"}</p>
              <p className="text-xs text-muted-foreground">{data?.symbol ?? "Search a token"}</p>
            </>
          )}
        </div>
        <div className="text-right">
          {loading ? (
            <>
              <Skeleton className="h-5 w-20 mb-1 ml-auto" />
              <Skeleton className="h-3 w-14 ml-auto" />
            </>
          ) : (
            <>
              <p className="font-semibold text-foreground">
                {data ? `$${data.current_price.toLocaleString()}` : "—"}
              </p>
              <p className={`text-xs ${changeColor || "text-muted-foreground"}`}>
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
