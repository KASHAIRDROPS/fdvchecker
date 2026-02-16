import { Card, CardContent } from "@/components/ui/card";

const FdvComparison = () => {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4 space-y-2">
        <p className="text-xs text-muted-foreground">FDV / Market Cap Ratio</p>
        <p className="text-2xl font-bold text-foreground">—</p>
        <p className="text-xs text-muted-foreground">
          A ratio closer to 1 means most tokens are already in circulation.
        </p>
      </CardContent>
    </Card>
  );
};

export default FdvComparison;
