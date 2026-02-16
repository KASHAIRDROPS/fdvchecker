import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const SupplyBar = () => {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Circulating Supply</span>
          <span>—%</span>
        </div>
        <Progress value={0} className="h-3 bg-secondary" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Circulating: —</span>
          <span>Total: —</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplyBar;
