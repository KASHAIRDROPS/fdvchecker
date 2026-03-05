import { TrendingUp } from "lucide-react";

const Header = () => {
  return (
    <header className="text-center pt-6 sm:pt-8 pb-2 px-2">
      <div className="flex items-center justify-center gap-2 mb-3">
        <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-muted-foreground font-medium whitespace-normal">
          Token Analysis Tool
        </p>
      </div>
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-primary">FDV CHECKER</h1>
      <p className="mt-2 text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-xs mx-auto px-2">
        Analyze fully diluted valuation, supply metrics, and unlock risk for any token.
      </p>
    </header>
  );
};

export default Header;
