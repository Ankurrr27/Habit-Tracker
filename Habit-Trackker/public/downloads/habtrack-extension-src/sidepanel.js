const extensionApi = typeof browser !== "undefined" ? browser : chrome;
const DEFAULT_API_BASE = "https://habit-tracker-ixsb.onrender.com";
const DEFAULT_WEB_APP = "https://habit-tracker-ybku.vercel.app";

const usernameForm = document.getElementById("usernameForm");
const usernameInput = document.getElementById("usernameInput");
const profileView = document.getElementById("profileView");
const statusMessage = document.getElementById("statusMessage");
const todayHabitsContainer = document.getElementById("todayHabits");
const todayTasksContainer = document.getElementById("todayTasks");
const openSettingsButton = document.getElementById("openSettings");
const refreshButton = document.getElementById("refreshButton");
const clearProfileButton = document.getElementById("clearProfile");
const openWebAppButton = document.getElementById("openWebApp");
const userName = document.getElementById("userName");
const userMeta = document.getElementById("userMeta");
const profileHint = document.getElementById("profileHint");
const todayLabel = document.getElementById("todayLabel");

let currentUsername = "";
const APP_TIMEZONE_OFFSET_MINUTES = 330;
const APP_TIMEZONE_OFFSET_MS = APP_TIMEZONE_OFFSET_MINUTES * 60 * 1000;

function storageGet(keys) {
  return new Promise((resolve) => extensionApi.storage.local.get(keys, resolve));
}

function storageSet(values) {
  return new Promise((resolve) => extensionApi.storage.local.set(values, resolve));
}

async function getSettings() {
  const result = await storageGet([
    "habtrackApiBase",
    "habtrackLastUsername",
    "habtrackToken",
  ]);

  return {
    apiBase: (result.habtrackApiBase || DEFAULT_API_BASE).replace(/\/$/, ""),
    lastUsername: result.habtrackLastUsername || "",
    token: result.habtrackToken || "",
  };
}

function showStatus(message, tone = "info") {
  statusMessage.textContent = message;
  statusMessage.classList.remove("hidden");
  statusMessage.style.background =
    tone === "error" ? "rgba(220, 38, 38, 0.92)" : "rgba(15, 23, 42, 0.92)";
}

function clearStatus() {
  statusMessage.classList.add("hidden");
  statusMessage.textContent = "";
}

function shiftToAppTime(date = new Date()) {
  return new Date(new Date(date).getTime() + APP_TIMEZONE_OFFSET_MS);
}

async function publicRequest(path) {
  const { apiBase } = await getSettings();
  const candidates = [`${apiBase}${path}`];

  // Support backends that are mounted under "/api/*".
  if (!path.startsWith("/api/")) {
    candidates.push(`${apiBase}/api${path}`);
  }

  let lastError = null;

  for (const url of candidates) {
    const response = await fetch(url);
    const text = await response.text();
    let data = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      if (!response.ok) {
        lastError = new Error("The API did not return a valid JSON response.");
        continue;
      }
    }

    if (!response.ok) {
      lastError = new Error(data?.message || data?.error || "Request failed");
      continue;
    }

    return data;
  }

  throw lastError || new Error("Request failed");
}

async function authRequest(path) {
  const { apiBase, token } = await getSettings();

  if (!token) {
    throw new Error("Add your access token in extension Settings.");
  }

  const candidates = [`${apiBase}${path}`];
  if (!path.startsWith("/api/")) {
    candidates.push(`${apiBase}/api${path}`);
  }

  let lastError = null;

  for (const url of candidates) {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await response.text();
    let data = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      if (!response.ok) {
        lastError = new Error("The API did not return a valid JSON response.");
        continue;
      }
    }

    if (!response.ok) {
      lastError = new Error(data?.message || data?.error || "Request failed");
      continue;
    }

    return data;
  }

  throw lastError || new Error("Request failed");
}

