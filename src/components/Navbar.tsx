import { useEffect, useState } from "react";
import { FaStickyNote } from "react-icons/fa";
import { MdLightMode, MdDarkMode } from "react-icons/md";

type Theme = "dark" | "light";

function Navbar(): JSX.Element {
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

  const handleToggleTheme = () => {
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
    <nav className="flex items-center justify-between">
      <div>
        <div className="flex items-center">
          <FaStickyNote />
          <span className="pl-2">Noted</span>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        {theme === "dark" && (
          <MdLightMode
            onClick={handleToggleTheme}
            className="cursor-pointer"
            size="1.5em"
          />
        )}
        {theme === "light" && (
          <MdDarkMode
            onClick={handleToggleTheme}
            className="cursor-pointer"
            size="1.5em"
          />
        )}
      </div>
    </nav>
  );
}

export default Navbar;
