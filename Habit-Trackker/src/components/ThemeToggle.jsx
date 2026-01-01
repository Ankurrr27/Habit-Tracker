import { Sun, Moon, Heart } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        p-2 rounded-md
        bg-bg text-text
        hover:bg-primary/10
        transition
      "
      aria-label="Toggle theme"
      title={`Current theme: ${theme}`}
    >
      {theme === "light" && <Moon size={18} />}
      {theme === "dark" && <Sun size={18} />}
      {theme === "pink" && <Heart size={18} className="text-primary" />}
    </button>
  );
}
