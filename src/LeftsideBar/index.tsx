// src/Components/LeftSideBar/index.tsx
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser, faEnvelope, faClipboard, faCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "./LeftSideBar.css";

const LeftSideBar = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="left-sidebar">
      <button className="close-button" onClick={onClose}>✖</button>
      <ul>
        <li>
          <Link to="/" onClick={onClose}>
            <FontAwesomeIcon icon={faHome} /> Home
          </Link>
        </li>
        <li>
          <Link to="/my-profile" onClick={onClose}>
            <FontAwesomeIcon icon={faUser} /> Profile
          </Link>
        </li>
        <li>
          <Link to="/messages" onClick={onClose}>
            <FontAwesomeIcon icon={faEnvelope} /> Messages
          </Link>
        </li>
        <li>
          <Link to="/all-my-posts" onClick={onClose}>
            <FontAwesomeIcon icon={faClipboard} /> My Post
          </Link>
        </li>
        <li>
          <Link to="/settings" onClick={onClose}>
            <FontAwesomeIcon icon={faCog} /> Settings
          </Link>
        </li>
        <li>
          <Link to="/logout" onClick={onClose}>
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default LeftSideBar;