const COLORS = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-sky-500",
  "bg-purple-500",
];

export function getAvatarColor(seed = "") {
  if (!seed) return COLORS[0];

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  return COLORS[Math.abs(hash) % COLORS.length];
}

export function getInitial(name = "") {
  return name.trim().charAt(0).toUpperCase() || "?";
}
