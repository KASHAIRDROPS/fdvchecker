import { Activity } from "lucide-react";

const Header = () => {
  return (
    <header className="text-center pt-8 pb-2">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Activity className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase">Token Analysis Tool</span>
      </div>
      <h1 className="text-5xl font-black tracking-tight text-primary mb-2">FDV CHECKER</h1>
      <p className="text-muted-foreground text-sm">
        Check the Fully Diluted Valuation of any token
      </p>
    </header>
  );
};

export default Header;
