import { Download, ExternalLink, Puzzle, ShieldCheck, Zap, Terminal, Chrome, Key, Copy, Check } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

const packageHref = "/downloads/habtrack-extension.zip";
const releaseHref = "https://github.com/Ankurrr27/Extension-Habit-Tracker/releases/tag/1";

const TABS = [
  { id: "install", label: "Installation" },
  { id: "key", label: "Access Key" },
  { id: "spec", label: "Package Spec" },
];

const features = [
  { icon: <Puzzle size={18} />, title: "Panel Workflow", description: "Keeps the extension open alongside your browser.", color: "accent-bg-soft accent-text" },
  { icon: <ShieldCheck size={18} />, title: "Date Sync", description: "Synced with your local timezone — perfect alignment.", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
  { icon: <Zap size={18} />, title: "Instant Toggle", description: "Mark habits done directly from the side panel.", color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
];

const steps = [
  { step: "01", text: 'Download the extension package from the link on the right.' },
  { step: "02", text: "Decompress the archive into a dedicated directory." },
  { step: "03", text: 'Navigate to chrome://extensions in your browser.' },
  { step: "04", text: 'Toggle "Developer mode" in the upper right.' },
  { step: "05", text: 'Select "Load unpacked" and pick your decompressed folder.' },
  { step: "06", text: "Pin the extension icon and open the Side Panel." },
];

const specs = [
  ["Protocol ID", "verlocity-extension.zip"],
  ["Version", "1.2.0-Alpha"],
  ["Architecture", "V3 Side Panel API"],
  ["Transmission", "HTTPS / JSON Sync"],
  ["Source", "Open Source"],
  ["License", "Personal Use"],
];

export default function ExtensionPage() {
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("install");

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t && t !== "undefined") setToken(t);
  }, []);

  const copyToClipboard = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden bg-transparent">

      {/* LEFT+RIGHT split: hero on left, actions on right */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">

        {/* LEFT: Identity panel */}
        <aside className="lg:shrink-0 w-full lg:w-[320px] border-r border-white/30 dark:border-white/5 flex flex-col px-5 py-6 gap-8 overflow-y-auto sm:px-6 sm:py-8">
          <div className="page-header-copy space-y-0">
            <div className="flex items-center gap-2">
              <Chrome size={12} className="accent-text" />
              <span className="page-kicker">Browser Extension</span>
            </div>
            <h1 className="page-title">Side Panel</h1>
            <p className="page-subtitle">
              Verlocity stays with your browser flow so your progress is always one panel away.
            </p>
          </div>

          {/* Download buttons */}
          <div className="flex flex-col gap-2">
            <a
              href={releaseHref}
              target="_blank"
              rel="noreferrer"
              className="btn-primary px-5 py-2.5 text-xs"
            >
              <ExternalLink size={13} strokeWidth={3} />
              GitHub Release
            </a>
            <a
              href={packageHref}
              download
              className="btn-secondary px-5 py-2.5 text-xs dark:bg-zinc-100 dark:text-zinc-900"
            >
              <Download size={13} strokeWidth={3} />
              Download Bundle
            </a>
          </div>

          {/* Feature strip */}
          <div className="space-y-4">
            {features.map(f => (
              <div key={f.title} className="flex items-start gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${f.color}`}>{f.icon}</div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{f.title}</p>
                  <p className="text-[12px] font-medium text-zinc-400 leading-6">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* RIGHT: Tabbed detail */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab header */}
          <div className="shrink-0 px-4 pt-4 sm:px-6 sm:pt-5">
            <div className="segmented-control flex w-full">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`segmented-tab flex-1 ${activeTab === t.id ? "segmented-tab-active" : ""}`}
              >
                {t.label}
              </button>
            ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto page-shell">
            <AnimatePresence mode="wait">

              {activeTab === "install" && (
                <Motion.div key="install" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }} className="space-y-8 max-w-lg">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
                      <Terminal size={20} />
                    </span>
                    <div>
                      <h2 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">Installation</h2>
                      <p className="text-[11px] text-zinc-400">60-second setup procedure.</p>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {steps.map(s => (
                      <li key={s.step} className="flex items-start gap-4">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-[10px] font-bold text-zinc-400">{s.step}</span>
                        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed pt-0.5">{s.text}</p>
                      </li>
                    ))}
                  </ul>
                </Motion.div>
              )}

              {activeTab === "key" && (
                <Motion.div key="key" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }} className="space-y-8 max-w-lg">
                  <div className="flex items-center gap-3">
                    <span className="accent-bg-soft accent-text flex h-10 w-10 items-center justify-center rounded-xl">
                      <Key size={20} />
                    </span>
                    <div>
                      <h2 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">Access Key</h2>
                      <p className="text-[11px] text-zinc-400">Paste this into the extension settings.</p>
                    </div>
                  </div>
                  <div className="relative rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800 p-5">
                    <p className="font-mono text-[11px] break-all text-zinc-500 dark:text-zinc-400 select-all leading-relaxed">
                      {token || "Log in to generate your access key."}
                    </p>
                    {token && (
                      <button
                        onClick={copyToClipboard}
                        className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 px-3 py-1.5 text-[10px] font-semibold text-zinc-500 transition shadow-sm hover:[color:rgb(var(--primary))]"
                      >
                        {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Encrypted · Local Storage Only</p>
                  </div>
                </Motion.div>
              )}

              {activeTab === "spec" && (
                <Motion.div key="spec" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }} className="space-y-8">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
                      <Puzzle size={20} />
                    </span>
                    <div>
                      <h2 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">Package Spec</h2>
                      <p className="text-[11px] text-zinc-400">Technical details for v1.2</p>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {specs.map(([label, value]) => (
                      <div key={label} className="rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800 px-5 py-4 hover:border-indigo-500/20 transition-all">
                        <p className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-400 mb-1.5">{label}</p>
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{value}</p>
                      </div>
                    ))}
                  </div>
                </Motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
