import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export default function RequireAuth({ allowedRoles }: { allowedRoles?: string[] }) {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "REVIEWER") {
      return (
        <Navigate
          to="/reviewer-dashboard/application"
          replace
        />
      );
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}