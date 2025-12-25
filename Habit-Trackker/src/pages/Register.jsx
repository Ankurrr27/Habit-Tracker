import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
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
        <h1 className="text-xl text-white font-semibold mb-4">Sign Up</h1>

        <input
          name="name"
          placeholder="Name"
          onChange={change}
          required
          className="w-full mb-3 px-3 py-2 bg-zinc-800 text-white rounded"
        />

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
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-sm text-zinc-400 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-white underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
