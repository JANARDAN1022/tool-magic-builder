
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined
);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "magic-tools-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const [isThemeChanging, setIsThemeChanging] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove("light", "dark");
    
    // Apply new theme with optimizations to avoid repaints
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      
      // Use requestAnimationFrame for smooth theme switching
      requestAnimationFrame(() => {
        root.classList.add(systemTheme);
      });
      return;
    }
    
    // Use requestAnimationFrame for smooth theme switching
    requestAnimationFrame(() => {
      root.classList.add(theme);
    });
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      // Throttle theme changes to prevent rapid toggling
      if (isThemeChanging) return;
      
      setIsThemeChanging(true);
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
      
      // Reset throttle after a short delay
      setTimeout(() => {
        setIsThemeChanging(false);
      }, 300);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
