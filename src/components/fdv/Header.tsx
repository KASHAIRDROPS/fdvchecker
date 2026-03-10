import { TrendingUp, Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const Header = () => {
 const { theme, setTheme } = useTheme();

 return (
    <header className="text-center pt-6 sm:pt-8 pb-2 px-2">
      <div className="flex items-center justify-between gap-2 mb-3 max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-muted-foreground font-medium whitespace-normal">
            Token Analysis Tool
          </p>
        </div>
        
        {/* Theme Switcher */}
        <div className="flex items-center gap-1 bg-secondary/50 border border-border rounded-md p-1 shrink-0">
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`p-1.5 rounded transition-colors ${
              theme === "light" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
            title="Light theme"
          >
            <Sun className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setTheme("system")}
            className={`p-1.5 rounded transition-colors ${
              theme === "system" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
            title="System theme"
          >
            <Monitor className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`p-1.5 rounded transition-colors ${
              theme === "dark" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
            title="Dark theme"
          >
            <Moon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-primary">FDV CHECKER</h1>
      <p className="mt-2 text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-xs mx-auto px-2">
        Analyze fully diluted valuation, supply metrics, and unlock risk for any token.
      </p>
    </header>
  );
};

export default Header;
