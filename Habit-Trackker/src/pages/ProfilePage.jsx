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
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { username } = useParams();
  const { user: me } = useAuth();

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [profilePublic, setProfilePublic] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const isOwnProfile = Boolean(me && me.username === username);

  /* FETCH PROFILE */
  useEffect(() => {
    if (!username) return;

    setLoading(true);
    setError("");

    api
      .get(`/users/${username}`)
      .then((res) => {
        setUser(res.data);
        setName(res.data.name || "");
        setProfilePublic(Boolean(res.data.profilePublic));
      })
      .catch(() => setError("Profile not found"))
      .finally(() => setLoading(false));
  }, [username]);

  /* AVATAR PREVIEW */
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  /* UPDATE PROFILE */
  const submit = async () => {
    if (!isOwnProfile || saving) return;

    setSaving(true);
    setMsg("");

    try {
      let res;

      if (!file) {
        res = await api.put("/users/profile", { name, profilePublic });
      } else {
        const fd = new FormData();
        fd.append("name", name);
        fd.append("profilePublic", profilePublic);
        fd.append("avatar", file);
        res = await api.put("/users/profile", fd);
      }

      setUser((prev) => ({ ...prev, ...res.data }));
      setFile(null);
      setPreview(null);
      setMsg("Profile updated successfully");
    } catch {
      setMsg("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-500">
        Loading profile…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!user) return null;

  return (
    <div
      className="
        min-h-[91vh]
        bg-white dark:bg-black
        text-zinc-900 dark:text-white
        px-6 py-10
        transition-colors
      "
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* HEADER */}
          <div className="flex gap-6 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl">
            <img
              src={preview || user.avatar || "/avatar-placeholder.png"}
              className="w-24 h-24 rounded-full object-cover border border-zinc-300 dark:border-zinc-700"
            />

            <div className="flex-1">
              <h1 className="text-2xl font-semibold">{user.name}</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                @{user.username}
              </p>

              {isOwnProfile && (
                <label className="inline-block mt-3 text-xs text-indigo-500 cursor-pointer">
                  Change avatar
                  <input
                    type="file"
                    hidden
                    accept="image/*"
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
        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {isOwnProfile && (
            <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl">
              <button
                onClick={() => setProfilePublic((p) => !p)}
                className="flex items-center gap-2 text-sm"
              >
                {profilePublic ? <Eye /> : <EyeOff />}
                {profilePublic ? "Public" : "Private"}
              </button>
            </div>
          )}

          {isOwnProfile && (
            <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl">
              <label className="text-xs text-zinc-500 dark:text-zinc-400">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="
                  w-full mt-1 mb-3 p-2 rounded
                  bg-white dark:bg-zinc-800
                  border border-zinc-300 dark:border-zinc-700
                "
              />

              <button
                onClick={submit}
                disabled={saving}
                className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded text-white disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>

              {msg && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                  {msg}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* STAT */
function Stat({ icon, label, value }) {
  return (
    <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex gap-3">
      <div className="text-indigo-500">{icon}</div>
      <div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
        <p className="text-lg font-semibold">{value ?? "—"}</p>
      </div>
    </div>
  );
}
