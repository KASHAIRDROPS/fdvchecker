import Header from "@/components/fdv/Header";
import SearchBar from "@/components/fdv/SearchBar";
import TokenOverview from "@/components/fdv/TokenOverview";
import MetricsGrid from "@/components/fdv/MetricsGrid";
import SupplyBar from "@/components/fdv/SupplyBar";
import FdvComparison from "@/components/fdv/FdvComparison";
import Footer from "@/components/fdv/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-md px-4 py-2 space-y-4">
        <Header />
        <SearchBar />
        <TokenOverview />
        <MetricsGrid />
        <SupplyBar />
        <FdvComparison />
        <Footer />
      </div>
    </main>
  );
};

export default Index;
