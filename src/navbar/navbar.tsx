// src/navbar/navbar.tsx
import Nav from "react-bootstrap/Nav";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCurrentUser } from "../store/account-reducer.ts";
import { StoreType } from "../store";
import * as accountClient from "../Account/client";
import SearchBar from "../Components/Search/SearchBar";
import "./navbar.css";
import { useState, useEffect } from "react";
import LeftSideBar from "../LeftsideBar"; // Adjust the import path as necessary

export default function Navbar() {
  const { pathname } = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar
  const { currentUser } = useSelector((state: StoreType) => state.accountReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
      <div className="navbar-left">
        <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <span className="strip"></span>
          <span className="strip"></span>
          <span className="strip"></span>
        </button>
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
        {!isMobile && (
          <div className="navbar-search">
            <SearchBar />
          </div>
        )}
      </div>

      <div className="nav-items-right">
        {currentUser ? (
          <>
            <div className="post-navigation">
              <button className="view-all-post" onClick={() => navigate('/AllPosts')}>
                View All Post
              </button>
            </div>
            <Nav.Item>
              <button className="add-a-post-button" onClick={() => navigate('/create-post')}>
                Add a Post +
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
      
      {isMobile && (
        <div className="navbar-search-mobile">
          <SearchBar />
        </div>
      )}
      
      {isSidebarOpen && <LeftSideBar onClose={() => setIsSidebarOpen(false)} />}
    </Nav>
  );
}