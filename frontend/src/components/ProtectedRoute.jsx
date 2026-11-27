import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute
 * - If not logged in → /login
 * - If requireAdmin=true and user is not admin → /
 */
export default function ProtectedRoute({ user, requireAdmin = false, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}
