import { Link } from "react-router-dom";
import { useState } from "react";
import neulogo from "../../assets/neuLogo.png"
import "./Signup.css";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { signup, User } from '../client';

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<User>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'STUDENT'  // Default to STUDENT
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

    const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        return passwordRegex.test(password);
    };

    const handleInfoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowPasswordTooltip(!showPasswordTooltip);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        // For the role field, convert to uppercase to match the schema enum
        if (name === 'role') {
            setFormData(prev => ({
                ...prev,
                [name]: value.toUpperCase()
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // For password field, check validation
        if (name === 'password') {
            if (validatePassword(value)) {
                setErrors(prev => ({
                    ...prev,
                    password: ''
                }));
            }
        } else {
            // Clear error for other fields
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
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

    const handleSubmit = async (e: React.FormEvent) => {
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
            try {
                await signup(formData);
                navigate('/Account/login');
            } catch (err: any) {
                setErrors(prev => ({
                    ...prev,
                    email: err.response?.data?.message || 'Signup failed. Please try again.'
                }));
            }
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
                        <div className="password-field-container">
                            <input 
                                type="password" 
                                name="password"
                                placeholder="Create Password"
                                className={`form-input password-field ${touched.password && errors.password ? 'error' : ''}`}
                                value={formData.password}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                            />
                            <button 
                                className="info-button"
                                onClick={handleInfoClick}
                                type="button"
                            >
                                ℹ️
                            </button>
                        </div>
                        {touched.password && errors.password && <span className="error-message">{errors.password}</span>}
                        <div className={`password-tooltip ${showPasswordTooltip ? 'show' : ''}`}>
                            Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*()_-+={};"|\,.&lt;&gt;/?)
                        </div>
                    </div>
                    <div className="form-group role-selection">
                        <label className="role-option">
                            <input 
                                type="radio" 
                                name="role" 
                                value="STUDENT" 
                                checked={formData.role === "STUDENT"}
                                onChange={handleInputChange}
                            />
                            <span>Student</span>
                        </label>
                        <label className="role-option">
                            <input 
                                type="radio" 
                                name="role" 
                                value="ADMIN" 
                                checked={formData.role === "ADMIN"}
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