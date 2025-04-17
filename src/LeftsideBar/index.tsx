// src/Components/LeftSideBar/index.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser, faEnvelope, faClipboard, faCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { clearCurrentUser } from "../store/account-reducer";
import * as accountClient from "../Account/client";
import "./LeftSideBar.css";

const LeftSideBar = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignout = async () => {
    try {
      await accountClient.signout();
      dispatch(clearCurrentUser());
      navigate("/");
      onClose();
    } catch (error) {
      console.error("Signout error:", error);
    }
  };

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
          <Link to="/Account/profile" onClick={onClose}>
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
          <button className="logout-link" onClick={handleSignout}>
            <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '10px' }} /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default LeftSideBar;