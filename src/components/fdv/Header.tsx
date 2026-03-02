import { TrendingUp } from "lucide-react";

const Header = () => {
  return (
    <header className="text-center pt-8 pb-2">
      <div className="flex items-center justify-center gap-2 mb-3">
        <TrendingUp className="h-4 w-4 text-primary" />
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-medium">
          Token Analysis Tool
        </p>
      </div>
      <h1 className="text-4xl font-semibold tracking-tight text-primary">FDV CHECKER</h1>
      <p className="mt-2 text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
        Analyze fully diluted valuation, supply metrics, and unlock risk for any token.
      </p>
    </header>
  );
};

export default Header;
