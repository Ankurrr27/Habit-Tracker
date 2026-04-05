import { createContext, useContext, useState, useCallback, useEffect } from "react";

const SyncContext = createContext();

export function SyncProvider({ children }) {
  const [syncVersion, setSyncVersion] = useState(0);

  const triggerSync = useCallback(() => {
    setSyncVersion((v) => v + 1);
  }, []);

  // Auto-sync when user returns to the tab (catches extension changes)
  useEffect(() => {
    const handleFocus = () => {
      setTimeout(triggerSync, 150);
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        setTimeout(triggerSync, 150);
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [triggerSync]);

  return (
    <SyncContext.Provider value={{ syncVersion, triggerSync }}>
      {children}
    </SyncContext.Provider>
  );
}

export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error("useSync must be used within a SyncProvider");
  }
  return context;
};
