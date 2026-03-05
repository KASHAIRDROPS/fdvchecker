import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import type { CoinData } from "@/lib/coingecko";

interface TokenOverviewProps {
  data: CoinData | null;
  loading?: boolean;
  lastUpdated?: Date | null;
}

const shortenAddress = (addr: string) =>
  addr.length > 14 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;

const TokenOverview = ({ data, loading, lastUpdated }: TokenOverviewProps) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const change = data?.price_change_percentage_24h;
  const changeColor = change != null ? (change >= 0 ? "text-primary" : "text-destructive") : "";

  const platforms = data?.platforms ?? [];
  const visiblePlatforms = showAll ? platforms : platforms.slice(0, 2);

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopied(addr);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <Card className="bg-card border-primary/30 shadow-[0_0_15px_-3px_hsl(155_80%_44%/0.15)] animate-fade-in">
      <CardContent className="p-4 sm:p-5 space-y-3 sm:space-y-4">
        {/* Token Header - Responsive Layout */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          {/* Token Logo */}
          {loading ? (
            <Skeleton className="h-11 w-11 rounded-full shrink-0" />
          ) : data?.image ? (
            <img src={data.image} alt={data.name} className="h-11 w-11 rounded-full shrink-0" />
          ) : (
            <div className="h-11 w-11 rounded-full bg-secondary shrink-0" />
          )}
          
          {/* Token Name & Symbol */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <>
                <Skeleton className="h-5 w-28 mb-1.5" />
                <Skeleton className="h-3 w-14" />
              </>
            ) : (
              <>
                <p className="font-semibold text-foreground truncate text-lg leading-tight">
                  {data?.name ?? "—"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">
                  {data?.symbol ?? "Search a token"}
                </p>
              </>
            )}
          </div>
          
          {/* Price & Change - Right Aligned */}
          <div className="w-full sm:w-auto text-left sm:text-right shrink-0">
            {loading ? (
              <>
                <Skeleton className="h-5 w-24 mb-1.5" />
                <Skeleton className="h-3 w-16" />
              </>
            ) : (
              <>
                <p className="font-semibold text-foreground text-lg sm:text-xl font-mono tabular-nums truncate">
                  {data ? `$${data.current_price.toLocaleString()}` : "—"}
                </p>
                <p className={`text-xs sm:text-sm mt-0.5 font-medium ${changeColor || "text-muted-foreground"}`}>
                  {change != null ? `${change >= 0 ? "+" : ""}${change.toFixed(2)}%` : "24h: —"}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Contract addresses & chains */}
        {!loading && platforms.length > 0 && (
          <div className="space-y-1.5 pt-1 border-t border-border/50">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Contracts</p>
            <div className="flex flex-wrap gap-1.5">
              {visiblePlatforms.map((p) => (
                <button
                  key={p.contract_address}
                  onClick={() => copyAddress(p.contract_address)}
                  className="group flex items-center gap-1.5 rounded-md bg-secondary/60 hover:bg-secondary px-2 py-1 transition-colors text-left"
                >
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 font-medium border-primary/30 text-primary">
                    {p.chain}
                  </Badge>
                  <span className="text-[11px] font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                    {shortenAddress(p.contract_address)}
                  </span>
                  {copied === p.contract_address ? (
                    <Check className="h-3 w-3 text-primary shrink-0" />
                  ) : (
                    <Copy className="h-3 w-3 text-muted-foreground/50 group-hover:text-muted-foreground shrink-0 transition-colors" />
                  )}
                </button>
              ))}
            </div>
            {platforms.length > 2 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                {showAll ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {showAll ? "Show less" : `+${platforms.length - 2} more chains`}
              </button>
            )}
          </div>
        )}

        {/* Last Updated Timestamp */}
        {!loading && lastUpdated && (
          <div className="pt-1 border-t border-border/50">
            <p className="text-[10px] text-muted-foreground/80 font-mono tabular-nums">
              Last updated: {lastUpdated.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                timeZoneName: 'short',
                hour12: false 
              })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TokenOverview;
