import {
  Chrome,
  Download,
  ExternalLink,
  Puzzle,
  ShieldCheck,
  Terminal,
  Zap,
} from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const packageHref = "/downloads/habtrack-extension.zip";
const releaseHref =
  "https://github.com/Ankurrr27/Extension-Habit-Tracker/releases/tag/1";

const tabs = [
  { id: "install", label: "Installation" },
  { id: "spec", label: "Package Spec" },
];

const features = [
  {
    icon: <Puzzle size={18} />,
    title: "Panel Workflow",
    description: "Keeps the extension open alongside your browser.",
    color: "accent-bg-soft accent-text",
  },
  {
    icon: <ShieldCheck size={18} />,
    title: "Date Sync",
    description: "Synced with your local timezone for the same daily reset.",
    color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  {
    icon: <Zap size={18} />,
    title: "Instant Toggle",
    description: "Mark habits done directly from the side panel.",
    color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  },
];

const steps = [
  { step: "01", text: "Download the extension package from the link on the right." },
  { step: "02", text: "Extract the archive into a dedicated folder." },
  { step: "03", text: "Open chrome://extensions in your browser." },
  { step: "04", text: "Enable Developer mode in the top-right corner." },
  { step: "05", text: "Choose Load unpacked and select the extracted folder." },
  { step: "06", text: "Pin the extension and open the side panel." },
];

const specs = [
  ["Package", "verlocity-extension.zip"],
  ["Version", "1.2.0 Alpha"],
  ["Architecture", "Manifest V3 + Side Panel"],
  ["Transport", "HTTPS / JSON Sync"],
  ["Source", "Open Source"],
  ["License", "Personal Use"],
];

export default function ExtensionPage() {
  const [activeTab, setActiveTab] = useState("install");

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-transparent">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <aside className="flex w-full flex-col gap-8 overflow-y-auto border-r border-white/30 px-5 py-6 dark:border-white/5 sm:px-6 sm:py-8 lg:w-[320px] lg:shrink-0">
          <div className="page-header-copy space-y-0">
            <div className="flex items-center gap-2">
              <Chrome size={12} className="accent-text" />
              <span className="page-kicker">Browser Extension</span>
            </div>
            <h1 className="page-title">Side Panel</h1>
            <p className="page-subtitle">
              Verlocity stays close to your browser flow so habits and tasks are
              always one panel away.
            </p>
          </div>

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

          <div className="space-y-4">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${feature.color}`}
                >
                  {feature.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {feature.title}
                  </p>
                  <p className="text-[12px] font-medium leading-6 text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="shrink-0 px-4 pt-4 sm:px-6 sm:pt-5">
            <div className="segmented-control flex w-full">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`segmented-tab flex-1 ${
                    activeTab === tab.id ? "segmented-tab-active" : ""
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="page-shell flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === "install" && (
                <Motion.div
                  key="install"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="max-w-lg space-y-8"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                      <Terminal size={20} />
                    </span>
                    <div>
                      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                        Installation
                      </h2>
                      <p className="text-[11px] text-zinc-400">
                        Clean setup in under a minute.
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-4">
                    {steps.map((item) => (
                      <li key={item.step} className="flex items-start gap-4">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-zinc-100 bg-zinc-50 text-[10px] font-bold text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900">
                          {item.step}
                        </span>
                        <p className="pt-0.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                          {item.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                </Motion.div>
              )}

              {activeTab === "spec" && (
                <Motion.div
                  key="spec"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                      <Puzzle size={20} />
                    </span>
                    <div>
                      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                        Package Spec
                      </h2>
                      <p className="text-[11px] text-zinc-400">
                        Technical details for the current bundle.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {specs.map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-zinc-100 bg-zinc-50/50 px-5 py-4 transition-all hover:border-[rgba(var(--primary),0.22)] dark:border-zinc-800 dark:bg-zinc-900/30"
                      >
                        <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                          {label}
                        </p>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          {value}
                        </p>
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
