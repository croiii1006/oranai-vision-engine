import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  /** 与 SSR / `<html className="dark">` 首帧一致，具体偏好仅在客户端 effect 中恢复 */
  const [theme, setTheme] = useState<Theme>("dark");
  const hasCommittedThemeRef = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme;
    const next = stored === "light" || stored === "dark" ? stored : "dark";
    setTheme(next);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    if (!hasCommittedThemeRef.current) {
      hasCommittedThemeRef.current = true;
      return;
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
