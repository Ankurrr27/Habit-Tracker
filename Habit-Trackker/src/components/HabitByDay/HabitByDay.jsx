import WeekCalendar from "./WeekCalendar";
import HabitList from "./HabitList";
import TaskItem from "./TaskItem";
import { useHabitByDay } from "./useHabitByDay";
import { useTodayTasks } from "./useTodayTasks";
import { ClipboardList, Plus } from "lucide-react";
import { AnimatePresence, motion as Motion } from "framer-motion";

export default function HabitByDay() {
  const {
    weekDates,
    selectedIndex,
    setSelectedIndex,
    selectedDate,
    isToday,
    habits,
    loading,
    completeHabit,
    deleteHabit,
  } = useHabitByDay();

  const {
    tasks,
    newTitle,
    setNewTitle,
    addTask,
    toggleTask,
    deleteTask,
    adding,
  } = useTodayTasks(isToday);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addTask();
  };

  return (
    <div className="space-y-4 md:space-y-5 h-auto lg:h-full flex flex-col min-h-0">
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/90 backdrop-blur-md pb-2 -mx-2 px-2">
        <WeekCalendar
          weekDates={weekDates}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          habitCounts={weekDates.map((_, index) =>
            index === selectedIndex ? habits.length : 0
          )}
        />
      </div>

      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        {isToday ? "Today" : selectedDate.toDateString()}
      </div>

      {/* Habits list */}
      <div className="flex-1 overflow-y-auto pb-4 scroll-smooth">
        <HabitList
          habits={habits}
          loading={loading}
          isToday={isToday}
          onComplete={completeHabit}
          onDelete={deleteHabit}
        />
      </div>

      {/* Tasks section — only on Today */}
      {isToday && (
        <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-900/60">
          {/* Section header */}
          <div className="flex items-center gap-1.5 mb-1">
            <ClipboardList size={11} className="text-amber-500" />
            <span className="text-[9px] font-extrabold uppercase tracking-[0.3em] text-amber-500">
              Tasks for today
            </span>
          </div>

          {/* Task items */}
          <AnimatePresence initial={false}>
            {tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))}
          </AnimatePresence>

          {tasks.length === 0 && (
            <Motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[11px] text-zinc-400 py-1"
            >
              No tasks yet — add one below
            </Motion.p>
          )}

          {/* Add task input */}
          <div className="flex items-center gap-2 pt-1">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a task for today…"
              className="flex-1 text-sm bg-transparent border-b border-zinc-200 dark:border-zinc-800 focus:border-amber-400 dark:focus:border-amber-500 focus:outline-none py-1 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 transition-colors"
            />
            <button
              onClick={addTask}
              disabled={!newTitle.trim() || adding}
              aria-label="Add task"
              className="flex items-center justify-center h-7 w-7 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

