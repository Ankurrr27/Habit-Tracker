import { useEffect } from "react";
import api from "../api/axios";
import { processQueue } from "../utils/syncQueue";

/**
 * OfflineSyncManager
 * 
 * Background component that monitors network status and 
 * triggers the sync engine when connectivity is restored.
 */
export function OfflineSyncManager() {
  useEffect(() => {
    // 1. Initial sync attempts on startup
    const handleInitialSync = async () => {
       if (navigator.onLine) {
         await processQueue(api);
       }
    };

    handleInitialSync();

    // 2. Network listener
    const handleOnline = async () => {
      console.log("[OfflineSyncManager] Connectivity restored. Starting sync...");
      await processQueue(api);
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  return null; // Side-effect only component
}
