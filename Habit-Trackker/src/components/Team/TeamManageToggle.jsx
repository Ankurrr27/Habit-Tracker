import {
  Settings,
  UserPlus,
  LogOut,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function TeamManageToggle({
  canInvite = false,
  onInviteOpen,
  onLeave,
  onDelete,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Esc
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`
          p-1.5 rounded transition
          ${open
            ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"}
        `}
        title="Team actions"
      >
        <Settings size={16} />
      </button>

      {open && (
        <div
          className="
            absolute right-0 mt-2 w-56
            bg-white dark:bg-zinc-950
            border border-zinc-200 dark:border-zinc-800
            rounded-md shadow-lg
            p-1
            z-30
          "
        >
          {/* Header */}
          <div className="px-3 py-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Team actions
          </div>

          {/* Invite */}
          {canInvite && (
            <MenuItem
              icon={UserPlus}
              label="Invite members"
              onClick={() => {
                setOpen(false);
                onInviteOpen();
              }}
            />
          )}

          <div className="my-1 border-t border-zinc-200 dark:border-zinc-800" />

          {/* Leave */}
          <MenuItem
            icon={LogOut}
            label="Leave team"
            onClick={onLeave}
          />

          {/* Delete (danger) */}
          {onDelete && (
            <MenuItem
              icon={Trash2}
              label="Delete team"
              danger
              onClick={onDelete}
            />
          )}
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-2
        px-3 py-2 text-sm rounded
        ${
          danger
            ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
            : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        }
      `}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}
