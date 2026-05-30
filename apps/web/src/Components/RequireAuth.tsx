import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

type Props = {
  allowedRoles?: string[];
  children: React.ReactNode;
};


export default function RequireAuth({ allowedRoles, children }: Props) {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log('true')
    if (user.role === "REVIEWER") {
      return (
        <Navigate
          to="/reviewer-dashboard/application"
          replace
        />
      );
    }
    return <Navigate to="/dashboard/jobs" replace />;
  }

  return <>{children}</>;
}