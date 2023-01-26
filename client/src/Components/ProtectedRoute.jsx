import { useLocation, Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ user }) {
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location }} />;

  return <Outlet />;
}
