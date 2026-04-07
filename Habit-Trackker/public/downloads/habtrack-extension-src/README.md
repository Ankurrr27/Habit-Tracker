# HabTrack Browser Extension

This folder contains a standalone browser extension for HabTrack.

## What it does

- opens in the browser side panel instead of a popup
- lets someone enter a HabTrack username
- fetches a public profile by username
- shows that user's public habits for today
- shows your own one-day tasks for today (when access token is added in settings)
- lets you change the API base URL from the settings page

## Folder structure

- `manifest.json`: extension manifest
- `background.js`: opens the side panel when the extension icon is clicked
- `sidepanel.html`, `sidepanel.js`: main side panel UI
- `popup.css`: shared extension styling
- `options.html`, `options.js`: extension settings page

## Load it locally

### Chromium browsers

1. Open `chrome://extensions`
2. Enable `Developer mode`
3. Click `Load unpacked`
4. Select this `Extension` folder
5. Click the HabTrack extension icon to open the side panel

### Firefox

This version is designed around the Chromium side panel API, so Chromium browsers are the main target for now.

## How it works

1. Click the extension icon
2. The HabTrack side panel opens on the right side
3. Enter a HabTrack username
4. If that profile is public, the extension fetches:
   - public profile details
   - today’s public habit status

## API setup

By default the extension uses:

- `https://habit-tracker-ixsb.onrender.com`

You can change that from the extension settings page if you want to point it at a local backend such as:

- `http://localhost:5000`

To enable your personal one-day tasks in the extension, also paste your HabTrack access token in extension settings.

## Notes

- The extension stores the last looked-up username in browser extension local storage.
- The side panel uses these public backend routes (with automatic `/api` fallback):
  - `GET /users/public/:username`
  - `GET /activity/public/:username/status`
- Only public profiles can be fetched without login.
- This version is read-only by design, which avoids letting someone edit another user’s habits just by typing their username.
