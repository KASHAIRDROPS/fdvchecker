import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchTokens, type CoinSearchResult } from "@/lib/coingecko";

interface SearchBarProps {
  onSelect: (coinId: string) => void;
  isLoading: boolean;
}

const SearchBar = ({ onSelect, isLoading }: SearchBarProps) => {
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
    onSelect(coin.id);
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
          <Loader2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
        ) : (
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
        <Input
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search a token (e.g. Bitcoin, Ethereum)"
          className="pl-10 h-12 bg-card border-border text-foreground placeholder:text-muted-foreground text-sm rounded-lg focus-visible:ring-primary/50"
        />
      </div>

      {open && results.length > 0 && (
        <ul className="mt-1.5 rounded-lg border border-border bg-card overflow-hidden shadow-lg shadow-black/20 animate-fade-in">
          {results.map((coin) => (
            <li key={coin.id}>
              <button
                type="button"
                onClick={() => handleSelect(coin)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-secondary/70 transition-colors"
              >
                <img src={coin.thumb} alt="" className="h-6 w-6 rounded-full" />
                <span className="text-sm font-medium text-foreground flex-1">{coin.name}</span>
                <span className="text-xs text-muted-foreground uppercase font-mono">{coin.symbol}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default SearchBar;
