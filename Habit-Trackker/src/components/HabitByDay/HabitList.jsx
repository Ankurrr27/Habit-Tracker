import HabitItem from "./HabitItem";

export default function HabitList({
  habits,
  loading,
  isToday,
  onComplete,
  onDelete,
}) {
  if (loading) {
    return (
      <p className="accent-text px-1 text-xs font-bold uppercase tracking-widest animate-pulse">
        Loading habits...
      </p>
    );
  }

  if (habits.length === 0) {
    return (
      <p className="px-1 text-xs font-bold uppercase tracking-widest text-zinc-400">
        No habits scheduled
      </p>
    );
  }

  return habits.map((habit) => (
    <HabitItem
      key={habit._id}
      habit={habit}
      onComplete={onComplete}
      onDelete={onDelete}
      disabled={!isToday}
    />
  ));
}
