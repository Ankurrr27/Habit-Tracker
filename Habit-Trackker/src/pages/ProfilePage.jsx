import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Flame,
  CheckCircle,
  Calendar,
  Shield,
  Eye,
  EyeOff,
  Sparkles,
  Link2,
  UserRound,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const emptyExternalProfiles = {
  github: "",
  leetcode: "",
  codeforces: "",
  codechef: "",
};

const profileFields = [
  { key: "github", label: "GitHub ID" },
  { key: "leetcode", label: "LeetCode ID" },
  { key: "codeforces", label: "Codeforces ID" },
  { key: "codechef", label: "CodeChef ID" },
];

export default function ProfilePage() {
  const { username } = useParams();
  const { user: me, setUser: setAuthUser } = useAuth();

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [profilePublic, setProfilePublic] = useState(false);
  const [externalProfiles, setExternalProfiles] = useState(
    emptyExternalProfiles
  );
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const isOwnProfile = Boolean(me && me.username === username);

  useEffect(() => {
    if (!username) return;

    setLoading(true);
    setError("");

    api
      .get(`/users/${username}`)
      .then((res) => {
        const nextUser = res.data;
        setUser(nextUser);
        setName(nextUser.name || "");
        setProfilePublic(Boolean(nextUser.profilePublic));
        setExternalProfiles(
          nextUser.externalProfiles || emptyExternalProfiles
        );
      })
      .catch(() => setError("Profile not found"))
      .finally(() => setLoading(false));
  }, [username]);

  useEffect(() => {
    if (!file) return undefined;

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleProfileChange = (key, value) => {
    setExternalProfiles((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submit = async () => {
    if (!isOwnProfile || saving) return;

    setSaving(true);
    setMsg("");

    try {
      let res;

      if (!file) {
        res = await api.put("/users/profile", {
          name,
          profilePublic,
          externalProfiles,
        });
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("profilePublic", String(profilePublic));
        formData.append(
          "externalProfiles",
          JSON.stringify(externalProfiles)
        );
        formData.append("avatar", file);
        res = await api.put("/users/profile", formData);
      }

      const updatedUser = {
        ...user,
        ...res.data.user,
      };

      setUser(updatedUser);
      setExternalProfiles(
        res.data.user.externalProfiles || emptyExternalProfiles
      );
      setAuthUser((prev) =>
        prev
          ? {
              ...prev,
              ...res.data.user,
            }
          : prev
      );
      setFile(null);
      setPreview(null);
      setMsg("Profile updated successfully");
    } catch (requestError) {
      setMsg(requestError.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-500">
        Loading profile...
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
    <div className="min-h-[91vh] bg-white px-6 py-10 text-zinc-900 transition-colors dark:bg-black dark:text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-zinc-200 bg-zinc-50 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-16 top-0 h-40 w-40 rounded-full bg-indigo-500/15 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />
          </div>

          <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div
                className="
                  h-28 w-28 shrink-0 overflow-hidden rounded-[1.5rem]
                  border border-zinc-300 bg-indigo-600 text-4xl font-semibold text-white
                  shadow-lg shadow-indigo-500/10 dark:border-zinc-700
                  flex items-center justify-center select-none
                "
              >
                {preview || user.avatar ? (
                  <img
                    src={preview || user.avatar}
                    alt="avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (user.name || user.username || "?")[0].toUpperCase()
                )}
              </div>

              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-zinc-600 shadow-sm dark:bg-zinc-900 dark:text-zinc-300">
                  <Sparkles size={13} />
                  {isOwnProfile ? "Your profile" : "Public profile"}
                </div>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight">
                  {user.name}
                </h1>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  @{user.username}
                </p>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {isOwnProfile
                    ? "Keep your profile polished, connect coding handles, and decide how visible your progress should be."
                    : "This profile shows how consistent this user has been on the platform."}
                </p>

                {isOwnProfile && (
                  <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800">
                    <UserRound size={15} />
                    Change avatar
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(event) => setFile(event.target.files[0])}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Stat icon={<Flame size={18} />} label="Streak" value={user.currentStreak} />
              <Stat icon={<CheckCircle size={18} />} label="Completed" value={user.completedCount} />
              <Stat icon={<Calendar size={18} />} label="Active Days" value={user.activeDays} />
              <Stat icon={<Shield size={18} />} label="Credibility" value={user.credibilityScore} />
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[2rem] border border-zinc-200 bg-zinc-50 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              <Link2 size={16} />
              Coding profiles
            </div>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              These IDs are used for auto-tracked hobbies and visible identity across the app.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {profileFields.map((field) => (
                <label
                  key={field.key}
                  className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <span className="block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    {field.label}
                  </span>
                  {isOwnProfile ? (
                    <input
                      value={externalProfiles[field.key] || ""}
                      onChange={(event) =>
                        handleProfileChange(field.key, event.target.value)
                      }
                      className="
                        mt-3 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm
                        text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500
                        dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100
                      "
                      placeholder={`Add ${field.label}`}
                    />
                  ) : (
                    <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
                      {externalProfiles[field.key] || "Not shared"}
                    </p>
                  )}
                </label>
              ))}
            </div>
          </section>

          {isOwnProfile && (
            <aside className="space-y-6">
              <section className="rounded-[2rem] border border-zinc-200 bg-zinc-50 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Basic settings
                </h2>
                <label className="mt-4 block">
                  <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Name
                  </span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="
                      mt-3 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm
                      text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500
                      dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100
                    "
                  />
                </label>

                <button
                  onClick={() => setProfilePublic((value) => !value)}
                  className="mt-4 flex w-full items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  <span className="flex items-center gap-2">
                    {profilePublic ? <Eye size={16} /> : <EyeOff size={16} />}
                    Profile visibility
                  </span>
                  <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800">
                    {profilePublic ? "Public" : "Private"}
                  </span>
                </button>

                <button
                  onClick={submit}
                  disabled={saving}
                  className="mt-5 w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>

                {msg && (
                  <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                    {msg}
                  </p>
                )}
              </section>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        <span className="text-indigo-500">{icon}</span>
        {label}
      </div>
      <div className="mt-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        {value ?? "-"}
      </div>
    </div>
  );
}
