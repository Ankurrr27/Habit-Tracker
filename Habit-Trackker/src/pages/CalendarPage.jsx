import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import {
  addAppDays,
  getAppWeekdayIndex,
  startOfAppDay,
  toDateKey,
} from "../utils/date";

function startOfWeek(date) {
  const base = startOfAppDay(date);
  return addAppDays(base, -getAppWeekdayIndex(base));
}

function getWeekDates(anchor) {
  const start = startOfWeek(anchor);
  return Array.from({ length: 7 }, (_, index) => addAppDays(start, index));
}

export default function CalendarPage() {
  const [weekAnchor, setWeekAnchor] = useState(() => startOfAppDay(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => startOfAppDay(new Date()));
  const [selectedDayHabits, setSelectedDayHabits] = useState([]);
  const [weeklyCounts, setWeeklyCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const weekDates = useMemo(() => getWeekDates(weekAnchor), [weekAnchor]);
  const activeDate = useMemo(
    () =>
      weekDates.find((date) => toDateKey(date) === toDateKey(selectedDate)) ||
      weekDates[0],
    [selectedDate, weekDates]
  );

  const todayKey = toDateKey(startOfAppDay(new Date()));
  const selectedKey = toDateKey(activeDate);

  useEffect(() => {
    let cancelled = false;

    const loadWeek = async () => {
      if (!cancelled) {
        setLoading(true);
      }

      try {
        const responses = await Promise.all(
          weekDates.map((date) =>
            api.get("/activity/status", { params: { date: toDateKey(date) } })
          )
        );

        if (cancelled) {
          return;
        }

        const counts = {};
        let habitsForSelectedDay = [];

        responses.forEach((response, index) => {
          const key = toDateKey(weekDates[index]);
          counts[key] = {
            total: response.data.length,
            completed: response.data.filter((habit) => habit.done).length,
          };

          if (key === selectedKey) {
            habitsForSelectedDay = response.data;
          }
        });

        setWeeklyCounts(counts);
        setSelectedDayHabits(habitsForSelectedDay);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadWeek();

    return () => {
      cancelled = true;
    };
  }, [selectedKey, weekDates]);

  const weekLabel = useMemo(() => {
    const options = { month: "short", day: "numeric" };
    return `${weekDates[0].toLocaleDateString(undefined, options)} - ${weekDates[6].toLocaleDateString(undefined, options)}, ${weekDates[6].getFullYear()}`;
  }, [weekDates]);

  const goToToday = () => {
    const today = startOfAppDay(new Date());
    setWeekAnchor(today);
    setSelectedDate(today);
  };

  const shiftWeek = (direction) => {
    setWeekAnchor((currentWeekAnchor) =>
      addAppDays(currentWeekAnchor, direction * 7)
    );
  };

  return (
    <div className="flex h-auto w-full flex-col bg-transparent lg:h-full lg:overflow-hidden">
      <header className="page-shell shrink-0 bg-transparent pb-4">
        <div className="page-header">
          <div className="page-header-copy">
            <div className="mb-1 flex items-center gap-2">
              <CalendarDays size={14} className="accent-text" />
              <span className="page-kicker">Weekly Schedule</span>
            </div>
            <h1 className="page-title">{weekLabel}</h1>
            <p className="page-subtitle">
              Plan the week, review completion, and keep every scheduled habit
              visible in one consistent calendar view.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="segmented-control flex items-center gap-1">
              <button
                onClick={() => shiftWeek(-1)}
                className="rounded-xl p-2.5 text-zinc-500 transition hover:bg-white hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={goToToday}
                className="segmented-tab segmented-tab-active px-5 py-2.5 normal-case tracking-[0.02em] text-xs"
              >
                Today
              </button>
              <button
                onClick={() => shiftWeek(1)}
                className="rounded-xl p-2.5 text-zinc-500 transition hover:bg-white hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row lg:overflow-hidden">
        <aside className="h-auto w-full shrink-0 bg-zinc-50/20 px-4 py-6 dark:bg-zinc-900/20 sm:px-6 sm:py-8 lg:h-full lg:w-[350px] lg:overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            {weekDates.map((date) => {
              const key = toDateKey(date);
              const isSelected = key === selectedKey;
              const isToday = key === todayKey;
              const count = weeklyCounts[key] || { total: 0, completed: 0 };
              const percentage =
                count.total > 0
                  ? Math.round((count.completed / count.total) * 100)
                  : 0;

              return (
                <Motion.button
                  key={key}
                  onClick={() => setSelectedDate(date)}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left transition hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40"
                >
                  {isSelected && (
                    <Motion.div
                      layoutId="activeDay"
                      className="accent-bg absolute bottom-1/4 left-0 top-1/4 w-1 rounded-full"
                    />
                  )}

                  <div className="w-8 shrink-0 text-center">
                    <p
                      className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                        isSelected
                          ? "accent-text"
                          : "text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      {date.toLocaleDateString(undefined, { weekday: "short" })}
                    </p>
                    <p
                      className={`mt-1 text-2xl font-semibold leading-none tracking-[-0.03em] ${
                        isSelected
                          ? "text-zinc-900 dark:text-white"
                          : "text-zinc-800 group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-white"
                      }`}
                    >
                      {date.getDate()}
                    </p>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span
                        className={`text-[10px] font-medium ${
                          isSelected
                            ? "text-zinc-900 dark:text-zinc-100"
                            : "text-zinc-500 dark:text-zinc-400"
                        }`}
                      >
                        {count.completed}/{count.total} completion
                      </span>
                      {isToday && !isSelected && (
                        <span className="accent-bg h-1.5 w-1.5 rounded-full animate-pulse" />
                      )}
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800/80">
                      <Motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className={`h-full rounded-full transition-all ${
                          isSelected ? "accent-bg" : "bg-zinc-400 dark:bg-zinc-600"
                        }`}
                      />
                    </div>
                  </div>
                </Motion.button>
              );
            })}
          </div>
        </aside>

        <main className="page-shell h-auto flex-1 lg:h-full lg:overflow-y-auto">
          <div className="mb-10 flex flex-col gap-2">
            <h2 className="section-title text-xl sm:text-2xl">
              {activeDate.toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h2>
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {weeklyCounts[selectedKey]?.completed ?? 0} of{" "}
                {weeklyCounts[selectedKey]?.total ?? 0} habits completed
              </p>
              <div className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className="accent-bg h-full rounded-full"
                    style={{
                      width: `${
                        weeklyCounts[selectedKey]?.total > 0
                          ? (weeklyCounts[selectedKey].completed /
                              weeklyCounts[selectedKey].total) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-14 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900"
                />
              ))}
            </div>
          ) : selectedDayHabits.length === 0 ? (
            <div className="empty-state py-20">
              <CalendarDays size={32} className="text-zinc-300 dark:text-zinc-700" />
              <p className="text-sm text-zinc-400">Nothing scheduled for this day</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <Motion.div
                key={selectedKey}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                {selectedDayHabits.map((habit, index) => (
                  <Motion.div
                    key={habit.habitId}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className={`flex items-center gap-5 px-6 py-5 transition-all ${
                      habit.done
                        ? "opacity-60 grayscale-[0.5]"
                        : "bg-white dark:bg-zinc-900/50"
                    }`}
                  >
                    <div className="shrink-0">
                      {habit.done ? (
                        <div className="accent-bg flex h-6 w-6 items-center justify-center rounded-lg">
                          <CheckCircle2 size={16} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-zinc-200 dark:border-zinc-800" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-semibold tracking-[-0.02em] ${
                          habit.done
                            ? "text-zinc-500 line-through"
                            : "text-zinc-900 dark:text-white"
                        }`}
                      >
                        {habit.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="accent-pill">{habit.frequency}</span>
                        <div className="h-1 w-1 rounded-full bg-zinc-200 dark:border-zinc-800" />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                          Habit
                        </span>
                      </div>
                    </div>
                  </Motion.div>
                ))}
              </Motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  );
}
