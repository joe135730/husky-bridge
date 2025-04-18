import { Link } from "react-router-dom";
import huskyLogo from "../../assets/husky.png";
import "./Introduction.css";

export default function Introduction() {
  return (
    <div className="introduction">
      <div className="intro-content">
        <div className="intro-text">
          <h1 className="intro-title">
            CONNECTING HUSKIES,
            <br />
            ONE HELPING HAND
            <br />
            AT A TIME.
          </h1>
          <p className="intro-description">
            Welcome to HuskyBridge – a peer-to-peer support network built for
            the Northeastern community. Whether you need help or want to offer
            assistance, we make it easy to connect with fellow Huskies. Find
            resources, share knowledge, and lend a hand—all in one place.
          </p>
          <div id="request-page" className="intro-buttons">
            <Link to="/create-post" className="seek-help-btn">
              Seek for Help
            </Link>
            <Link to="/create-post?postType=offer" id="help-page" className="make-offer-btn">
              Make an Offer
            </Link>
          </div>
        </div>
        <div className="intro-image">
          <img src={huskyLogo} alt="Husky Logo" className="husky-logo" />
        </div>
      </div>
    </div>
  );
}
