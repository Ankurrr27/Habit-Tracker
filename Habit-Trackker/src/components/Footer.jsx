import { Github } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-bg text-text">
      {/* subtle accent line */}
      <div className="h-px w-full bg-black/10" />

      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* LEFT — BRAND */}
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-wide">
                HabTrack
              </p>
              <p className="text-xs opacity-70">
                Habit tracking, done right.
              </p>
            </div>
          </div>

          {/* CENTER — LINKS */}
          <div className="flex items-center gap-6 text-sm opacity-70">
            <Link
              to="/profile"
              className="hover:opacity-100 hover:text-primary transition"
            >
              Profile
            </Link>

            <Link
              to="/privacy"
              className="hover:opacity-100 hover:text-primary transition"
            >
              Privacy
            </Link>

            <a
              href="https://github.com/Ankurrr27"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:opacity-100 hover:text-primary transition"
            >
              <Github size={14} />
              GitHub
            </a>
          </div>

          {/* RIGHT — META */}
          <div className="text-xs opacity-60 text-center sm:text-right">
            <p>© {new Date().getFullYear()} HabTrack</p>
            <p className="tracking-wide">
              v1.0 • Built by{" "}
              <span className="opacity-90">Ankur</span>
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
