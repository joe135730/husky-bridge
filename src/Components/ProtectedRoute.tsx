import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { StoreType } from "../store/index";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser } = useSelector((state: StoreType) => state.accountReducer);
  const location = useLocation();

  // Add debug logs for authentication state
  useEffect(() => {
    console.log("Protected Route - Auth Check:", {
      path: location.pathname,
      isAuthenticated: !!currentUser,
      userId: currentUser?._id,
      role: currentUser?.role
    });
  }, [currentUser, location.pathname]);

  if (!currentUser) {
    console.log("Protected Route - Authentication failed, redirecting to login");
    // Redirect to the login page, but save the current location they were trying to access
    return <Navigate to="/Account/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}; 