import { Link } from "react-router-dom";
import neulogo from "../../assets/neuLogo.png"
import "./Login.css";

export default function Login() {
    return (
        <div className="login-page">
            <div className="login-header">
                <Link to="/" className="brand-link">HuskyBridge</Link>
            </div>
            <div className="login-container">
                <h1>Sign in</h1>
                <p className="login-subtitle">Login your account in a seconds</p>
                
                <form className="login-form">
                    <div className="form-group">
                        <input 
                            type="email" 
                            placeholder="Email Address"
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="password" 
                            placeholder="Password"
                            className="form-input"
                        />
                    </div>
                    <div className="form-links">
                        <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
                    </div>
                    <button type="submit" className="login-submit-btn">Log in</button>
                    <div className="signup-prompt">
                        Don't have an account? <Link to="/signup" className="signup-link">Sign up</Link>
                    </div>
                    <Link to="/" className="back-home-btn">Back to Home</Link>
                </form>
                <div className="login-divider">
                    <span>Or continue with</span>
                </div>
                <div className="sso-login">
                    <button className="sso-button">
                        <img src={neulogo} alt="NEU" className="sso-icon" />
                    </button>
                </div>
            </div>
        </div>
    );
} 