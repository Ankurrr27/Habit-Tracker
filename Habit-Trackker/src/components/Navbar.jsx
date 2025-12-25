import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/habits")
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setIsLoggedIn(false);
      navigate("/login");
    } catch {
      alert("Logout failed");
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-zinc-800">
      {/* FULL WIDTH BAR */}
      <div className="w-full px-6 py-4 flex items-center justify-between">
        
        {/* LEFT CORNER — LOGO */}
        <Link
          to="/"
          className="text-lg font-semibold text-white tracking-wide flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          HabTrack
        </Link>

        {/* RIGHT CORNER — ACTIONS */}
        <div className="flex items-center gap-4 text-sm">
          {isLoggedIn === null ? (
            <span className="text-zinc-500">…</span>
          ) : isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="text-zinc-300 hover:text-white transition"
              >
                Dashboard
              </Link>

              <button
                onClick={logout}
                className="px-4 py-1.5 rounded-md border border-zinc-700 text-zinc-300 hover:border-red-500 hover:text-red-400 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-zinc-300 hover:text-white transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
