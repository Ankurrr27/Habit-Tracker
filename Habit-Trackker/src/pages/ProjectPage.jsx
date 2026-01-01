import { Hammer, Rocket } from "lucide-react";

export default function ProjectPage() {
  return (
    <div className="
      min-h-[calc(100vh-64px)]
      flex items-center justify-center
      bg-white dark:bg-black
      text-zinc-900 dark:text-white
      px-6
    ">
      <div className="
        max-w-md w-full
        text-center
        bg-zinc-100 dark:bg-zinc-900
        border border-zinc-200 dark:border-zinc-800
        rounded-2xl
        p-8
        shadow-sm
      ">
        {/* ICON */}
        <div className="
          mx-auto mb-4
          w-12 h-12
          flex items-center justify-center
          rounded-xl
          bg-indigo-500/10
          text-indigo-500
        ">
          <Hammer size={22} />
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-semibold mb-2">
          Projects — Coming Soon
        </h1>

        {/* DESC */}
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Team projects and shared tasks are currently under development.
          You’ll be able to create projects, assign group tasks, and track
          progress together.
        </p>

        {/* FOOTNOTE */}
        <div className="
          mt-6
          flex items-center justify-center gap-2
          text-xs text-zinc-500 dark:text-zinc-500
        ">
          <Rocket size={14} />
          Launching soon
        </div>
      </div>
    </div>
  );
}
