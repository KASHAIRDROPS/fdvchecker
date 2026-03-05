import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpDown, ChevronDown, ChevronUp, Search, Loader2 } from "lucide-react";
import { searchTokens, fetchCoinData, type CoinData, type CoinSearchResult } from "@/lib/coingecko";

interface ConverterProps {
  data: CoinData | null;
  loading?: boolean;
}

const FIAT_RATES: Record<string, { symbol: string; rate: number; flag: string }> = {
  USD: { symbol: "$", rate: 1, flag: "🇺🇸" },
  EUR: { symbol: "€", rate: 0.92, flag: "🇪🇺" },
  GBP: { symbol: "£", rate: 0.79, flag: "🇬🇧" },
  JPY: { symbol: "¥", rate: 149.5, flag: "🇯🇵" },
  AUD: { symbol: "A$", rate: 1.53, flag: "🇦🇺" },
  CAD: { symbol: "C$", rate: 1.36, flag: "🇨🇦" },
  CHF: { symbol: "Fr", rate: 0.88, flag: "🇨🇭" },
  INR: { symbol: "₹", rate: 83.1, flag: "🇮🇳" },
  KRW: { symbol: "₩", rate: 1325, flag: "🇰🇷" },
  BRL: { symbol: "R$", rate: 4.97, flag: "🇧🇷" },
};

type ConvertMode = "crypto-to-fiat" | "crypto-to-crypto";

