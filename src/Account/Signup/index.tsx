import { Link } from "react-router-dom";
import neulogo from "../../assets/neuLogo.png"
import "./Signup.css";

export default function Signup() {
    return (
        <div className="signup-page">
            <div className="signup-header">
                <Link to="/" className="brand-link">HuskyBridge</Link>
            </div>
            <div className="signup-container">
                <h1>Sign up</h1>
                <p className="signup-subtitle">Create your account in a seconds</p>
                
                <form className="signup-form">
                    <div className="form-group">
                        <input 
                            type="text" 
                            placeholder="First Name"
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="text" 
                            placeholder="Last Name"
                            className="form-input"
                        />
                    </div>
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
                            placeholder="Create Password"
                            className="form-input"
                        />
                    </div>
                    <div className="form-group role-selection">
                        <label className="role-option">
                            <input type="radio" name="role" value="undergrad" defaultChecked />
                            <span>Undergrads</span>
                        </label>
                        <label className="role-option">
                            <input type="radio" name="role" value="graduate" />
                            <span>Graduates</span>
                        </label>
                        <label className="role-option">
                            <input type="radio" name="role" value="international" />
                            <span>International</span>
                        </label>
                    </div>
                    <button type="submit" className="signup-submit-btn">Create an account</button>
                    <div className="login-prompt">
                        Already a member? <Link to="/login" className="login-link">Login</Link>
                    </div>
                    <Link to="/" className="back-home-btn">Back to Home</Link>
                </form>
            </div>
        </div>
    );
} 