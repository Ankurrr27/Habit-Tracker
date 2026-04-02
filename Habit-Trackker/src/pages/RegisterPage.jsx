import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-zinc-900 dark:bg-black dark:text-white">
      <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-sky-500/12 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-[1fr_420px]">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-300">
              Start fresh
            </p>
            <h1 className="mt-6 text-5xl font-semibold leading-tight tracking-tight">
              Build habits, plan your week, and keep progress visible from day one.
            </h1>
            <p className="mt-5 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Create your account to start tracking routines, use the weekly calendar, connect your
              coding profiles, and stay aligned with your team.
            </p>
          </div>

          <div className="mt-8 grid max-w-xl gap-4 sm:grid-cols-2">
            <Benefit text="Track habits with a simpler workflow" />
            <Benefit text="Use the calendar to plan your week" />
            <Benefit text="Auto-track coding hobbies" />
            <Benefit text="Join teams and assign project work" />
          </div>
        </section>

        <form
          onSubmit={submit}
          className="relative w-full rounded-[2rem] bg-white/92 p-6 shadow-2xl shadow-zinc-200/50 backdrop-blur sm:p-8 dark:bg-zinc-950/90 dark:shadow-black/30"
        >
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              <ArrowRight size={14} className="rotate-180" />
              Back to home
            </Link>
            <h1 className="mt-5 text-2xl font-semibold">Create your account</h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Start building habits that stick.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="mb-5 flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const res = await api.post("/auth/google", {
                    credential: credentialResponse.credential,
                  });

                  localStorage.setItem("token", res.data.token);
                  navigate("/dashboard");
                } catch {
                  setError("Google signup failed");
                }
              }}
              onError={() => setError("Google signup failed")}
            />
          </div>

          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Or use email
            </span>
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          </div>

          <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Full name
          </label>
          <div className="relative mb-4">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-zinc-300 bg-white py-3 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>

          <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Email
          </label>
          <div className="relative mb-4">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="Enter your email"
              className="w-full rounded-xl border border-zinc-300 bg-white py-3 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>

          <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Password
          </label>
          <div className="relative mb-6">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="Create a password"
              className="w-full rounded-xl border border-zinc-300 bg-white py-3 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-zinc-700 dark:bg-zinc-900"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            disabled={loading}
            className="w-full rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-indigo-500 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function Benefit({ text }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/80 px-4 py-4 text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-300">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
          <CheckCircle2 size={15} />
        </span>
        <span>{text}</span>
      </div>
    </div>
  );
}
