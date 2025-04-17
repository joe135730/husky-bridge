import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { StoreType } from "../store/index";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser } = useSelector((state: StoreType) => state.accountReducer);
  const location = useLocation();

  if (!currentUser) {
    // Redirect to the login page, but save the current location they were trying to access
    return <Navigate to="/Account/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}; 