import { Card, CardContent } from "@/components/ui/card";

const TokenOverview = () => {
  return (
    <Card className="bg-card border-border">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="h-10 w-10 rounded-full bg-secondary" />
        <div className="flex-1">
          <p className="font-semibold text-foreground">—</p>
          <p className="text-xs text-muted-foreground">Search a token</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-foreground">—</p>
          <p className="text-xs text-muted-foreground">24h: —</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenOverview;
