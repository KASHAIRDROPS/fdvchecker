import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  return (
    <section className="w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search a token (e.g. Bitcoin, Ethereum)"
          className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
          readOnly
        />
      </div>
    </section>
  );
};

export default SearchBar;