function formatNumber(n: number, maxDecimals = 8): string {
  if (n === 0) return "0";
  if (n >= 1_000_000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (n >= 1) return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
  if (n >= 0.0001) return n.toFixed(6);
  return n.toFixed(maxDecimals);
}

/* ── Mini inline coin search ── */
interface CoinPickerProps {
  selected: CoinData | null;
  onSelect: (coin: CoinData) => void;
  label: string;
  loading?: boolean;
}

const CoinPicker = ({ selected, onSelect, label, loading: externalLoading }: CoinPickerProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CoinSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [fetching, setFetching] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); return; }
    setSearching(true);
    try {
      const r = await searchTokens(q);
      setResults(r);
    } catch { setResults([]); }
    finally { setSearching(false); }
  }, []);

  const handleChange = (v: string) => {
    setQuery(v);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doSearch(v), 350);
  };

  const handlePick = async (coin: CoinSearchResult) => {
    setFetching(true);
    try {
      const data = await fetchCoinData(coin.id);
      onSelect(data);
    } catch { /* silent */ }
    finally { setFetching(false); setOpen(false); setQuery(""); setResults([]); }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const busy = searching || fetching || externalLoading;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-secondary/50 border border-border hover:border-primary/40 transition-colors w-full min-h-[42px]"
      >
        {selected?.image && (
          <img src={selected.image} alt="" className="h-5 w-5 rounded-full shrink-0" />
        )}
        <span className="text-sm font-semibold text-foreground truncate">
          {selected ? selected.symbol : label}
        </span>
        <ChevronDown className="h-3 w-3 ml-auto text-muted-foreground shrink-0" />
      </button>

      {open && (
        <div className="absolute z-[100] left-0 right-0 mt-1 rounded-lg border border-border bg-card shadow-lg shadow-black/30 animate-fade-in overflow-hidden">
          <div className="relative p-2">
            {busy ? (
              <Loader2 className="absolute left-4.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground animate-spin" />
            ) : (
              <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            )}
            <Input
              autoFocus
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Search coin..."
              className="h-9 pl-9 text-xs bg-secondary/50 border-border"
            />
          </div>
          {results.length > 0 && (
            <ul className="max-h-60 overflow-y-auto">
              {results.map((coin) => (
                <li key={coin.id}>
                  <button
                    type="button"
                    onClick={() => handlePick(coin)}
                    disabled={fetching}
                    className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left hover:bg-secondary/70 transition-colors disabled:opacity-50"
                  >
                    <img src={coin.thumb} alt="" className="h-5 w-5 rounded-full shrink-0" />
                    <span className="text-xs font-medium text-foreground flex-1 truncate">{coin.name}</span>
                    <span className="text-[10px] text-muted-foreground font-mono uppercase shrink-0">{coin.symbol}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {query.length >= 2 && results.length === 0 && !searching && (
            <p className="text-xs text-muted-foreground text-center py-3">No results</p>
          )}
        </div>
      )}
    </div>
  );
};

/* ── Converter ── */
const Converter = ({ data, loading }: ConverterProps) => {
  const [amount, setAmount] = useState("1");
  const [mode, setMode] = useState<ConvertMode>("crypto-to-fiat");
  const [selectedFiat, setSelectedFiat] = useState("USD");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [fromCoin, setFromCoin] = useState<CoinData | null>(null);
  const [toCoin, setToCoin] = useState<CoinData | null>(null);

  // Use custom fromCoin if selected, otherwise fall back to page data
  const activeFrom = fromCoin ?? data;
  const fromPrice = activeFrom?.current_price ?? 0;
  const fromSymbol = activeFrom?.symbol ?? "???";
  const fiat = FIAT_RATES[selectedFiat];
  const numAmount = parseFloat(amount) || 0;

  const converted = useMemo(() => {
    if (!fromPrice || !numAmount) return 0;
    if (mode === "crypto-to-fiat") {
      return numAmount * fromPrice * fiat.rate;
    }
    // crypto-to-crypto: from USD value → to coin
    if (!toCoin?.current_price) return 0;
    return (numAmount * fromPrice) / toCoin.current_price;
  }, [numAmount, fromPrice, fiat.rate, mode, toCoin]);

  const toLabel = mode === "crypto-to-fiat" ? selectedFiat : (toCoin?.symbol ?? "Select");

  const allFiatValues = useMemo(() => {
    if (!fromPrice || !numAmount) return {};
    const usdValue = numAmount * fromPrice;
    const result: Record<string, number> = {};
    for (const [code, info] of Object.entries(FIAT_RATES)) {
      result[code] = usdValue * info.rate;
    }
    return result;
  }, [numAmount, fromPrice]);

  const handleSwap = () => {
    if (mode === "crypto-to-fiat") return; // swap only in crypto-to-crypto
    // Not meaningful without a full two-way coin swap; just invert the amount
    if (toCoin && converted) {
      setAmount(formatNumber(converted));
    }
  };

  if (loading) {
    return (
      <Card className="bg-card border-border animate-fade-in">
        <CardContent className="p-5 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border animate-fade-in">
      <CardContent className="p-4 sm:p-5 space-y-4">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
          Converter
        </p>

        {/* Mode tabs - Responsive */}
        <div className="flex gap-1.5">
          {([ ["crypto-to-fiat", "Crypto → Fiat"], ["crypto-to-crypto", "Crypto → Crypto"] ] as const).map(([m, label]) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex-1 py-1.5 rounded-md text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider transition-colors border whitespace-nowrap ${
                mode === m
                  ? "bg-primary/15 border-primary/40 text-primary"
                  : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* From: selectable coin - Responsive layout */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground">From</label>
          <div className="flex flex-col sm:flex-row gap-2 relative">
            <div className="w-full sm:w-36 shrink-0 relative z-[100]">
              <CoinPicker selected={activeFrom} onSelect={setFromCoin} label="Select coin" />
            </div>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-auto bg-secondary/50 border-border text-foreground font-mono tabular-nums text-sm sm:text-base w-full"
              min="0"
              step="any"
            />
          </div>
        </div>

        {/* Swap */}
        {mode === "crypto-to-crypto" && (
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={handleSwap}
              className="p-2 rounded-full bg-secondary/70 hover:bg-secondary border border-border transition-colors text-muted-foreground hover:text-foreground"
            >
              <ArrowUpDown className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* To - Responsive layout */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground">To</label>
          {mode === "crypto-to-crypto" ? (
            <div className="flex flex-col sm:flex-row gap-2 relative">
              <div className="w-full sm:w-36 shrink-0 relative z-[100]">
                <CoinPicker selected={toCoin} onSelect={setToCoin} label="Select coin" />
              </div>
              <div className="h-[42px] flex items-center flex-1 bg-secondary/30 border border-border rounded-md px-3">
                <span className="font-mono tabular-nums text-sm sm:text-base text-foreground truncate">
                  {converted ? formatNumber(converted) : "0"}
                </span>
              </div>
            </div>
          ) : (
            <div className="h-12 flex items-center bg-secondary/30 border border-border rounded-md px-3">
              <span className="font-mono tabular-nums text-sm sm:text-base text-foreground truncate">
                {converted ? formatNumber(converted) : "0"}
              </span>
              <span className="ml-auto text-xs text-muted-foreground font-mono font-semibold uppercase whitespace-nowrap">
                {toLabel}
              </span>
            </div>
          )}
        </div>

        {/* Fiat selector (only in fiat mode) - Responsive wrap with proper z-index */}
        {mode === "crypto-to-fiat" && (
          <div className="flex flex-wrap gap-1.5 relative z-10">
            {Object.entries(FIAT_RATES).slice(0, 5).map(([code, info]) => (
              <button
                key={code}
                type="button"
                onClick={() => setSelectedFiat(code)}
                className={`px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-mono font-medium transition-colors border whitespace-nowrap ${
                  selectedFiat === code
                    ? "bg-primary/15 border-primary/40 text-primary"
                    : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {info.flag} {code}
              </button>
            ))}
          </div>
        )}

        {/* Rate reference - Responsive */}
        {activeFrom && (
          <div className="text-[10px] sm:text-[11px] text-muted-foreground font-mono tabular-nums break-words">
            {mode === "crypto-to-fiat"
              ? `1 ${fromSymbol} = ${fiat.symbol}${formatNumber(fromPrice * fiat.rate)}`
              : toCoin
                ? `1 ${fromSymbol} = ${formatNumber(fromPrice / toCoin.current_price)} ${toCoin.symbol}`
                : `1 ${fromSymbol} = $${formatNumber(fromPrice)}`}
          </div>
        )}

        {/* Advanced toggle - Responsive */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors font-semibold w-full"
        >
          {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          Advanced View
        </button>

        {showAdvanced && (
          <div className="space-y-4 animate-fade-in">
            {/* All fiat - Responsive grid */}
            <div className="space-y-1.5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                All Currencies
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
                {Object.entries(FIAT_RATES).map(([code, info]) => {
                  const val = allFiatValues[code] ?? 0;
                  return (
                    <div
                      key={code}
                      className={`flex items-center justify-between px-2 sm:px-3 py-2 rounded-md border transition-colors cursor-pointer ${
                        selectedFiat === code
                          ? "bg-primary/10 border-primary/30"
                          : "bg-secondary/30 border-border hover:border-primary/20"
                      }`}
                      onClick={() => { setSelectedFiat(code); setMode("crypto-to-fiat"); }}
                    >
                      <span className="text-[10px] sm:text-[11px] text-muted-foreground truncate pr-1">
                        {info.flag} {code}
                      </span>
                      <span className="text-xs font-mono tabular-nums text-foreground shrink-0 whitespace-nowrap">
                        {info.symbol}{formatNumber(val)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick reference - Responsive */}
            {activeFrom && (
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Quick Reference
                </p>
                <div className="space-y-1">
                  {[0.001, 0.01, 0.1, 1, 10, 100].map((qty) => (
                    <div
                      key={qty}
                      className="flex items-center justify-between px-3 py-1.5 text-[10px] sm:text-[11px]"
                    >
                      <span className="font-mono tabular-nums text-muted-foreground truncate pr-2">
                        {qty} {fromSymbol}
                      </span>
                      <span className="font-mono tabular-nums text-foreground shrink-0 whitespace-nowrap">
                        {mode === "crypto-to-crypto" && toCoin
                          ? `${formatNumber(qty * fromPrice / toCoin.current_price)} ${toCoin.symbol}`
                          : `${fiat.symbol}${formatNumber(qty * fromPrice * fiat.rate)}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Converter;
