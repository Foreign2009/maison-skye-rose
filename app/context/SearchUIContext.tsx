"use client";

import { createContext, useContext, useState } from "react";

interface SearchUIContextValue {
  searchOpen: boolean;
  openSearch:  () => void;
  closeSearch: () => void;
}

const SearchUIContext = createContext<SearchUIContextValue | null>(null);

export function SearchUIProvider({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <SearchUIContext.Provider
      value={{
        searchOpen,
        openSearch:  () => setSearchOpen(true),
        closeSearch: () => setSearchOpen(false),
      }}
    >
      {children}
    </SearchUIContext.Provider>
  );
}

export function useSearchUI(): SearchUIContextValue {
  const ctx = useContext(SearchUIContext);
  if (!ctx) throw new Error("useSearchUI must be used within SearchUIProvider");
  return ctx;
}
