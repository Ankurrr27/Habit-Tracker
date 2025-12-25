import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/login", form);
      navigate("/"); // success → home
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-zinc-900 p-6 rounded-lg border border-zinc-800"
      >
        <h1 className="text-xl text-white font-semibold mb-4">Login</h1>

        <input
          name="email"
          placeholder="Email"
          onChange={change}
          required
          className="w-full mb-3 px-3 py-2 bg-zinc-800 text-white rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={change}
          required
          className="w-full mb-4 px-3 py-2 bg-zinc-800 text-white rounded"
        />

        <button
          disabled={loading}
          className="w-full bg-white text-black py-2 rounded font-medium"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-zinc-400 mt-4">
          No account?{" "}
          <Link to="/register" className="text-white underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
