import { GoogleOAuthProvider } from "@react-oauth/google";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export function GoogleProviderWrapper({ children }) {
  if (!googleClientId) {
    console.warn(
      "Google OAuth disabled: missing VITE_GOOGLE_CLIENT_ID"
    );
    return children;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
