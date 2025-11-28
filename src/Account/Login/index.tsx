import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../store/account-reducer.ts";
import * as client from "../client";
import neulogo from "../../assets/neuLogo.png"
import "./Login.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Email and password are required");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const user = await client.signin(email, password);
            
            const userWithConsistentRole = {
                ...user,
                role: user.role.toUpperCase()
            };
            
            dispatch(setCurrentUser(userWithConsistentRole));
            
            navigate("/");
        } catch (err: unknown) {
            console.error("Login error:", err);
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-header">
                <Link to="/" className="brand-link">HuskyBridge</Link>
            </div>
            <div className="login-container">
                <h1>Sign in</h1>
                <p className="login-subtitle">Login your account in a seconds</p>
                
                {error && <div className="error-message">{error}</div>}
                
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <input 
                            type="email" 
                            placeholder="Email Address"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="password" 
                            placeholder="Password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-links">
                        <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
                    </div>
                    <button 
                        type="submit" 
                        className="login-submit-btn"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Log in"}
                    </button>
                    <div className="signup-prompt">
                        Don't have an account? <Link to="/Account/signup" className="signup-link">Sign up</Link>
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