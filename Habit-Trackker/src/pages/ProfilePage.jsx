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
import { useParams } from "react-router-dom";

export default function ProfilePage() {
  const { username } = useParams();

  const [user, setUser] = useState(null);
  const [me, setMe] = useState(null);
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [profilePublic, setProfilePublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get(`/auth/u/${username}`).then((res) => {
      setUser(res.data);
      setName(res.data.name);
      setProfilePublic(res.data.profilePublic ?? false);
    });
  }, [username]);

  useEffect(() => {
    api.get("/auth/me").then((res) => setMe(res.data)).catch(() => {});
  }, []);

  const isOwnProfile = me?.username === username;

  const submit = async () => {
    if (!isOwnProfile) return;
    setLoading(true);
    setMsg("");

    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("profilePublic", profilePublic);
      if (file) fd.append("avatar", file);

      await api.put("/auth/profile", fd);
      setMsg("Profile updated");
    } catch {
      setMsg("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-500">
        Loading profile…
      </div>
    );
  }

  return (
    <div className="min-h-[91vh] bg-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ================= LEFT COLUMN ================= */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* HEADER */}
          <div className="flex gap-6 bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <img
              src={user.avatar || "/avatar-placeholder.png"}
              className="w-24 h-24 rounded-full object-cover border border-zinc-700"
            />

            <div className="flex-1">
              <h1 className="text-2xl font-semibold">{user.name}</h1>
              <p className="text-sm text-zinc-400">@{user.username}</p>
              <p className="text-xs text-zinc-500 mt-1">
                Joined {new Date(user.createdAt).toDateString()}
              </p>

              {isOwnProfile && (
                <label className="inline-block mt-3 text-xs text-indigo-400 cursor-pointer">
                  Change avatar
                  <input
                    type="file"
                    hidden
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </label>
              )}
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat icon={<Flame />} label="Streak" value={user.currentStreak} />
            <Stat icon={<CheckCircle />} label="Completed" value={user.completedCount} />
            <Stat icon={<Calendar />} label="Active Days" value={user.activeDays} />
            <Stat icon={<Shield />} label="Credibility" value={user.credibilityScore} />
          </div>

          {/* ACTIVITY PLACEHOLDER */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <h2 className="text-sm font-semibold text-zinc-300 mb-2">
              Recent Activity
            </h2>
            <p className="text-xs text-zinc-500">
              Activity timeline will appear here.
            </p>
          </div>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="space-y-6">

          {/* ABOUT */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <h2 className="text-sm font-semibold text-zinc-300 mb-2">
              About
            </h2>
            <p className="text-xs text-zinc-400">
              Habit-focused user building consistency over time.
            </p>
          </div>

          {/* VISIBILITY */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <h2 className="text-sm font-semibold text-zinc-300 mb-3">
              Profile Visibility
            </h2>

            {isOwnProfile && (
              <button
                onClick={() => setProfilePublic((p) => !p)}
                className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white"
              >
                {profilePublic ? <Eye /> : <EyeOff />}
                {profilePublic ? "Public" : "Private"}
              </button>
            )}
          </div>

          {/* SETTINGS */}
          {isOwnProfile && (
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
              <h2 className="text-sm font-semibold text-zinc-300 mb-3">
                Profile Settings
              </h2>

              <label className="text-xs text-zinc-400">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 mb-3 p-2 rounded bg-zinc-800 border border-zinc-700"
              />

              <button
                onClick={submit}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded"
              >
                {loading ? "Saving…" : "Save Changes"}
              </button>

              {msg && <p className="text-xs text-zinc-400 mt-2">{msg}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= STAT ================= */
function Stat({ icon, label, value }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex gap-3">
      <div className="text-indigo-400">{icon}</div>
      <div>
        <p className="text-xs text-zinc-400">{label}</p>
        <p className="text-lg font-semibold">{value ?? "—"}</p>
      </div>
    </div>
  );
}
