import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../api/axios";

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfWeek(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  copy.setDate(copy.getDate() - copy.getDay());
  return copy;
}

function getWeekDates(anchorDate) {
  const start = startOfWeek(anchorDate);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

export default function CalendarPage() {
  const [weekAnchor, setWeekAnchor] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [selectedDayHabits, setSelectedDayHabits] = useState([]);
  const [weeklyCounts, setWeeklyCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const weekDates = useMemo(() => getWeekDates(weekAnchor), [weekAnchor]);
  const todayKey = toDateKey(new Date());
  const selectedKey = toDateKey(selectedDate);

  useEffect(() => {
    let isCancelled = false;

    const loadWeek = async () => {
      try {
        setLoading(true);
        setMessage("");

        const responses = await Promise.all(
          weekDates.map((date) =>
            api.get("/activity/status", {
              params: { date: toDateKey(date) },
            })
          )
        );

        if (isCancelled) return;

        const nextWeeklyCounts = {};

        responses.forEach((response, index) => {
          const dateKey = toDateKey(weekDates[index]);
          nextWeeklyCounts[dateKey] = {
            total: response.data.length,
            completed: response.data.filter((habit) => habit.done).length,
          };

          if (dateKey === selectedKey) {
            setSelectedDayHabits(response.data);
          }
        });

        setWeeklyCounts(nextWeeklyCounts);
      } catch (error) {
        console.error("Calendar load failed:", error);
        if (!isCancelled) {
          setMessage("Failed to load calendar");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadWeek();

    return () => {
      isCancelled = true;
    };
  }, [selectedKey, weekDates]);

  useEffect(() => {
    const selectedIsVisible = weekDates.some(
      (date) => toDateKey(date) === selectedKey
    );

    if (!selectedIsVisible) {
      setSelectedDate(weekDates[0]);
    }
  }, [selectedKey, weekDates]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <section className="rounded-[2rem] bg-zinc-50 px-5 py-6 shadow-sm dark:bg-zinc-950 sm:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-zinc-600 shadow-sm dark:bg-zinc-900 dark:text-zinc-300">
              <CalendarDays size={13} />
              Weekly calendar
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
              Plan your week and see what is scheduled each day
            </h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Pick any date in the week to view the habits scheduled for that day.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                const previous = new Date(weekAnchor);
                previous.setDate(previous.getDate() - 7);
                setWeekAnchor(previous);
              }}
              className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                setWeekAnchor(today);
                setSelectedDate(today);
              }}
              className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              This week
            </button>
            <button
              onClick={() => {
                const next = new Date(weekAnchor);
                next.setDate(next.getDate() + 7);
                setWeekAnchor(next);
              }}
              className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-7">
        {weekDates.map((date) => {
          const dateKey = toDateKey(date);
          const isSelected = dateKey === selectedKey;
          const isToday = dateKey === todayKey;
          const count = weeklyCounts[dateKey] || { total: 0, completed: 0 };

          return (
            <button
              key={dateKey}
              onClick={() => setSelectedDate(date)}
              className={`
                rounded-3xl px-4 py-5 text-left shadow-sm transition
                ${
                  isSelected
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                    : "bg-white text-zinc-800 hover:-translate-y-0.5 dark:bg-zinc-950 dark:text-zinc-200"
                }
              `}
            >
              <div className="text-xs font-medium uppercase tracking-wide opacity-70">
                {date.toLocaleDateString(undefined, { weekday: "short" })}
              </div>
              <div className="mt-2 text-3xl font-semibold">
                {date.getDate()}
              </div>
              <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                {date.toLocaleDateString(undefined, {
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <div className="mt-4 rounded-2xl bg-zinc-100 px-3 py-2 text-sm dark:bg-zinc-900">
                {count.completed}/{count.total || 0} done
              </div>
              {isToday && (
                <div className="mt-3 text-xs font-medium text-emerald-600 dark:text-emerald-300">
                  Today
                </div>
              )}
            </button>
          );
        })}
      </section>

      <section className="rounded-[2rem] bg-white px-5 py-6 shadow-sm dark:bg-zinc-950 sm:px-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Schedule for {selectedDate.toDateString()}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              These are the habits planned for the selected date.
            </p>
          </div>
          {message && (
            <div className="text-sm text-red-500">
              {message}
            </div>
          )}
        </div>

        {loading ? (
          <div className="mt-5 text-sm text-zinc-500">Loading schedule...</div>
        ) : selectedDayHabits.length === 0 ? (
          <div className="mt-5 rounded-2xl bg-zinc-50 px-5 py-8 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            Nothing is scheduled for this date.
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {selectedDayHabits.map((habit) => (
              <div
                key={habit.habitId}
                className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-4 shadow-sm dark:bg-zinc-900"
              >
                <div>
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {habit.title}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {habit.done ? "Completed" : "Planned"}
                  </div>
                </div>

                <span
                  className={`
                    rounded-full px-3 py-1 text-xs font-medium
                    ${
                      habit.done
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                        : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    }
                  `}
                >
                  {habit.done ? "Done" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
