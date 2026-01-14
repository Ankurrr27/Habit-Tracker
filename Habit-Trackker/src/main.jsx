import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

/* =====================
   ENV SAFETY
===================== */
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

/* 
  Make Google OAuth OPTIONAL.
  App must never fail to render because of missing env vars.
*/
function GoogleProviderWrapper({ children }) {
  if (!googleClientId) {
    console.warn("⚠️ Google OAuth disabled: missing VITE_GOOGLE_CLIENT_ID");
    return children;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {children}
    </GoogleOAuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleProviderWrapper>
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </GoogleProviderWrapper>
    </Provider>
  </React.StrictMode>
);
