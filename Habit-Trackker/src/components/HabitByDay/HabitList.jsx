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
      <p className="text-xs px-1 font-bold uppercase tracking-widest text-indigo-500 animate-pulse">
        Loading habits…
      </p>
    );
  }

  if (habits.length === 0) {
    return (
      <p className="text-xs px-1 font-bold uppercase tracking-widest text-zinc-400">
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
