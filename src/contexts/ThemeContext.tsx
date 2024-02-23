import { useState, createContext, useEffect } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    if (!localTheme) {
      localStorage.setItem("theme", "dark");
      return;
    }

    if (localTheme === "light") {
      document.documentElement.classList.remove("dark");
    }

    setTheme(localTheme as Theme);
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
      setTheme("light");
    } else {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
      setTheme("dark");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
