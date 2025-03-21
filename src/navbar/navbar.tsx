import Nav from "react-bootstrap/Nav";
import { Link, useLocation } from "react-router";
import "./navbar.css";

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <Nav variant="pills" id="wd-toc" className="navbar-container">
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
      
      <div className="nav-items-right">
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/"
            id="home-page"
            active={pathname === "/"}
          >
            Home
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/Request"
            id="request-page"
            active={pathname.includes("Request")}
          >
            View All Request
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/Help"
            id="help-page"
            active={pathname.includes("Help")}
          >
            View All Help
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/login" id="login-page">
            <button className="login-button">
              Login
            </button>
          </Nav.Link>
        </Nav.Item>
      </div>
    </Nav>
  );
}
