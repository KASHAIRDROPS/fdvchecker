import { Card, CardContent } from "@/components/ui/card";

const metrics = [
  { label: "Fully Diluted Valuation", value: "—" },
  { label: "Market Cap", value: "—" },
  { label: "Circulating Supply", value: "—" },
  { label: "Total Supply", value: "—" },
];

const MetricsGrid = () => {
  return (
    <section className="grid grid-cols-2 gap-3">
      {metrics.map((metric) => (
        <Card key={metric.label} className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{metric.label}</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{metric.value}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};

export default MetricsGrid;
