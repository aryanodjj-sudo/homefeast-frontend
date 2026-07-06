import { createContext, useEffect, useState } from "react";
import { STORAGE_KEYS } from "../utils/constants";
import { getStorageItem, setStorageItem } from "../utils/storage";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Falls back to the OS preference the first time there's no saved choice.
  const [darkMode, setDarkMode] = useState(() => {
    const saved = getStorageItem(STORAGE_KEYS.THEME, null);
    if (saved !== null) return saved === "dark";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  });

  // Keep the "dark" class on <html> in sync so every dark: utility class
  // across the app (Tailwind v4 class-based variant) responds instantly.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    setStorageItem(STORAGE_KEYS.THEME, darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;