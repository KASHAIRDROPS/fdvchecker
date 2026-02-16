

## FDV Checker — Project Setup (Skeleton Only)

### 1. Dark Mode Theme
- Update `index.css` to use dark mode colors by default (dark background, light text, accent colors suited for a crypto/finance tool)

### 2. Folder Structure
Create empty component files to establish the project architecture:
- `src/components/fdv/Header.tsx` — App title + tagline
- `src/components/fdv/SearchBar.tsx` — Search input (static, no logic)
- `src/components/fdv/TokenOverview.tsx` — Token icon, name, price, 24h change placeholder
- `src/components/fdv/MetricsGrid.tsx` — 2×2 grid with FDV, Market Cap, Circulating Supply, Total Supply cards
- `src/components/fdv/SupplyBar.tsx` — Horizontal bar showing circulating vs total supply ratio
- `src/components/fdv/FdvComparison.tsx` — FDV vs Market Cap ratio display
- `src/components/fdv/Footer.tsx` — Attribution + data source credit

### 3. Main Page Layout
- Update `Index.tsx` to render all sections top-to-bottom in order:
  1. Header
  2. SearchBar
  3. TokenOverview (hidden/placeholder until search)
  4. MetricsGrid (placeholder cards with "—" values)
  5. SupplyBar (empty bar)
  6. FdvComparison (placeholder)
  7. Footer

### 4. Component Shells
Each component will render its basic HTML structure with Tailwind classes but:
- **No API calls**
- **No state management**
- **No interactivity**
- Just static placeholder UI with hardcoded "—" or "Search a token" text

### 5. Mobile-First & Dark Layout
- Single column layout, max-width container centered
- All spacing and typography optimized for mobile first
- Dark background with subtle card borders for each section

### What This Does NOT Include
- ❌ No CoinGecko API integration
- ❌ No search functionality
- ❌ No real data
- ❌ No auto-suggest
- ❌ No animations

This is purely the **empty shell** ready for feature implementation in the next step.

