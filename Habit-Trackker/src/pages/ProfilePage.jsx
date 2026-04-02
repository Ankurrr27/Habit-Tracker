import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import {
  Calendar,
  CheckCircle,
  Eye,
  EyeOff,
  Flame,
  Link2,
  Mail,
  Shield,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const emptyExternalProfiles = {
  github: "",
  leetcode: "",
  codeforces: "",
  codechef: "",
  gfg: "",
  codolio: "",
};

const profileFields = [
  { key: "github", label: "GitHub ID" },
  { key: "leetcode", label: "LeetCode ID" },
  { key: "codeforces", label: "Codeforces ID" },
  { key: "codechef", label: "CodeChef ID" },
  { key: "gfg", label: "GFG Link or ID" },
  { key: "codolio", label: "Codolio Link or ID" },
];

export default function ProfilePage() {
  const { username } = useParams();
  const { user: me, setUser: setAuthUser } = useAuth();

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [profilePublic, setProfilePublic] = useState(false);
  const [externalProfiles, setExternalProfiles] = useState(emptyExternalProfiles);
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
        setExternalProfiles(nextUser.externalProfiles || emptyExternalProfiles);
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

  const joinedDate = useMemo(() => {
    if (!user?.createdAt) return "Recently joined";
    return new Date(user.createdAt).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, [user?.createdAt]);

  const completionRate = useMemo(() => {
    const completed = Number(user?.completedCount || 0);
    const activeDays = Number(user?.activeDays || 0);
    if (!activeDays) return "0%";
    return `${Math.min(100, Math.round((completed / activeDays) * 100))}%`;
  }, [user?.activeDays, user?.completedCount]);

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
        formData.append("externalProfiles", JSON.stringify(externalProfiles));
        formData.append("avatar", file);
        res = await api.put("/users/profile", formData);
      }

      const updatedUser = {
        ...user,
        ...res.data.user,
      };

      setUser(updatedUser);
      setExternalProfiles(res.data.user.externalProfiles || emptyExternalProfiles);
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
      <div className="flex min-h-screen items-center justify-center text-zinc-500">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white px-4 py-6 text-zinc-900 transition-colors dark:bg-black dark:text-white sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm dark:bg-zinc-950">
          <div className="relative bg-zinc-50/80 px-5 py-6 dark:bg-zinc-900/70 sm:px-6">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-16 top-0 h-40 w-40 rounded-full bg-indigo-500/15 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />
            </div>

            <div className="relative grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div
                  className="
                    flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[1.5rem]
                    bg-indigo-600 text-4xl font-semibold text-white shadow-lg shadow-indigo-500/10 select-none
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
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-zinc-600 shadow-sm dark:bg-zinc-950 dark:text-zinc-300">
                    <Sparkles size={13} />
                    {isOwnProfile ? "Your profile" : "Public profile"}
                  </div>
                  <h1 className="mt-4 text-3xl font-semibold tracking-tight">{user.name}</h1>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">@{user.username}</p>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {isOwnProfile
                      ? "Keep your profile polished, connect coding handles, and make your progress easy to read."
                      : "This profile shows how consistent this user has been on the platform."}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                    <MetaPill icon={<Mail size={14} />} text={user.email || "No email"} />
                    <MetaPill icon={<Calendar size={14} />} text={`Joined ${joinedDate}`} />
                  </div>

                  {isOwnProfile && (
                    <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800">
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

              <div className="grid gap-3 sm:grid-cols-2">
                <StatCard icon={<Flame size={18} />} label="Current streak" value={user.currentStreak} />
                <StatCard icon={<CheckCircle size={18} />} label="Completed" value={user.completedCount} />
                <StatCard icon={<Calendar size={18} />} label="Active days" value={user.activeDays} />
                <StatCard icon={<Shield size={18} />} label="Credibility" value={user.credibilityScore} />
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="space-y-6">
            <section className="rounded-[1.75rem] bg-white px-5 py-6 shadow-sm dark:bg-zinc-950 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                  <UserRound size={18} />
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Profile info
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Core account details and visibility settings.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <InfoRow label="Name" value={user.name} />
                <InfoRow label="Email" value={user.email || "Not available"} />
                <InfoRow label="Username" value={`@${user.username}`} />
                <InfoRow label="Joined" value={joinedDate} />
              </div>
            </section>

            <section className="rounded-[1.75rem] bg-white px-5 py-6 shadow-sm dark:bg-zinc-950 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <Flame size={18} />
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Habit stats
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    A quick read on consistency and recent activity.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Streak" value={user.currentStreak ?? 0} />
                <Metric label="Completion rate" value={completionRate} />
                <Metric label="Completed habits" value={user.completedCount ?? 0} />
                <Metric label="Active days" value={user.activeDays ?? 0} />
              </div>
            </section>

            <section className="rounded-[1.75rem] bg-white px-5 py-6 shadow-sm dark:bg-zinc-950 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                  <Link2 size={18} />
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Coding profiles
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    These IDs are used for auto-tracked hobbies and visible identity across the app.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {profileFields.map((field) => (
                  <label key={field.key} className="rounded-2xl bg-zinc-50 px-4 py-4 dark:bg-zinc-900">
                    <span className="block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      {field.label}
                    </span>
                    {isOwnProfile ? (
                      <input
                        value={externalProfiles[field.key] || ""}
                        onChange={(event) => handleProfileChange(field.key, event.target.value)}
                        className="
                          mt-3 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm
                          text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30
                          dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100
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
          </section>

          {isOwnProfile && (
            <aside className="space-y-6">
              <section className="rounded-[1.75rem] bg-white px-5 py-6 shadow-sm dark:bg-zinc-950 sm:px-6">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Account settings
                </h2>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  Update how your profile appears and how much is visible to others.
                </p>

                <label className="mt-5 block">
                  <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Display name
                  </span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="
                      mt-3 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm
                      text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30
                      dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100
                    "
                  />
                </label>

                <button
                  onClick={() => setProfilePublic((value) => !value)}
                  className="mt-4 flex w-full items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  <span className="flex items-center gap-2">
                    {profilePublic ? <Eye size={16} /> : <EyeOff size={16} />}
                    Profile visibility
                  </span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs dark:bg-zinc-950">
                    {profilePublic ? "Public" : "Private"}
                  </span>
                </button>

                <button
                  onClick={submit}
                  disabled={saving}
                  className="mt-5 w-full rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>

                {msg && <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">{msg}</p>}
              </section>

              <section className="rounded-[1.75rem] bg-white px-5 py-6 shadow-sm dark:bg-zinc-950 sm:px-6">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Account activity
                </h2>
                <div className="mt-4 space-y-3">
                  <ActivityRow label="Joined platform" value={joinedDate} />
                  <ActivityRow label="Credibility score" value={user.credibilityScore ?? 0} />
                  <ActivityRow label="Current visibility" value={profilePublic ? "Public" : "Private"} />
                </div>
              </section>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-4 shadow-sm dark:bg-zinc-950">
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

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl bg-zinc-50 px-4 py-4 dark:bg-zinc-900">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="rounded-2xl bg-zinc-50 px-4 py-4 dark:bg-zinc-900">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">{value}</p>
    </div>
  );
}

function MetaPill({ icon, text }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm dark:bg-zinc-950">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function ActivityRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3 text-sm dark:bg-zinc-900">
      <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="font-medium text-zinc-900 dark:text-zinc-100">{value}</span>
    </div>
  );
}
