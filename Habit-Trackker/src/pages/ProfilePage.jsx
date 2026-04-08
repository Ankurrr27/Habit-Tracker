import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Calendar,
  Check,
  CheckCircle,
  Crop,
  Eye,
  EyeOff,
  Flame,
  Link2,
  MapPin,
  Palette,
  Quote,
  Shield,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import api from "../api/axios";
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
  { key: "github", label: "GitHub" },
  { key: "leetcode", label: "LeetCode" },
  { key: "codeforces", label: "Codeforces" },
  { key: "codechef", label: "CodeChef" },
  { key: "gfg", label: "GFG" },
  { key: "codolio", label: "Codolio" },
];

const accentSwatches = {
  indigo: "bg-indigo-500",
  sky: "bg-sky-400",
  rose: "bg-rose-400",
  emerald: "bg-emerald-500",
  cyan: "bg-cyan-500",
  orange: "bg-orange-500",
  violet: "bg-violet-500",
};

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
  const [message, setMessage] = useState("");
  const [bio, setBio] = useState("");
  const [tagline, setTagline] = useState("");
  const [location, setLocation] = useState("");
  const [accentColor, setAccentColor] = useState("indigo");
  const [activeTab, setActiveTab] = useState("stats");
  const [cropSrc, setCropSrc] = useState(null);

  const isOwnProfile = Boolean(me && me.username === targetUsername);

  useEffect(() => {
    if (!targetUsername) {
      return;
    }

    setLoading(true);
    setError("");

    api
      .get(`/users/${targetUsername}`)
      .then((response) => {
        const nextUser = response.data;

        setUser(nextUser);
        setName(nextUser.name || "");
        setBio(nextUser.bio || "");
        setTagline(nextUser.tagline || "");
        setLocation(nextUser.location || "");
        setAccentColor(nextUser.accentColor || "indigo");
        setProfilePublic(Boolean(nextUser.profilePublic));
        setExternalProfiles(nextUser.externalProfiles || emptyExternalProfiles);
      })
      .catch(() => setError("Profile not found"))
      .finally(() => setLoading(false));
  }, [targetUsername]);

  useEffect(() => {
    if (!file) {
      return undefined;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setCropSrc(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const applyCrop = useCallback(() => {
    if (!cropSrc) {
      return;
    }

    const image = new Image();

    image.onload = () => {
      const size = Math.min(image.width, image.height);
      const sx = (image.width - size) / 2;
      const sy = (image.height - size) / 2;
      const canvas = document.createElement("canvas");

      canvas.width = 400;
      canvas.height = 400;

      const context = canvas.getContext("2d");
      context.drawImage(image, sx, sy, size, size, 0, 0, 400, 400);

      const croppedPreview = canvas.toDataURL("image/jpeg", 0.92);
      setPreview(croppedPreview);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return;
          }

          setFile(new File([blob], "avatar.jpg", { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.92
      );

      setCropSrc(null);
    };

    image.src = cropSrc;
  }, [cropSrc]);

  const joinedDate = useMemo(() => {
    if (!user?.createdAt) {
      return "Unknown";
    }

    return new Date(user.createdAt).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
    });
  }, [user?.createdAt]);

  const completionRate = useMemo(
    () => user?.stats?.completionRate || "0%",
    [user?.stats?.completionRate]
  );

  const tabs = isOwnProfile
    ? [
        { id: "stats", label: "Stats" },
        { id: "links", label: "Links" },
        { id: "settings", label: "Settings" },
      ]
    : [
        { id: "stats", label: "Stats" },
        { id: "links", label: "Links" },
      ];

  const submit = async () => {
    if (!isOwnProfile || saving || !user) {
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      let response;

      if (!file) {
        response = await api.put("/users/profile", {
          name,
          profilePublic,
          externalProfiles,
          bio,
          tagline,
          location,
          accentColor,
        });
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("bio", bio);
        formData.append("tagline", tagline);
        formData.append("location", location);
        formData.append("accentColor", accentColor);
        formData.append("profilePublic", String(profilePublic));
        formData.append("externalProfiles", JSON.stringify(externalProfiles));
        formData.append("avatar", file);

        response = await api.put("/users/profile", formData);
      }

      const updatedUser = { ...user, ...response.data.user };
      setUser(updatedUser);
      setAuthUser((previous) =>
        previous ? { ...previous, ...response.data.user } : previous
      );
      setFile(null);
      setPreview(null);
      setMessage("Saved.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-2xl border-4 border-zinc-200 border-t-[rgb(var(--primary))]" />
        <p className="accent-text animate-pulse text-[11px] font-black uppercase tracking-[0.36em]">
          Initializing Profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-red-400">
          {error}
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div
      className={`theme-${user.accentColor || "indigo"} flex h-auto w-full flex-col bg-transparent lg:h-full lg:flex-row lg:overflow-hidden`}
    >
      <aside className="w-full shrink-0 border-b border-white/30 dark:border-white/5 lg:h-full lg:w-[340px] lg:border-b-0 lg:border-r">
        <div className="page-shell h-full">
          <div className="surface-card-strong flex h-full flex-col gap-8 p-6 sm:p-8">
            <div className="flex flex-col items-center gap-6">
              <div className="relative group">
                <div
                  className="flex h-[180px] w-[180px] items-center justify-center overflow-hidden rounded-[2.5rem] transition-all duration-500 group-hover:rounded-[2rem]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(var(--primary),0.96) 0%, rgba(var(--primary),0.74) 100%)",
                    boxShadow:
                      "0 32px 70px -34px rgba(var(--primary),0.46)",
                  }}
                >
                  {preview || user.avatar ? (
                    <img
                      src={preview || user.avatar}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-5xl font-semibold text-white">
                      {(user.name || user.username || "?")[0].toUpperCase()}
                    </div>
                  )}
                </div>

                {isOwnProfile && (
                  <label className="absolute -bottom-2 -right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-xl transition hover:bg-[rgb(var(--primary))] dark:bg-zinc-100 dark:text-zinc-900">
                    <UserRound size={15} />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(event) => {
                        if (event.target.files?.[0]) {
                          setFile(event.target.files[0]);
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              {isOwnProfile && preview && file && (
                <button
                  onClick={() => setCropSrc(preview)}
                  className="accent-pill accent-border flex items-center gap-1.5 rounded-full border px-4 py-1.5 transition hover:bg-[rgba(var(--primary),0.14)]"
                >
                  <Crop size={11} />
                  Crop Image
                </button>
              )}

              <div className="space-y-3 text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <Sparkles size={10} className="accent-text" />
                  <span className="accent-text text-[9px] font-bold uppercase tracking-[0.34em]">
                    {isOwnProfile ? "You" : "Profile"}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-semibold tracking-[-0.03em] text-zinc-900 dark:text-zinc-100">
                    {user.name || user.username}
                  </h1>
                  <p className="mt-1 text-sm font-medium text-zinc-400">
                    @{user.username}
                  </p>
                </div>

                {user.tagline && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/60 bg-zinc-100/50 px-3 py-1 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <Quote size={10} className="text-zinc-400" />
                    <p className="text-[10px] font-medium italic text-zinc-500">
                      "{user.tagline}"
                    </p>
                  </div>
                )}

                {user.bio && (
                  <p className="mx-auto max-w-[240px] text-sm font-medium leading-6 text-zinc-500 dark:text-zinc-400">
                    {user.bio}
                  </p>
                )}
              </div>
            </div>

            <div className="section-grid gap-4">
              <MetaRow icon={<Calendar size={13} />} value={`Joined ${joinedDate}`} />
              {user.location && (
                <MetaRow icon={<MapPin size={13} />} value={user.location} />
              )}
              <MetaRow
                icon={profilePublic ? <Eye size={13} /> : <EyeOff size={13} />}
                value={profilePublic ? "Public profile" : "Private profile"}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <StatTile
                icon={<Flame size={14} />}
                label="Streak"
                value={user.stats?.currentStreak ?? 0}
                colorClass="text-orange-500"
              />
              <StatTile
                icon={<CheckCircle size={14} />}
                label="Ticks"
                value={user.stats?.totalTicks ?? 0}
                colorClass="text-emerald-500"
              />
              <StatTile
                icon={<Calendar size={14} />}
                label="Active"
                value={user.stats?.activeDays ?? 0}
                colorClass="accent-text"
              />
              <StatTile
                icon={<Shield size={14} />}
                label="Trust"
                value={user.credibilityScore ?? 0}
                colorClass="text-violet-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                <span>Completion Rate</span>
                <span className="text-zinc-800 dark:text-zinc-100">
                  {completionRate}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
                <Motion.div
                  className="accent-bg h-full rounded-full shadow-[0_0_12px_rgba(var(--primary),0.3)]"
                  initial={{ width: 0 }}
                  animate={{ width: completionRate }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex h-auto w-full flex-1 flex-col lg:h-full lg:overflow-hidden">
        <div className="page-shell shrink-0 pb-4">
          <div className="page-header">
            <div className="page-header-copy">
              <div className="mb-1 flex items-center gap-2">
                <UserRound size={14} className="accent-text" />
                <span className="page-kicker">Profile Workspace</span>
              </div>
              <h2 className="page-title">Account and Progress</h2>
              <p className="page-subtitle">
                One consistent view for habit stats, public links, and profile
                settings.
              </p>
            </div>

            <div className="segmented-control flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`segmented-tab ${activeTab === tab.id ? "segmented-tab-active" : ""}`}
                  style={
                    activeTab === tab.id
                      ? {
                          color: "rgb(var(--primary))",
                        }
                      : undefined
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="page-shell flex-1 lg:overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === "stats" && (
              <Motion.div
                key="stats"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="page-stack max-w-none gap-6"
              >
                <SectionHeading
                  icon={<Flame size={16} />}
                  title="Performance"
                  subtitle="Historical consistency and activity rhythm."
                />
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <MetricCard
                    label="Current Streak"
                    value={user.stats?.currentStreak ?? 0}
                    unit="days"
                  />
                  <MetricCard label="Completion" value={completionRate} unit="rate" />
                  <MetricCard
                    label="Total Ticks"
                    value={user.stats?.totalTicks ?? 0}
                    unit="done"
                  />
                  <MetricCard
                    label="Active Days"
                    value={user.stats?.activeDays ?? 0}
                    unit="days"
                  />
                </div>
              </Motion.div>
            )}

            {activeTab === "links" && (
              <Motion.div
                key="links"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="page-stack max-w-none gap-6"
              >
                <SectionHeading
                  icon={<Link2 size={16} />}
                  title="Linked IDs"
                  subtitle="Cross-platform identities used across your workflow."
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  {profileFields.map((field) => {
                    const value = externalProfiles[field.key];

                    if (!isOwnProfile && !value) {
                      return null;
                    }

                    return (
                      <div key={field.key} className="surface-card p-5">
                        <p className="field-label mb-2">{field.label}</p>
                        {isOwnProfile ? (
                          <input
                            value={value || ""}
                            onChange={(event) =>
                              setExternalProfiles((previous) => ({
                                ...previous,
                                [field.key]: event.target.value,
                              }))
                            }
                            className="field-input"
                            placeholder={`Enter ${field.label}`}
                          />
                        ) : (
                          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                            {value || "-"}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {isOwnProfile && (
                  <SaveButton
                    saving={saving}
                    onClick={submit}
                    message={message}
                  />
                )}
              </Motion.div>
            )}

            {activeTab === "settings" && isOwnProfile && (
              <Motion.div
                key="settings"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="page-stack max-w-3xl gap-6"
              >
                <SectionHeading
                  icon={<Palette size={16} />}
                  title="Profile Settings"
                  subtitle="Identity, visibility, and personal accent configuration."
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FieldBlock label="Display Name">
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="field-input"
                      placeholder="Your name"
                    />
                  </FieldBlock>

                  <FieldBlock label="Tagline">
                    <input
                      value={tagline}
                      onChange={(event) => setTagline(event.target.value)}
                      className="field-input"
                      placeholder="Short emotional hook"
                    />
                  </FieldBlock>

                  <FieldBlock label="Biography" className="sm:col-span-2">
                    <textarea
                      value={bio}
                      onChange={(event) => setBio(event.target.value)}
                      className="field-input h-24 resize-none"
                      placeholder="Tell your story"
                    />
                  </FieldBlock>

                  <FieldBlock label="Location">
                    <input
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      className="field-input"
                      placeholder="City, Country"
                    />
                  </FieldBlock>

                  <FieldBlock label="Accent Color">
                    <div className="flex flex-wrap gap-3 pt-1">
                      {Object.keys(accentSwatches).map((color) => (
                        <button
                          key={color}
                          onClick={() => setAccentColor(color)}
                          className={`h-8 w-8 rounded-xl transition-all duration-300 ${
                            accentColor === color
                              ? "scale-110 ring-2 ring-zinc-400 ring-offset-2"
                              : "scale-90 opacity-60 hover:opacity-100"
                          } ${accentSwatches[color]}`}
                        />
                      ))}
                    </div>
                  </FieldBlock>
                </div>

                <div className="surface-card p-5">
                  <button
                    onClick={() => setProfilePublic((currentValue) => !currentValue)}
                    className="flex w-full items-center justify-between text-left"
                  >
                    <div className="space-y-1">
                      <p className="field-label">Profile Visibility</p>
                      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                        Choose whether other people can view this profile.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {profilePublic ? (
                        <Eye size={16} className="accent-text" />
                      ) : (
                        <EyeOff size={16} className="text-zinc-400" />
                      )}
                      <span
                        className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                          profilePublic ? "text-emerald-500" : "text-zinc-400"
                        }`}
                      >
                        {profilePublic ? "Public" : "Private"}
                      </span>
                    </div>
                  </button>
                </div>

                <SaveButton
                  saving={saving}
                  onClick={submit}
                  message={message}
                />
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {cropSrc && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
          >
            <Motion.div
              initial={{ scale: 0.94, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 12 }}
              className="w-full max-w-sm overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
                <div>
                  <p className="accent-text mb-0.5 text-[9px] font-bold uppercase tracking-[0.3em]">
                    Avatar
                  </p>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Crop Image
                  </h3>
                </div>

                <button
                  onClick={() => setCropSrc(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col items-center gap-6 p-6">
                <div className="relative">
                  <div className="h-[220px] w-[220px] overflow-hidden rounded-3xl border-2 border-dashed [border-color:rgba(var(--primary),0.35)] shadow-[0_24px_50px_-32px_rgba(var(--primary),0.35)]">
                    <img
                      src={cropSrc}
                      alt="crop preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="mt-2 text-center text-[10px] text-zinc-400">
                    Square centre crop will be applied
                  </p>
                </div>

                <div className="flex w-full gap-3">
                  <button
                    onClick={() => setCropSrc(null)}
                    className="btn-secondary flex-1 py-2.5 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applyCrop}
                    className="btn-primary flex flex-1 items-center justify-center gap-2 py-2.5 text-xs"
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

function MetaRow({ icon, value }) {
  return (
    <div className="flex items-center gap-2.5 text-sm font-medium text-zinc-500 dark:text-zinc-400">
      <span className="accent-text">{icon}</span>
      <span>{value}</span>
    </div>
  );
}

function StatTile({ icon, label, value, colorClass }) {
  return (
    <div className="surface-card flex flex-col items-center gap-2 p-4 text-center">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/60 ${colorClass}`}
      >
        {icon}
      </div>
      <p className="text-2xl font-semibold tracking-[-0.03em] text-zinc-900 dark:text-zinc-100">
        {value}
      </p>
      <p className="field-label">{label}</p>
    </div>
  );
}

function MetricCard({ label, value, unit }) {
  return (
    <div className="stat-card">
      <p className="field-label">{label}</p>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-semibold tracking-[-0.03em] text-zinc-900 dark:text-zinc-100">
          {value}
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
          {unit}
        </span>
      </div>
    </div>
  );
}

function SectionHeading({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3">
      <span className="accent-bg-soft accent-text flex h-10 w-10 items-center justify-center rounded-2xl">
        {icon}
      </span>
      <div>
        <h3 className="section-title">{title}</h3>
        <p className="section-copy">{subtitle}</p>
      </div>
    </div>
  );
}

function FieldBlock({ label, children, className = "" }) {
  return (
    <div className={`surface-card p-5 ${className}`.trim()}>
      <p className="field-label mb-2">{label}</p>
      {children}
    </div>
  );
}

function SaveButton({ saving, onClick, message }) {
  return (
    <div className="space-y-3">
      <button
        onClick={onClick}
        disabled={saving}
        className="btn-primary px-6 py-3 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Changes"}
        <ArrowRight size={15} />
      </button>
      {message && (
        <p className="accent-text text-center text-[11px] font-semibold uppercase tracking-[0.18em]">
          {message}
        </p>
      )}
    </div>
  );
}
