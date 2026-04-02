import { Download, Puzzle, ShieldCheck } from "lucide-react";

export default function ExtensionPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <section className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="border-b border-zinc-200 bg-zinc-50/80 px-6 py-6 dark:border-zinc-800 dark:bg-zinc-900/70">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            Browser tools
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
            Download Extension
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Install the extension to make it easier to capture work, keep habits visible while you
            browse, and bring progress into your normal workflow.
          </p>
        </div>

        <div className="grid gap-4 px-6 py-6 md:grid-cols-3">
          <InfoCard
            icon={<Puzzle size={18} />}
            title="Quick capture"
            description="Save ideas and task context without leaving the page you are already on."
          />
          <InfoCard
            icon={<ShieldCheck size={18} />}
            title="Focused workflow"
            description="Keep tools lightweight so the extension helps instead of distracting."
          />
          <InfoCard
            icon={<Download size={18} />}
            title="Install ready"
            description="Use this area as the central place for future extension releases."
          />
        </div>

        <div className="px-6 pb-6">
          <div className="rounded-[1.5rem] bg-zinc-50 px-5 py-5 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
            The extension download is not wired to a packaged release yet, but the navigation entry
            and page are now in place so the dashboard has a proper destination instead of a hidden
            action.
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ icon, title, description }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white px-5 py-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
        {icon}
      </div>
      <h2 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{description}</p>
    </div>
  );
}