function getTodayKey() {
  const shifted = shiftToAppTime(new Date());
  const year = shifted.getUTCFullYear();
  const month = String(shifted.getUTCMonth() + 1).padStart(2, "0");
  const day = String(shifted.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTodayLabel() {
  return shiftToAppTime(new Date()).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function renderProfile(profile) {
  userName.textContent = profile.name || profile.username;
  userMeta.textContent = `@${profile.username} | credibility ${profile.credibilityScore ?? 0}`;
  profileHint.textContent = "Showing public profile data with the same HabTrack day rule as the main app.";
  todayLabel.textContent = getTodayLabel();
  profileView.classList.remove("hidden");
}

function renderTodayHabits(items) {
  todayHabitsContainer.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No public habits are scheduled for today.";
    todayHabitsContainer.appendChild(empty);
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "habit-card";

    const meta = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = item.title;
    const copy = document.createElement("p");
    copy.textContent = item.done
      ? `Completed for ${getTodayLabel()}`
      : `Planned for ${getTodayLabel()}`;
    meta.appendChild(title);
    meta.appendChild(copy);

    const badge = document.createElement("div");
    badge.className = `habit-action ${item.done ? "done" : "pending"}`;
    badge.textContent = item.done ? "Done" : "Pending";

    card.appendChild(meta);
    card.appendChild(badge);
    todayHabitsContainer.appendChild(card);
  });
}

function renderTodayTasks(items) {
  todayTasksContainer.innerHTML = "";

  if (!items?.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No one-day tasks for today.";
    todayTasksContainer.appendChild(empty);
    return;
  }

  items.forEach((task) => {
    const card = document.createElement("article");
    card.className = "habit-card";

    const meta = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = task.title;
    const copy = document.createElement("p");
    copy.textContent = task.status === "done" ? "Completed today" : "Pending today";
    meta.appendChild(title);
    meta.appendChild(copy);

    const badge = document.createElement("div");
    badge.className = `habit-action ${task.status === "done" ? "done" : "pending"}`;
    badge.textContent = task.status === "done" ? "Done" : "Pending";

    card.appendChild(meta);
    card.appendChild(badge);
    todayTasksContainer.appendChild(card);
  });
}

async function loadTodayTasks() {
  try {
    const tasks = await authRequest("/tasks");
    renderTodayTasks(tasks);
  } catch (error) {
    todayTasksContainer.innerHTML = "";
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = error.message || "Unable to load one-day tasks.";
    todayTasksContainer.appendChild(empty);
  }
}

async function loadUsername(username) {
  clearStatus();
  currentUsername = username.trim().replace(/^@+/, "").toLowerCase();

  if (!currentUsername) {
    showStatus("Enter a username first.", "error");
    return;
  }

  try {
    const profile = await publicRequest(`/users/public/${encodeURIComponent(currentUsername)}`);
    const habits = await publicRequest(
      `/activity/public/${encodeURIComponent(currentUsername)}/status?date=${getTodayKey()}`
    );

    renderProfile(profile);
    renderTodayHabits(habits);
    await storageSet({ habtrackLastUsername: currentUsername });
  } catch (error) {
    profileView.classList.add("hidden");
    todayHabitsContainer.innerHTML = "";
    showStatus(error.message, "error");
  }
}

usernameForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await loadUsername(usernameInput.value);
});

refreshButton.addEventListener("click", async () => {
  if (currentUsername) {
    await loadUsername(currentUsername);
  }
  await loadTodayTasks();
});

clearProfileButton.addEventListener("click", () => {
  currentUsername = "";
  usernameInput.value = "";
  profileView.classList.add("hidden");
  todayHabitsContainer.innerHTML = "";
  profileHint.textContent = "";
  todayLabel.textContent = "";
  clearStatus();
});

openSettingsButton.addEventListener("click", () => {
  extensionApi.runtime.openOptionsPage();
});

openWebAppButton.addEventListener("click", async () => {
  const { apiBase } = await getSettings();
  const appUrl = apiBase.includes("localhost")
    ? "http://localhost:5173"
    : DEFAULT_WEB_APP;

  extensionApi.tabs.create({ url: appUrl });
});

(async function initialize() {
  const { lastUsername } = await getSettings();
  await loadTodayTasks();
  if (lastUsername) {
    usernameInput.value = lastUsername;
    await loadUsername(lastUsername);
  }
})();
