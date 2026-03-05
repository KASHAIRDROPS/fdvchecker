import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Loader2, Clock, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchTokens, type CoinSearchResult } from "@/lib/coingecko";
import type { RecentToken } from "@/hooks/use-recent-searches";

interface SearchBarProps {
  onSelect: (coinId: string, meta?: { name: string; symbol: string; thumb: string }) => void;
  isLoading: boolean;
  recentTokens: RecentToken[];
  onClearRecent: () => void;
}

const SearchBar = ({ onSelect, isLoading, recentTokens, onClearRecent }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CoinSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setSearching(true);
    try {
      const r = await searchTokens(q);
      setResults(r);
      setOpen(r.length > 0);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doSearch(value), 350);
  };

  const handleSelect = (coin: CoinSearchResult) => {
    setQuery(coin.name);
    setOpen(false);
    setResults([]);
    onSelect(coin.id, { name: coin.name, symbol: coin.symbol, thumb: coin.thumb });
  };

  const handleRecentClick = (token: RecentToken) => {
    setQuery(token.name);
    onSelect(token.id, { name: token.name, symbol: token.symbol, thumb: token.thumb });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="w-full" ref={containerRef}>
      <div className="relative">
        {searching || isLoading ? (
          <Loader2 className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground animate-spin shrink-0" />
        ) : (
          <Search className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
        )}
        <Input
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search token (BTC, ETH, SOL...)"
          inputMode="search"
          className="pl-9 sm:pl-10 h-11 sm:h-12 bg-card border-border text-foreground placeholder:text-muted-foreground text-xs sm:text-sm rounded-lg focus-visible:ring-primary/50 w-full"
        />
      </div>

      {open && results.length > 0 && (
        <ul className="mt-1.5 rounded-lg border border-border bg-card overflow-hidden shadow-lg shadow-black/20 animate-fade-in max-h-[60vh] overflow-y-auto">
          {results.map((coin) => (
            <li key={coin.id}>
              <button
                type="button"
                onClick={() => handleSelect(coin)}
                className="flex w-full items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-secondary/70 transition-colors"
              >
                <img src={coin.thumb} alt="" className="h-5 w-5 sm:h-6 sm:w-6 rounded-full shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-foreground flex-1 truncate min-w-0">{coin.name}</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground uppercase font-mono whitespace-nowrap shrink-0">{coin.symbol}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {!open && recentTokens.length > 0 && (
        <div className="mt-2 animate-fade-in">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3 w-3 shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-medium">Recent</span>
            </div>
            <button
              type="button"
              onClick={onClearRecent}
              className="text-[10px] sm:text-[11px] text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {recentTokens.map((token) => (
              <button
                key={token.id}
                type="button"
                onClick={() => handleRecentClick(token)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-border bg-card hover:bg-secondary/70 transition-colors text-[10px] sm:text-xs shrink-0"
              >
                <img src={token.thumb} alt="" className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full shrink-0" />
                <span className="text-foreground font-medium whitespace-nowrap">{token.symbol.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default SearchBar;
