import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[40vh] w-full flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-zinc-300 border-t-[rgb(var(--primary))] animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
