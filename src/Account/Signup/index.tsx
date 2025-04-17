import { Link } from "react-router-dom";
import { useState } from "react";
import neulogo from "../../assets/neuLogo.png"
import "./Signup.css";
import { Button, Form } from "react-bootstrap";

export default function Signup() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'undergrad'
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const [touched, setTouched] = useState({
        firstName: false,
        lastName: false,
        email: false,
        password: false
    });

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        return passwordRegex.test(password);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));

        validateField(name, value);
    };

    const validateField = (name: string, value: string) => {
        let error = '';
        
        if (!value.trim()) {
            error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        } else if (name === 'email' && !validateEmail(value)) {
            error = 'Please enter a valid email address';
        } else if (name === 'password' && !validatePassword(value)) {
            error = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character';
        }

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate all fields
        const newErrors = {
            firstName: !formData.firstName.trim() ? 'First Name is required' : '',
            lastName: !formData.lastName.trim() ? 'Last Name is required' : '',
            email: !formData.email.trim() ? 'Email is required' : !validateEmail(formData.email) ? 'Please enter a valid email address' : '',
            password: !formData.password.trim() ? 'Password is required' : !validatePassword(formData.password) ? 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character' : ''
        };

        setErrors(newErrors);
        setTouched({
            firstName: true,
            lastName: true,
            email: true,
            password: true
        });

        // Check if there are any errors
        if (Object.values(newErrors).every(error => !error)) {
            // Proceed with form submission
            console.log('Form submitted:', formData);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-header">
                <Link to="/" className="brand-link">HuskyBridge</Link>
            </div>
            <div className="signup-container">
                <h1>Sign up</h1>
                <p className="signup-subtitle">Create your account in a seconds</p>
                
                <Form className="signup-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input 
                            type="text" 
                            name="firstName"
                            placeholder="First Name"
                            className={`form-input ${touched.firstName && errors.firstName ? 'error' : ''}`}
                            value={formData.firstName}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                        />
                        {touched.firstName && errors.firstName && <span className="error-message">{errors.firstName}</span>}
                    </div>
                    <div className="form-group">
                        <input 
                            type="text" 
                            name="lastName"
                            placeholder="Last Name"
                            className={`form-input ${touched.lastName && errors.lastName ? 'error' : ''}`}
                            value={formData.lastName}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                        />
                        {touched.lastName && errors.lastName && <span className="error-message">{errors.lastName}</span>}
                    </div>
                    <div className="form-group">
                        <input 
                            type="email" 
                            name="email"
                            placeholder="Email Address"
                            className={`form-input ${touched.email && errors.email ? 'error' : ''}`}
                            value={formData.email}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                        />
                        {touched.email && errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                    <div className="form-group">
                        <input 
                            type="password" 
                            name="password"
                            placeholder="Create Password"
                            className={`form-input ${touched.password && errors.password ? 'error' : ''}`}
                            value={formData.password}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                        />
                        <span className="password-requirements">
                            Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*()_-+={};"|\,.&lt;&gt;/?)
                        </span>
                        {touched.password && errors.password && <span className="error-message">{errors.password}</span>}
                    </div>
                    <div className="form-group role-selection">
                        <label className="role-option">
                            <input 
                                type="radio" 
                                name="role" 
                                value="student" 
                                onChange={handleInputChange}
                            />
                            <span>Student</span>
                        </label>
                        <label className="role-option">
                            <input 
                                type="radio" 
                                name="role" 
                                value="admin" 
                                onChange={handleInputChange}
                            />
                            <span>Admin</span>
                        </label>
                    </div>
                    <Button type="submit" className="signup-submit-btn">
                        Create an account
                    </Button>
                    <div className="login-prompt">
                        Already a member? <Link to="/Account/login" className="login-link">Login</Link>
                    </div>
                    <Link to="/" className="back-home-btn">Back to Home</Link>
                </Form>
            </div>
        </div>
    );
}