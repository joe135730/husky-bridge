// src/navbar/navbar.tsx
import Nav from "react-bootstrap/Nav";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCurrentUser } from "../store/account-reducer.ts";
import { StoreType } from "../store";
import * as accountClient from "../Account/client";
import SearchBar from "../Components/Search/SearchBar";
import "./navbar.css";
import { useState } from "react";
import LeftSideBar from "../LeftsideBar"; // Adjust the import path as necessary

export default function Navbar() {
  const { pathname } = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar
  const { currentUser } = useSelector((state: StoreType) => state.accountReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignout = async () => {
    try {
      await accountClient.signout();
      dispatch(clearCurrentUser());
      navigate("/");
    } catch (error) {
      console.error("Signout error:", error);
    }
  };

  return (
    <Nav variant="pills" id="wd-toc" className="navbar-container">
      <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <span className="strip"></span>
        <span className="strip"></span>
        <span className="strip"></span>
      </button>
      {isSidebarOpen && <LeftSideBar onClose={() => setIsSidebarOpen(false)} />} {/* Sidebar component */}
      
      <div className="navbar-left">
        <div className="navbar-brand">
          <Nav.Link
            as={Link}
            to="/"
            id="brand"
            active={pathname === "/"}
          >
            HuskyBridge
          </Nav.Link>
        </div>
        <div className="navbar-search">
          <SearchBar />
        </div>
      </div>
      
      <div className="nav-items-right">
        <Nav.Item className="nav-link-item">
          <Nav.Link
            as={Link}
            to="/Request"
            id="request-page"
            active={pathname.includes("Request")}
          >
            View All Request
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="nav-link-item">
          <Nav.Link
            as={Link}
            to="/Help"
            id="help-page"
            active={pathname.includes("Help")}
          >
            View All Help
          </Nav.Link>
        </Nav.Item>
        
        {currentUser ? (
          <>
            <Nav.Item className="nav-link-item">
              <Nav.Link
                as={Link}
                to="/Account/profile"
                id="profile-page"
                active={pathname.includes("profile")}
              >
                {currentUser.firstName || "Profile"}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <button className="logout-button" onClick={handleSignout}>
                Logout
              </button>
            </Nav.Item>
          </>
        ) : (
          <Nav.Item>
            <Nav.Link as={Link} to="/Account/login" id="login-page">
              <button className="login-button">
                Login
              </button>
            </Nav.Link>
          </Nav.Item>
        )}
      </div>
    </Nav>
  );
}