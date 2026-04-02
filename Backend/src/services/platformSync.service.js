import ActivityLog from "../models/activityLog.model.js";
import Habit from "../models/habit.model.js";
import User from "../models/user.model.js";
import { getUTCDayKey, getUTCStartOfDay } from "../utils/date.js";

const AUTO_PLATFORMS = ["github", "leetcode", "codeforces", "codechef"];

function isSameUTCDate(left, right) {
  return left.toISOString().slice(0, 10) === right.toISOString().slice(0, 10);
}

function isHabitScheduledOnDate(habit, date) {
  const target = getUTCStartOfDay(date);
  const startDate = habit.startDate
    ? getUTCStartOfDay(new Date(habit.startDate))
    : target;

  if (target < startDate) {
    return false;
  }

  if (habit.endDate) {
    const endDate = getUTCStartOfDay(new Date(habit.endDate));
    if (target > endDate) {
      return false;
    }
  }

  if (habit.isArchived) {
    return false;
  }

  if (habit.frequency === "daily") {
    return true;
  }

  if (habit.frequency === "weekly") {
    return habit.days?.includes(getUTCDayKey(target));
  }

  if (habit.frequency === "interval") {
    const intervalDays = Number(habit.intervalDays || 0);
    if (intervalDays < 1) {
      return false;
    }

    const diffInDays = Math.floor(
      (target.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return diffInDays >= 0 && diffInDays % intervalDays === 0;
  }

  return false;
}

function getProfileHandle(user, platform) {
  return user.externalProfiles?.[platform]?.trim();
}

async function fetchJson(url, init) {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`External sync failed with status ${response.status}`);
  }
  return response.json();
}

async function hasGithubActivity(handle, targetDate) {
  const events = await fetchJson(
    `https://api.github.com/users/${encodeURIComponent(
      handle
    )}/events/public?per_page=30`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "habit-tracker-sync",
      },
    }
  );

  return events.some((event) => {
    if (!event?.created_at) {
      return false;
    }

    return isSameUTCDate(new Date(event.created_at), targetDate);
  });
}

async function hasLeetCodeActivity(handle, targetDate) {
  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: "https://leetcode.com/",
    },
    body: JSON.stringify({
      query: `
        query recentAcSubmissions($username: String!, $limit: Int!) {
          recentAcSubmissionList(username: $username, limit: $limit) {
            timestamp
          }
        }
      `,
      variables: {
        username: handle,
        limit: 20,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`LeetCode sync failed with status ${response.status}`);
  }

  const payload = await response.json();
  const submissions = payload?.data?.recentAcSubmissionList || [];

  return submissions.some((submission) => {
    const timestamp = Number(submission?.timestamp);
    if (!timestamp) {
      return false;
    }

    return isSameUTCDate(new Date(timestamp * 1000), targetDate);
  });
}

async function hasCodeforcesActivity(handle, targetDate) {
  const payload = await fetchJson(
    `https://codeforces.com/api/user.status?handle=${encodeURIComponent(
      handle
    )}&from=1&count=20`
  );

  const submissions = payload?.result || [];

  return submissions.some((submission) => {
    if (submission?.verdict !== "OK" || !submission?.creationTimeSeconds) {
      return false;
    }

    return isSameUTCDate(
      new Date(submission.creationTimeSeconds * 1000),
      targetDate
    );
  });
}

function extractPotentialDates(text) {
  const matches = text.match(
    /\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}:\d{2})?/g
  );

  return matches || [];
}

async function hasCodeChefActivity(handle, targetDate) {
  const response = await fetch(
    `https://www.codechef.com/recent/user?page=0&user_handle=${encodeURIComponent(
      handle
    )}`,
    {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent": "habit-tracker-sync",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`CodeChef sync failed with status ${response.status}`);
  }

  const rawText = await response.text();
  const dateCandidates = extractPotentialDates(rawText);

  return dateCandidates.some((value) =>
    isSameUTCDate(new Date(value.replace(" ", "T")), targetDate)
  );
}

const platformCheckers = {
  github: hasGithubActivity,
  leetcode: hasLeetCodeActivity,
  codeforces: hasCodeforcesActivity,
  codechef: hasCodeChefActivity,
};

export async function syncAutoVerifiedHabitsForDate(userId, date = new Date()) {
  const targetDate = getUTCStartOfDay(date);
  const today = getUTCStartOfDay(new Date());

  if (!isSameUTCDate(targetDate, today)) {
    return;
  }

  const [user, habits] = await Promise.all([
    User.findById(userId).lean(),
    Habit.find({
      user: userId,
      verificationRule: "platform",
      platformSource: { $in: AUTO_PLATFORMS },
    }).lean(),
  ]);

  if (!user || habits.length === 0) {
    return;
  }

  const scheduledHabits = habits.filter((habit) =>
    isHabitScheduledOnDate(habit, targetDate)
  );

  const habitsByPlatform = scheduledHabits.reduce((acc, habit) => {
    const platform = habit.platformSource;
    const handle = getProfileHandle(user, platform);

    if (!platform || !handle) {
      return acc;
    }

    if (!acc.has(platform)) {
      acc.set(platform, {
        handle,
        habits: [],
      });
    }

    acc.get(platform).habits.push(habit);
    return acc;
  }, new Map());

  for (const [platform, entry] of habitsByPlatform.entries()) {
    const checker = platformCheckers[platform];

    if (!checker) {
      continue;
    }

    try {
      const hasActivity = await checker(entry.handle, targetDate);

      if (!hasActivity) {
        continue;
      }

      await Promise.all(
        entry.habits.map((habit) =>
          ActivityLog.updateOne(
            {
              user: userId,
              habit: habit._id,
              date: targetDate,
            },
            {
              $setOnInsert: {
                habitType: habit.type || "hobby",
                status: "done",
                confidence: 100,
              },
            },
            { upsert: true }
          )
        )
      );
    } catch (error) {
      console.error(`Auto sync failed for ${platform}:`, error.message);
    }
  }
}

export { isHabitScheduledOnDate };
