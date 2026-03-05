import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { computeMetrics } from "@/lib/metrics";
import type { CoinData } from "@/lib/coingecko";

interface DilutionRiskLabelProps {
  data: CoinData | null;
  loading?: boolean;
}

interface RiskLevel {
  level: "Low" | "Medium" | "High";
  color: string;
  bgColor: string;
  borderColor: string;
  explanation: string;
}

function getDilutionRisk(ratio: number | null): RiskLevel {
  if (!ratio) {
    return {
      level: "Low",
      color: "text-muted-foreground",
      bgColor: "bg-muted/50",
      borderColor: "border-muted",
      explanation: "Search a token to see its dilution risk level.",
    };
  }

  if (ratio < 1.2) {
    return {
      level: "Low",
      color: "text-green-700 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      borderColor: "border-green-200 dark:border-green-800",
      explanation: "Most tokens are already circulating. Minimal dilution risk from future unlocks.",
    };
  }

  if (ratio <= 2) {
    return {
      level: "Medium",
      color: "text-amber-700 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
      borderColor: "border-amber-200 dark:border-amber-800",
      explanation: "Moderate amount of tokens yet to unlock. Be aware of potential selling pressure.",
    };
  }

  return {
    level: "High",
    color: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800",
    explanation: "Large portion of supply not yet circulating. Significant dilution risk from unlocks.",
  };
}

const DilutionRiskLabel = ({ data, loading }: DilutionRiskLabelProps) => {
  const { ratio: ratioNum } = computeMetrics(data);
  const risk = getDilutionRisk(ratioNum);

  return (
    <Card className={`border ${risk.borderColor} animate-fade-in`}>
      <CardContent className={`p-4 space-y-2 ${risk.bgColor}`}>
        {loading ? (
          <>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-full" />
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-semibold uppercase tracking-wider ${risk.color} shrink-0`}>
                {risk.level} Dilution Risk
              </span>
              {ratioNum && (
                <span className="text-[10px] text-muted-foreground font-mono whitespace-nowrap">
                  (FDV/Market Cap: {ratioNum.toFixed(2)}x)
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed break-words">
              {risk.explanation}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DilutionRiskLabel;
