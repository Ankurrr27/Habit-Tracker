import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Flame,
  CheckCircle,
  Calendar,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [profilePublic, setProfilePublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  /* =====================
     FETCH PROFILE
  ===================== */
  useEffect(() => {
    api.get("/auth/me").then((res) => {
      setUser(res.data);
      setName(res.data.name);
      setProfilePublic(res.data.profilePublic);
    });
  }, []);

  /* =====================
     UPDATE PROFILE
  ===================== */
  const submit = async () => {
    setMsg("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("profilePublic", profilePublic);
      if (file) formData.append("avatar", file);

      await api.put("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMsg("Profile updated");
    } catch {
      setMsg("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-zinc-500 flex items-center justify-center">
        Loading profile…
      </div>
    );
  }

  return (
    <div className="min-h-[91vh] bg-black  text-white px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* ================= HEADER ================= */}
        <div className="flex items-center gap-6 bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
          <img
            src={user.avatar || "/avatar-placeholder.png"}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover border border-zinc-700"
          />

          <div className="flex-1">
            <h1 className="text-xl font-semibold">{user.name}</h1>
            <p className="text-sm text-zinc-400">{user.email}</p>

            <p className="text-xs text-zinc-500 mt-1">
              Joined {new Date(user.createdAt).toDateString()}
            </p>

            <label className="inline-block mt-3 text-xs text-indigo-400 cursor-pointer">
              Change avatar
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat icon={<Flame />} label="Current Streak" value={user.currentStreak} />
          <Stat icon={<CheckCircle />} label="Completed" value={user.completedCount} />
          <Stat icon={<Calendar />} label="Active Days" value={user.activeDays} />
          <Stat icon={<Shield />} label="Credibility" value={user.credibilityScore} />
        </div>

        {/* ================= SETTINGS ================= */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-6">
          <h2 className="text-sm font-semibold text-zinc-300">
            Profile Settings
          </h2>

          {/* NAME */}
          <div>
            <label className="text-xs text-zinc-400">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-2 rounded bg-zinc-800 border border-zinc-700"
            />
          </div>

          {/* VISIBILITY */}
          <button
            onClick={() => setProfilePublic((p) => !p)}
            className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white"
          >
            {profilePublic ? <Eye /> : <EyeOff />}
            Profile is {profilePublic ? "Public" : "Private"}
          </button>

          {/* SAVE */}
          <button
            onClick={submit}
            disabled={loading}
            className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 transition"
          >
            {loading ? "Saving…" : "Save Changes"}
          </button>

          {msg && (
            <p className="text-xs text-zinc-400">{msg}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */
function Stat({ icon, label, value }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-3">
      <div className="text-indigo-400">{icon}</div>
      <div>
        <p className="text-xs text-zinc-400">{label}</p>
        <p className="text-lg font-semibold">{value ?? "—"}</p>
      </div>
    </div>
  );
}
