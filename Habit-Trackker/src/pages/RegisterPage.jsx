import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
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
    <div
      className="
        min-h-screen flex items-center justify-center px-4 relative overflow-hidden
        bg-white dark:bg-black
        text-zinc-900 dark:text-white
      "
    >
      {/* BACKGROUND */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />

      <form
        onSubmit={submit}
        className="
          relative w-full max-w-sm
          bg-white/90 dark:bg-zinc-900/90 backdrop-blur
          border border-zinc-200 dark:border-zinc-800
          p-6 sm:p-8 rounded-2xl shadow-xl
        "
      >
        {/* HEADER */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Start building habits that stick
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        {/* GOOGLE SIGNUP */}
<div className="mb-5 flex justify-center">
  <GoogleLogin
    onSuccess={async (credentialResponse) => {
      try {
        const res = await api.post("/auth/google", {
          credential: credentialResponse.credential, // ✅ FIXED
        });

        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } catch (err) {
        console.error(err);
        setError("Google signup failed");
      }
    }}
    onError={() => setError("Google signup failed")}
  />
</div>


        {/* DIVIDER */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
          <span className="text-xs text-zinc-400">OR</span>
          <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
        </div>

        {/* NAME */}
        <label className="text-xs text-zinc-600 dark:text-zinc-400 mb-1 block">
          Full Name
        </label>
        <div className="relative mb-4">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="
              w-full pl-10 pr-3 py-2 rounded-md
              bg-white dark:bg-zinc-800
              border border-zinc-300 dark:border-zinc-700
              focus:ring-2 focus:ring-indigo-500/50
            "
          />
        </div>

        {/* EMAIL */}
        <label className="text-xs text-zinc-600 dark:text-zinc-400 mb-1 block">
          Email
        </label>
        <div className="relative mb-4">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="
              w-full pl-10 pr-3 py-2 rounded-md
              bg-white dark:bg-zinc-800
              border border-zinc-300 dark:border-zinc-700
              focus:ring-2 focus:ring-indigo-500/50
            "
          />
        </div>

        {/* PASSWORD */}
        <label className="text-xs text-zinc-600 dark:text-zinc-400 mb-1 block">
          Password
        </label>
        <div className="relative mb-6">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="
              w-full pl-10 pr-10 py-2 rounded-md
              bg-white dark:bg-zinc-800
              border border-zinc-300 dark:border-zinc-700
              focus:ring-2 focus:ring-indigo-500/50
            "
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* SUBMIT */}
        <button
          disabled={loading}
          className="
            w-full bg-indigo-600 hover:bg-indigo-700
            py-2.5 rounded-md font-medium text-white
            disabled:opacity-60
          "
        >
          {loading ? "Creating account…" : "Create Account"}
        </button>

        {/* FOOTER */}
        <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
