import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { Home, LogOut, User } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  /* =====================
     CHECK AUTH
  ===================== */
  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  /* =====================
     LOGOUT
  ===================== */
  const logout = () => {
    localStorage.removeItem("token"); // JWT logout
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-40 bg-black backdrop-blur border-b border-zinc-800">
      <div className="w-full px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="text-lg font-semibold text-white tracking-wide flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          HabTrack
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4 text-sm relative">
          {loading ? (
            <span className="text-zinc-500">…</span>
          ) : user ? (
            <>
              {/* AVATAR */}
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <img
                  src={user.avatar || "/avatar-placeholder.png"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover border border-zinc-700"
                />
              </button>

              {/* DROPDOWN */}
              {open && (
                <div className="absolute right-0 top-12 w-44 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg overflow-hidden">
                  <button
                    onClick={() => {
                      navigate("/");
                      setOpen(false);
                    }}
                    className="w-full px-4 py-2 flex items-center gap-2 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  >
                    <Home size={14} />
                    Home
                  </button>

                  <button
                    onClick={() => {
                      navigate("/profile");
                      setOpen(false);
                    }}
                    className="w-full px-4 py-2 flex items-center gap-2 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  >
                    <User size={14} />
                    Profile
                  </button>

                  <button
                    onClick={logout}
                    className="w-full px-4 py-2 flex items-center gap-2 text-red-400 hover:bg-zinc-800"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              )}
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
