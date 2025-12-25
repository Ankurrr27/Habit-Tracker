import { Github } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black">
      {/* subtle accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* LEFT — BRAND */}
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-zinc-100 tracking-wide">
                HabTrack
              </p>
              <p className="text-xs text-zinc-500">
                Habit tracking, done right.
              </p>
            </div>
          </div>

          {/* CENTER — LINKS */}
          <div className="flex items-center gap-6 text-sm text-zinc-400">
            <Link
              to="/profile"
              className="hover:text-zinc-200 transition"
            >
              Profile
            </Link>

            <Link
              to="/privacy"
              className="hover:text-zinc-200 transition"
            >
              Privacy
            </Link>

            <a
              href="https://github.com/Ankurrr27"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-zinc-200 transition"
            >
              <Github size={14} />
              GitHub
            </a>
          </div>

          {/* RIGHT — META */}
          <div className="text-xs text-zinc-500 text-center sm:text-right">
            <p>© {new Date().getFullYear()} HabTrack</p>
            <p className="tracking-wide">
              v1.0 • Built by <span className="text-zinc-300">Ankur</span>
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
