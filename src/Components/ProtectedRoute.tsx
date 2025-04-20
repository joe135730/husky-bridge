import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../store/index";
import { useEffect, useState } from "react";
import * as accountClient from "../Account/client";
import { setCurrentUser } from "../store/account-reducer";
import { getUserFromLocalStorage } from "../utils/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser } = useSelector((state: StoreType) => state.accountReducer);
  const location = useLocation();
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshedUser, setRefreshedUser] = useState<any>(null);

  // Try to refresh the session if currentUser is null
  useEffect(() => {
    const refreshSession = async () => {
      // Only attempt to refresh if not already refreshing and no current user
      if (!currentUser && !isRefreshing) {
        setIsRefreshing(true);
        console.log("Protected Route - Attempting to refresh session");
        
        try {
          const user = await accountClient.profile();
          if (user) {
            console.log("Protected Route - Session refreshed successfully");
            dispatch(setCurrentUser(user));
            setRefreshedUser(user);
          } else {
            console.log("Protected Route - Session refresh failed");
            setRefreshedUser(null);
          }
        } catch (error) {
          console.error("Protected Route - Error refreshing session:", error);
          setRefreshedUser(null);
        } finally {
          setIsRefreshing(false);
        }
      }
    };
    
    refreshSession();
  }, [currentUser, isRefreshing, dispatch]);

  // Add debug logs for authentication state
  useEffect(() => {
    console.log("Protected Route - Auth Check:", {
      path: location.pathname,
      isAuthenticated: !!(currentUser || refreshedUser),
      userId: (currentUser || refreshedUser)?._id,
      role: (currentUser || refreshedUser)?.role,
      isRefreshing
    });
  }, [currentUser, refreshedUser, location.pathname, isRefreshing]);

  // Consider both the Redux currentUser, our refreshed user, and localStorage
  const localUser = getUserFromLocalStorage();
  const effectiveUser = currentUser || refreshedUser || localUser;
  
  if (!effectiveUser) {
    // Only redirect if we've tried refreshing and it failed
    if (!isRefreshing) {
      console.log("Protected Route - Authentication failed, redirecting to login");
      // Redirect to the login page, but save the current location they were trying to access
      return <Navigate to="/Account/login" state={{ from: location.pathname }} replace />;
    } else {
      // Show loading while refreshing
      return <div className="loading">Verifying authentication...</div>;
    }
  }

  // If we have a local user but not in Redux, restore it
  useEffect(() => {
    if (localUser && !currentUser && !refreshedUser) {
      console.log("Protected Route - Restoring user from localStorage");
      dispatch(setCurrentUser(localUser));
    }
  }, [localUser, currentUser, refreshedUser, dispatch]);

  return <>{children}</>;
}; 