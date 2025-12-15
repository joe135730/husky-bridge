import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser, faEnvelope, faClipboard, faSignOutAlt, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { clearCurrentUser } from "../store/account-reducer";
import * as accountClient from "../Account/client";
import "./LeftSideBar.css";
import { StoreType } from "../store";

const LeftSideBar = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state: StoreType) => state.accountReducer.currentUser);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleSignout = async () => {
    try {
      // Clear user state first (optimistic update)
      dispatch(clearCurrentUser());
      
      // Call signout API to destroy session and clear cookie
      await accountClient.signout();
      
      // Navigate to home page
      navigate("/");
      onClose();
      
      // Force a page reload to ensure all state is cleared
      // This helps clear any cached session data
      window.location.reload();
    } catch (error) {
      console.error("Signout error:", error);
      // Even if API call fails, we've cleared local state
      // User will be logged out on next page load if session is invalid
    }
  };

  const handleAuthenticatedLink = (path: string, event: React.MouseEvent) => {
    if (!currentUser) {
      event.preventDefault();
      navigate("/Account/login", { state: { from: path } });
      onClose();
    } else {
      onClose();
    }
  };

  // ✅ Click-outside detection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="left-sidebar" ref={sidebarRef}>
      <button className="close-button" onClick={onClose}>✖</button>
      <ul>
        <li>
          <Link to="/" onClick={onClose}>
            <FontAwesomeIcon icon={faHome} /> Home
          </Link>
        </li>
        <li>
          <Link to="/Account/profile" onClick={(e) => handleAuthenticatedLink("/Account/profile", e)}>
            <FontAwesomeIcon icon={faUser} /> Profile
          </Link>
        </li>
        <li>
          <Link to="/messages" onClick={onClose}>
            <FontAwesomeIcon icon={faEnvelope} /> Messages
          </Link>
        </li>
        <li>
          <Link to="/my-posts" onClick={(e) => handleAuthenticatedLink("/my-posts", e)}>
            <FontAwesomeIcon icon={faClipboard} /> My Post
          </Link>
        </li>
        {currentUser?.role?.toUpperCase() === "ADMIN" && (
          <li>
            <Link to="/reports" onClick={onClose}>
              <FontAwesomeIcon icon={faExclamationCircle} /> Reports
            </Link>
          </li>
        )}
        <li>
          {currentUser ? (
            <button className="logout-link" onClick={handleSignout}>
              <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '10px' }} /> Logout
            </button>
          ) : (
            <Link to="/Account/login" onClick={onClose}>
              <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px' }} /> Login
            </Link>
          )}
        </li>
      </ul>
    </div>
  );
};

export default LeftSideBar;
