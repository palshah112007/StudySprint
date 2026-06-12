"use client";

import { createContext, useContext, useState, useEffect, useCallback, startTransition, type ReactNode } from "react";
import { loadData, saveData } from "@/lib/persistence";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  const applyTheme = useCallback((t: Theme) => {
    const root = document.documentElement;
    if (t === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const saved = loadData<Theme>("theme", "dark");
    startTransition(() => {
      setThemeState(saved);
    });
    applyTheme(saved);
  }, [applyTheme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    saveData("theme", t);
    applyTheme(t);
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
