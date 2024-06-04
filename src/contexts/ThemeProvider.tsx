import { useState } from "react";

import { ThemeContext } from "./ThemeContext";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem("theme");
    if (!savedTheme) {
      localStorage.setItem("theme", "dark");
      return true;
    }
    if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    }
    return savedTheme === "dark";
  });

  function toggleTheme() {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
    }
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    }
    localStorage.setItem("theme", darkMode ? "light" : "dark");
    setDarkMode((prev) => !prev);
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
