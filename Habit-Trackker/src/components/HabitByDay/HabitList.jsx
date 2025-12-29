import HabitItem from "./HabitItem";

export default function HabitList({
  habits,
  loading,
  isToday,
  onComplete,
  onDelete,
}) {
  if (loading) {
    return <p className="text-zinc-500 text-sm px-1">Loading…</p>;
  }

  if (habits.length === 0) {
    return (
      <p className="text-zinc-600 text-sm px-1">
        No habits
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
