import { useEffect, useState } from "react";
import { Github, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios"; // adjust path if needed

export default function Footer() {
  const [views, setViews] = useState(null);

  useEffect(() => {
    let mounted = true;

    api
      .get("/views")
      .then((res) => {
        if (mounted && typeof res.data?.count === "number") {
          setViews(res.data.count);
        }
      })
      .catch((err) => {
        console.error("View count fetch failed:", err.message);
        // intentionally fail silently in UI, but NOT in logs
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <footer className="bg-white dark:bg-black">
      <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />

      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                HabTrack
              </p>
              <p className="text-xs text-zinc-500">
                Habit tracking, done right.
              </p>
            </div>
          </div>

          {/* CENTER */}
          <div className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
            <Link to="/profile" className="hover:text-zinc-900 dark:hover:text-zinc-200">
              Profile
            </Link>
            <Link to="/privacy" className="hover:text-zinc-900 dark:hover:text-zinc-200">
              Privacy
            </Link>
            <a
              href="https://github.com/Ankurrr27"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-200"
            >
              <Github size={14} />
              GitHub
            </a>
          </div>

          {/* RIGHT */}
          <div className="text-xs text-zinc-500 text-center sm:text-right space-y-1">
            <p>© {new Date().getFullYear()} HabTrack</p>

            <p>
              v1.0 • Built by{" "}
              <span className="text-zinc-700 dark:text-zinc-300">Ankur</span>
            </p>

            <div className="flex items-center justify-center sm:justify-end gap-1.5">
              <Eye size={12} />
              <span>
                {views !== null ? `${views.toLocaleString()} views` : "— views"}
              </span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
