const extensionApi = typeof browser !== "undefined" ? browser : chrome;
const DEFAULT_API_BASE = "https://habit-tracker-ixsb.onrender.com";

const settingsForm = document.getElementById("settingsForm");
const apiBaseInput = document.getElementById("apiBase");
const authTokenInput = document.getElementById("authToken");
const settingsStatus = document.getElementById("settingsStatus");

function storageGet(keys) {
  return new Promise((resolve) => extensionApi.storage.local.get(keys, resolve));
}

function storageSet(values) {
  return new Promise((resolve) => extensionApi.storage.local.set(values, resolve));
}

function showStatus(message, tone = "info") {
  settingsStatus.textContent = message;
  settingsStatus.classList.remove("hidden");
  settingsStatus.style.background =
    tone === "error" ? "rgba(220, 38, 38, 0.92)" : "rgba(15, 23, 42, 0.92)";
}

async function initialize() {
  const result = await storageGet(["habtrackApiBase", "habtrackToken"]);
  apiBaseInput.value = result.habtrackApiBase || DEFAULT_API_BASE;
  authTokenInput.value = result.habtrackToken || "";
}

settingsForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const apiBase = apiBaseInput.value.trim().replace(/\/$/, "");
  const authToken = authTokenInput.value.trim();

  if (!apiBase) {
    showStatus("Please enter a valid API base URL.", "error");
    return;
  }

  await storageSet({ habtrackApiBase: apiBase, habtrackToken: authToken });
  showStatus("Settings saved.");
});

initialize();
