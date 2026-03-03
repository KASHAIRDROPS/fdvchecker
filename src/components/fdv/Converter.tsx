import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import type { CoinData } from "@/lib/coingecko";

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

const CRYPTO_EQUIVALENTS = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum" },
  { id: "binancecoin", symbol: "BNB", name: "BNB" },
  { id: "solana", symbol: "SOL", name: "Solana" },
];

// Approximate USD prices for cross-crypto conversion
const CRYPTO_USD_PRICES: Record<string, number> = {
  bitcoin: 67400,
  ethereum: 3400,
  binancecoin: 580,
  solana: 140,
};

function formatNumber(n: number, maxDecimals = 8): string {
  if (n === 0) return "0";
  if (n >= 1_000_000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (n >= 1) return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
  if (n >= 0.0001) return n.toFixed(6);
  return n.toFixed(maxDecimals);
}

const Converter = ({ data, loading }: ConverterProps) => {
  const [amount, setAmount] = useState("1");
  const [direction, setDirection] = useState<"crypto-to-fiat" | "fiat-to-crypto">("crypto-to-fiat");
  const [selectedFiat, setSelectedFiat] = useState("USD");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const price = data?.current_price ?? 0;
  const symbol = data?.symbol ?? "???";
  const fiat = FIAT_RATES[selectedFiat];

  const numAmount = parseFloat(amount) || 0;

  const converted = useMemo(() => {
    if (!price || !numAmount) return 0;
    if (direction === "crypto-to-fiat") {
      return numAmount * price * fiat.rate;
    }
    return numAmount / (price * fiat.rate);
  }, [numAmount, price, fiat.rate, direction]);

  const allFiatValues = useMemo(() => {
    if (!price || !numAmount) return {};
    const usdValue = direction === "crypto-to-fiat" ? numAmount * price : numAmount;
    const result: Record<string, number> = {};
    for (const [code, info] of Object.entries(FIAT_RATES)) {
      result[code] = usdValue * info.rate;
    }
    return result;
  }, [numAmount, price, direction]);

  const cryptoEquivalents = useMemo(() => {
    if (!price || !numAmount) return [];
    const usdValue = direction === "crypto-to-fiat" ? numAmount * price : numAmount;
    return CRYPTO_EQUIVALENTS
      .filter((c) => c.id !== data?.id)
      .map((c) => ({
        ...c,
        amount: usdValue / (CRYPTO_USD_PRICES[c.id] || 1),
      }));
  }, [numAmount, price, direction, data?.id]);

  const handleSwap = () => {
    setDirection((d) => (d === "crypto-to-fiat" ? "fiat-to-crypto" : "crypto-to-fiat"));
    setAmount(converted ? formatNumber(converted) : "1");
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

  const fromLabel = direction === "crypto-to-fiat" ? symbol : selectedFiat;
  const toLabel = direction === "crypto-to-fiat" ? selectedFiat : symbol;

  return (
    <Card className="bg-card border-border animate-fade-in">
      <CardContent className="p-5 space-y-4">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
          Converter
        </p>

        {/* From input */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {direction === "crypto-to-fiat" ? "Amount" : "Amount"} ({fromLabel})
          </label>
          <div className="relative">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-12 bg-secondary/50 border-border text-foreground font-mono tabular-nums text-base pr-20"
              min="0"
              step="any"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono font-semibold uppercase">
              {fromLabel}
            </span>
          </div>
        </div>

        {/* Swap button */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={handleSwap}
            className="p-2 rounded-full bg-secondary/70 hover:bg-secondary border border-border transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>

        {/* To output */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Converted ({toLabel})
          </label>
          <div className="relative">
            <div className="h-12 flex items-center bg-secondary/30 border border-border rounded-md px-3">
              <span className="font-mono tabular-nums text-base text-foreground">
                {converted ? formatNumber(converted) : "0"}
              </span>
              <span className="ml-auto text-xs text-muted-foreground font-mono font-semibold uppercase">
                {toLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Fiat selector */}
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(FIAT_RATES).slice(0, 5).map(([code, info]) => (
            <button
              key={code}
              type="button"
              onClick={() => setSelectedFiat(code)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition-colors border ${
                selectedFiat === code
                  ? "bg-primary/15 border-primary/40 text-primary"
                  : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {info.flag} {code}
            </button>
          ))}
        </div>

        {/* Quick conversion reference */}
        {data && (
          <div className="text-[11px] text-muted-foreground font-mono tabular-nums">
            1 {symbol} = {fiat.symbol}{formatNumber(price * fiat.rate)}
          </div>
        )}

        {/* Advanced toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors font-semibold w-full"
        >
          {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          Advanced View
        </button>

        {/* Advanced panel */}
        {showAdvanced && (
          <div className="space-y-4 animate-fade-in">
            {/* All fiat conversions */}
            <div className="space-y-1.5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                All Currencies
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.entries(FIAT_RATES).map(([code, info]) => {
                  const val = allFiatValues[code] ?? 0;
                  return (
                    <div
                      key={code}
                      className={`flex items-center justify-between px-3 py-2 rounded-md border transition-colors ${
                        selectedFiat === code
                          ? "bg-primary/10 border-primary/30"
                          : "bg-secondary/30 border-border"
                      }`}
                    >
                      <span className="text-[11px] text-muted-foreground">
                        {info.flag} {code}
                      </span>
                      <span className="text-xs font-mono tabular-nums text-foreground">
                        {info.symbol}{formatNumber(val)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Crypto equivalents */}
            {cryptoEquivalents.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Crypto Equivalents
                </p>
                <div className="space-y-1.5">
                  {cryptoEquivalents.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between px-3 py-2 rounded-md bg-secondary/30 border border-border"
                    >
                      <span className="text-[11px] text-muted-foreground">
                        {c.name} <span className="font-mono">{c.symbol}</span>
                      </span>
                      <span className="text-xs font-mono tabular-nums text-foreground">
                        {formatNumber(c.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conversion table */}
            {data && (
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Quick Reference
                </p>
                <div className="space-y-1">
                  {[0.001, 0.01, 0.1, 1, 10, 100].map((qty) => (
                    <div
                      key={qty}
                      className="flex items-center justify-between px-3 py-1.5 text-[11px]"
                    >
                      <span className="font-mono tabular-nums text-muted-foreground">
                        {qty} {symbol}
                      </span>
                      <span className="font-mono tabular-nums text-foreground">
                        {fiat.symbol}{formatNumber(qty * price * fiat.rate)}
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
