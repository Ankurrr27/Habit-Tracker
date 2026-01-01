import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const THEMES = ["light", "dark", "pink"];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    const root = document.documentElement;

    // 🔥 reset all theme classes
    root.classList.remove("dark", "pink");

    // 🔥 apply active theme
    if (theme === "dark") root.classList.add("dark");
    if (theme === "pink") root.classList.add("pink");

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const currentIndex = THEMES.indexOf(theme);
    const nextTheme = THEMES[(currentIndex + 1) % THEMES.length];
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
