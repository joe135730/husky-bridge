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
            to="/SeekHelp"
            id="seek-help-page"
            active={pathname.includes("SeekHelp")}
          >
            Seek Help
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/OfferHelp"
            id="offer-help-page"
            active={pathname.includes("OfferHelp")}
          >
            Offer Help
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
