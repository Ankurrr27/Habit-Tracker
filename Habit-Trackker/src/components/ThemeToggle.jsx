import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun size={16} className="text-yellow-400" />
      ) : (
        <Moon size={16} />
      )}
    </button>
  );
}
