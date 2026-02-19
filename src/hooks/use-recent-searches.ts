import { useState, useCallback } from "react";

export interface RecentToken {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
}

const STORAGE_KEY = "fdv_recent_searches";
const MAX_RECENT = 5;

function loadRecent(): RecentToken[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useRecentSearches() {
  const [recent, setRecent] = useState<RecentToken[]>(loadRecent);

  const addRecent = useCallback((token: RecentToken) => {
    setRecent((prev) => {
      const filtered = prev.filter((t) => t.id !== token.id);
      const next = [token, ...filtered].slice(0, MAX_RECENT);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearRecent = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setRecent([]);
  }, []);

  return { recent, addRecent, clearRecent };
}
