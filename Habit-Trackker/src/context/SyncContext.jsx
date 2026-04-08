import { useState, useCallback, useEffect } from "react";
import { processQueue } from "../utils/syncQueue";
import api from "../api/axios";
import { SyncContext } from "./sync-context";

export function SyncProvider({ children }) {
  const [syncVersion, setSyncVersion] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  const triggerSync = useCallback(() => {
    setSyncVersion((v) => v + 1);
  }, []);

  // Sync Logic: Flush queue when coming back online
  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      setIsSyncing(true);
      await processQueue(api);
      setIsSyncing(false);
      triggerSync(); // Refresh UI after sync
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check for non-empty queue on load
    if (navigator.onLine) {
      handleOnline();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [triggerSync]);

  // Auto-sync when user returns to the tab
  useEffect(() => {
    const handleRefresh = () => {
      if (document.visibilityState === "visible" || document.hasFocus()) {
        setTimeout(triggerSync, 150);
      }
    };

    window.addEventListener("focus", handleRefresh);
    document.addEventListener("visibilitychange", handleRefresh);

    return () => {
      window.removeEventListener("focus", handleRefresh);
      document.removeEventListener("visibilitychange", handleRefresh);
    };
  }, [triggerSync]);

  return (
    <SyncContext.Provider value={{ syncVersion, triggerSync, isOnline, isSyncing }}>
      {children}
    </SyncContext.Provider>
  );
}
