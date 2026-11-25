import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Front-end guard only. The server checks the role again on every protected request.
export default function RequireRole({ roles, children }) {
  const { user, loading } = useAuth();
  if (loading) return <main className="wrap empty"><p>Loading…</p></main>;
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}
