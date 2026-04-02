export const PLATFORM_OPTIONS = [
  { value: "github", label: "GitHub" },
  { value: "leetcode", label: "LeetCode" },
  { value: "codeforces", label: "Codeforces" },
  { value: "codechef", label: "CodeChef" },
];

export function validateHabit({
  title,
  type,
  frequency,
  days,
  intervalDays,
  durationType,
  durationDays,
  verificationRule,
  platformSource,
}) {
  if (!title.trim()) {
    return "Title required";
  }

  if (frequency === "weekly" && days.length === 0) {
    return "Select at least one day";
  }

  if (frequency === "interval" && intervalDays < 1) {
    return "Interval must be at least 1 day";
  }

  if (durationType === "custom" && durationDays < 1) {
    return "Duration must be at least 1 day";
  }

  if (verificationRule === "platform" && !platformSource) {
    return "Choose a platform to auto-track";
  }

  if (verificationRule === "platform" && type !== "hobby") {
    return "Auto-tracked items must be hobbies";
  }

  return null;
}
