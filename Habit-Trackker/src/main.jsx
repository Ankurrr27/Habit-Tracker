import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SyncProvider } from "./context/SyncContext";
import { GoogleProviderWrapper } from "./providers/GoogleProviderWrapper";
import { registerSW } from "virtual:pwa-register";

// Register Service Worker for PWA/Offline support
registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleProviderWrapper>
          <ThemeProvider>
            <AuthProvider>
              <SyncProvider>
                <App />
              </SyncProvider>
            </AuthProvider>
          </ThemeProvider>
        </GoogleProviderWrapper>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
