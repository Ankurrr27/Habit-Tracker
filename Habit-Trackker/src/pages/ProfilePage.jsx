import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import api from "../api/axios";
import {
  Calendar,
  CheckCircle,
  Crop,
  Eye,
  EyeOff,
  Flame,
  Link2,
  Shield,
  Sparkles,
  UserRound,
  ArrowRight,
  X,
  Check,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { motion as Motion, AnimatePresence } from "framer-motion";

const emptyExternalProfiles = {
  github: "",
  leetcode: "",
  codeforces: "",
  codechef: "",
  gfg: "",
  codolio: "",
};

const profileFields = [
  { key: "github", label: "GitHub" },
  { key: "leetcode", label: "LeetCode" },
  { key: "codeforces", label: "Codeforces" },
  { key: "codechef", label: "CodeChef" },
  { key: "gfg", label: "GFG" },
  { key: "codolio", label: "Codolio" },
];

export default function ProfilePage() {
  const { username } = useParams();
  const { user: me, setUser: setAuthUser } = useAuth();
  const targetUsername = username || me?.username;

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
  const [activeTab, setActiveTab] = useState("stats");
  const [cropSrc, setCropSrc] = useState(null); // raw image URL for crop modal
  const cropCanvasRef = useRef(null);

  const isOwnProfile = Boolean(me && me.username === targetUsername);

  useEffect(() => {
    if (!targetUsername) return;
    setLoading(true);
    setError("");
    api
      .get(`/users/${targetUsername}`)
      .then((res) => {
        const nextUser = res.data;
        setUser(nextUser);
        setName(nextUser.name || "");
        setProfilePublic(Boolean(nextUser.profilePublic));
        setExternalProfiles(nextUser.externalProfiles || emptyExternalProfiles);
      })
      .catch(() => setError("Profile not found"))
      .finally(() => setLoading(false));
  }, [targetUsername]);

  useEffect(() => {
    if (!file) return undefined;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setCropSrc(url); // open crop modal automatically when file chosen
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Apply square centre-crop via canvas
  const applyCrop = useCallback(() => {
    if (!cropSrc) return;
    const img = new Image();
    img.onload = () => {
      const size = Math.min(img.width, img.height);
      const sx = (img.width - size) / 2;
      const sy = (img.height - size) / 2;
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, sx, sy, size, size, 0, 0, 400, 400);
      const cropped = canvas.toDataURL("image/jpeg", 0.92);
      setPreview(cropped);
      // convert dataURL back to File object
      canvas.toBlob(blob => setFile(new File([blob], "avatar.jpg", { type: "image/jpeg" })), "image/jpeg", 0.92);
      setCropSrc(null);
    };
    img.src = cropSrc;
  }, [cropSrc]);

  const joinedDate = useMemo(() => {
    if (!user?.createdAt) return "Unknown";
    return new Date(user.createdAt).toLocaleDateString(undefined, {
      year: "numeric", month: "short",
    });
  }, [user?.createdAt]);

  const completionRate = useMemo(() => {
    const completed = Number(user?.completedCount || 0);
    const activeDays = Number(user?.activeDays || 0);
    if (!activeDays) return "0%";
    return `${Math.min(100, Math.round((completed / activeDays) * 100))}%`;
  }, [user?.activeDays, user?.completedCount]);

  const submit = async () => {
    if (!isOwnProfile || saving) return;
    setSaving(true);
    setMsg("");
    try {
      let res;
      if (!file) {
        res = await api.put("/users/profile", { name, profilePublic, externalProfiles });
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("profilePublic", String(profilePublic));
        formData.append("externalProfiles", JSON.stringify(externalProfiles));
        formData.append("avatar", file);
        res = await api.put("/users/profile", formData);
      }
      const updatedUser = { ...user, ...res.data.user };
      setUser(updatedUser);
      setAuthUser((prev) => (prev ? { ...prev, ...res.data.user } : prev));
      setFile(null);
      setPreview(null);
      setMsg("Saved.");
    } catch (err) {
      setMsg(err.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400 animate-pulse">Loading...</p>
    </div>
  );
  if (error) return (
    <div className="h-full flex items-center justify-center">
      <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-red-400">{error}</p>
    </div>
  );
  if (!user) return null;

  const tabs = isOwnProfile
    ? [{ id: "stats", label: "Stats" }, { id: "links", label: "Links" }, { id: "settings", label: "Settings" }]
    : [{ id: "stats", label: "Stats" }, { id: "links", label: "Links" }];

  return (
    <div className="flex flex-col lg:flex-row w-full h-full lg:overflow-hidden bg-transparent">

      {/* LEFT PANEL — Avatar + Identity */}
      <aside className="lg:shrink-0 h-full w-full lg:w-[300px] border-r border-zinc-100 dark:border-zinc-900/50">
        <div className="h-full flex flex-col px-6 py-8 gap-8">

          {/* Avatar — large stacked */}
          <div className="flex flex-col items-center gap-6 pt-4">
            <div className="relative group">
              <div className="h-[180px] w-[180px] overflow-hidden rounded-[2.5rem] bg-indigo-600 shadow-2xl shadow-indigo-600/25 transition-all duration-500 group-hover:rounded-[2rem]">
                {preview || user.avatar ? (
                  <img src={preview || user.avatar} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-5xl font-extrabold text-white">
                    {(user.name || user.username || "?")[0].toUpperCase()}
                  </div>
                )}
              </div>

              {isOwnProfile && (
                <label className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xl hover:bg-indigo-600 transition-all">
                  <UserRound size={15} />
                  <input type="file" hidden accept="image/*" onChange={(e) => { if(e.target.files[0]) setFile(e.target.files[0]); }} />
                </label>
              )}
            </div>

            {/* Crop trigger — shown when a new file is picked */}
            {isOwnProfile && preview && file && (
              <button
                onClick={() => setCropSrc(preview)}
                className="flex items-center gap-1.5 rounded-full border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition"
              >
                <Crop size={11} />
                Crop Image
              </button>
            )}

            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Sparkles size={10} className="text-indigo-500" />
                <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-indigo-500">
                  {isOwnProfile ? "You" : "Profile"}
                </span>
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                {user.name || user.username}
              </h1>
              <p className="text-sm text-zinc-400 font-medium">@{user.username}</p>
            </div>
          </div>

          {/* Meta */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <Calendar size={12} strokeWidth={2.5} />
              <span>Since {joinedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-1.5 w-1.5 rounded-full ${profilePublic ? "bg-emerald-500" : "bg-zinc-400"}`} />
              <span className="text-[11px] text-zinc-400">{profilePublic ? "Public profile" : "Private profile"}</span>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 gap-3">
            <StatTile icon={<Flame size={14} />} label="Streak" value={user.currentStreak ?? 0} color="text-orange-500" />
            <StatTile icon={<CheckCircle size={14} />} label="Ticks" value={user.completedCount ?? 0} color="text-emerald-500" />
            <StatTile icon={<Calendar size={14} />} label="Active Days" value={user.activeDays ?? 0} color="text-indigo-500" />
            <StatTile icon={<Shield size={14} />} label="Trust" value={user.credibilityScore ?? 0} color="text-violet-500" />
          </div>

          {/* Completion rate bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              <span>Completion Rate</span>
              <span className="text-zinc-900 dark:text-zinc-100">{completionRate}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
              <Motion.div
                className="h-full rounded-full bg-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: completionRate }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>

        </div>
      </aside>

      {/* RIGHT PANEL — Tabbed content */}
      <main className="flex-1 w-full h-full flex flex-col overflow-hidden">
        {/* Tab header — identical style to Dashboard */}
        <div className="flex bg-zinc-50/50 dark:bg-zinc-900/30 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] transition-all
                ${activeTab === tab.id
                  ? "text-indigo-600 dark:text-indigo-400 bg-white dark:bg-zinc-950 font-bold border-b-2 border-indigo-600 dark:border-indigo-400"
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8">
          <AnimatePresence mode="wait">
            {/* STATS TAB */}
            {activeTab === "stats" && (
              <Motion.div
                key="stats"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-10"
              >
                <SectionLabel icon={<Flame size={16} />} title="Performance" sub="Historical consistency" />
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  <LongMetric label="Streak" value={user.currentStreak ?? 0} unit="days" />
                  <LongMetric label="Completion" value={completionRate} unit="rate" />
                  <LongMetric label="Total Ticks" value={user.completedCount ?? 0} unit="done" />
                  <LongMetric label="Active" value={user.activeDays ?? 0} unit="days" />
                </div>
              </Motion.div>
            )}

            {/* LINKS TAB */}
            {activeTab === "links" && (
              <Motion.div
                key="links"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-10"
              >
                <SectionLabel icon={<Link2 size={16} />} title="Linked IDs" sub="Cross-platform identities" />
                <div className="grid gap-4 sm:grid-cols-2">
                  {profileFields.map((field) => {
                    const val = externalProfiles[field.key];
                    if (!isOwnProfile && !val) return null;
                    return (
                      <div key={field.key} className="space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{field.label}</p>
                        {isOwnProfile ? (
                          <input
                            value={val || ""}
                            onChange={(e) => setExternalProfiles((p) => ({ ...p, [field.key]: e.target.value }))}
                            className={inputClass}
                            placeholder={`Enter ${field.label}...`}
                          />
                        ) : (
                          <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{val || "—"}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
                {isOwnProfile && (
                  <SaveButton saving={saving} onClick={submit} msg={msg} />
                )}
              </Motion.div>
            )}

            {/* SETTINGS TAB - own profile only */}
            {activeTab === "settings" && isOwnProfile && (
              <Motion.div
                key="settings"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-10 max-w-md"
              >
                <SectionLabel icon={<Shield size={16} />} title="Settings" sub="Identity and visibility" />

                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Display Name</p>
                    <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                  </div>

                  <button
                    onClick={() => setProfilePublic(!profilePublic)}
                    className="flex w-full items-center justify-between rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 px-5 py-3.5 text-sm font-bold text-zinc-700 dark:text-zinc-300 border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      {profilePublic ? <Eye size={16} /> : <EyeOff size={16} />}
                      Visibility
                    </span>
                    <span className={`text-[10px] uppercase font-black tracking-widest ${profilePublic ? "text-emerald-500" : "text-zinc-400"}`}>
                      {profilePublic ? "Public" : "Private"}
                    </span>
                  </button>
                </div>

                <SaveButton saving={saving} onClick={submit} msg={msg} />
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* CROP MODAL */}
      <AnimatePresence>
        {cropSrc && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6"
          >
            <Motion.div
              initial={{ scale: 0.94, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 12 }}
              className="bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-sm overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-indigo-500 mb-0.5">Avatar</p>
                  <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">Crop Image</h3>
                </div>
                <button onClick={() => setCropSrc(null)} className="flex h-8 w-8 items-center justify-center rounded-xl text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition">
                  <X size={16} />
                </button>
              </div>

              {/* Preview */}
              <div className="p-6 flex flex-col items-center gap-6">
                <div className="relative">
                  {/* Square clip indicator */}
                  <div className="h-[220px] w-[220px] overflow-hidden rounded-3xl border-2 border-dashed border-indigo-400/50 shadow-lg shadow-indigo-500/10">
                    <img src={cropSrc} alt="crop preview" className="h-full w-full object-cover" />
                  </div>
                  <p className="text-center text-[10px] text-zinc-400 mt-2">Square centre-crop will be applied</p>
                </div>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setCropSrc(null)}
                    className="flex-1 rounded-full border border-zinc-200 dark:border-zinc-700 py-2.5 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applyCrop}
                    className="flex-1 flex items-center justify-center gap-2 rounded-full bg-indigo-600 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition active:scale-95"
                  >
                    <Check size={13} />
                    Apply Crop
                  </button>
                </div>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Sub-components ── */

function StatTile({ icon, label, value, color }) {
  return (
    <div className="rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800 px-4 py-3.5 space-y-1">
      <div className={`flex items-center gap-1.5 ${color}`}>{icon}</div>
      <p className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 tabular-nums tracking-tight">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</p>
    </div>
  );
}

function LongMetric({ label, value, unit }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</p>
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tabular-nums tracking-tight">{value}</span>
        <span className="text-[11px] font-bold uppercase text-zinc-400">{unit}</span>
      </div>
    </div>
  );
}

function SectionLabel({ icon, title, sub }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
        {icon}
      </span>
      <div>
        <h2 className="text-base font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">{title}</h2>
        <p className="text-[11px] text-zinc-400">{sub}</p>
      </div>
    </div>
  );
}

function SaveButton({ saving, onClick, msg }) {
  return (
    <div className="space-y-3">
      <button
        onClick={onClick}
        disabled={saving}
        className="flex items-center justify-center gap-2.5 rounded-full bg-indigo-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Changes"}
        <ArrowRight size={15} />
      </button>
      {msg && <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 text-center">{msg}</p>}
    </div>
  );
}

const inputClass = `
  w-full rounded-xl border border-zinc-100 bg-zinc-50/30 px-4 py-2.5 text-sm font-semibold
  text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:bg-white
  dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:bg-zinc-950 transition-all
`;
