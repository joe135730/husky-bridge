import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { StoreType } from '../../store';
import * as client from '../client';
import './EditProfile.css';

export default function EditProfile() {
    const navigate = useNavigate();
    const { currentUser } = useSelector((state: StoreType) => state.accountReducer);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        role: ''
    });

    const [errors, setErrors] = useState({
        currentPassword: '',
        newPassword: ''
    });

    const [touched, setTouched] = useState({
        currentPassword: false,
        newPassword: false
    });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const user = await client.profile();
                setFormData(prev => ({
                    ...prev,
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                    role: user.role || ''
                }));
            } catch (error) {
                console.error("Error loading profile:", error);
                navigate('/Account/login');
            }
        };
        loadProfile();
    }, [navigate]);

    const validatePassword = (password: string) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        return passwordRegex.test(password);
    };

    const handlePasswordBlur = (field: 'currentPassword' | 'newPassword') => {
        setTouched(prev => ({ ...prev, [field]: true }));
        validatePasswordFields();
    };

    const validatePasswordFields = () => {
        const newErrors = { ...errors };
        
        // Clear errors first
        newErrors.currentPassword = '';
        newErrors.newPassword = '';

        // Only validate if either password field is filled
        if (formData.currentPassword || formData.newPassword) {
            if (!formData.currentPassword) {
                newErrors.currentPassword = 'Current password is required when setting new password';
            }
            if (!formData.newPassword) {
                newErrors.newPassword = 'New password is required when changing password';
            } else if (!validatePassword(formData.newPassword)) {
                newErrors.newPassword = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character';
            }
        }

        setErrors(newErrors);
        return !newErrors.currentPassword && !newErrors.newPassword;
    };

    const handleSubmit = async () => {
        try {
            if (!currentUser?._id) return;

            // Mark both password fields as touched to show validation errors
            setTouched(prev => ({
                ...prev,
                currentPassword: true,
                newPassword: true
            }));

            // Validate password fields if either is filled
            if (!validatePasswordFields()) {
                return;
            }

            const updateData: any = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                role: formData.role
            };

            // Only include password in update if both fields are filled
            if (formData.currentPassword && formData.newPassword) {
                updateData.password = formData.newPassword;
                updateData.currentPassword = formData.currentPassword;
            }
            
            try {
                await client.updateUser(currentUser._id, updateData);
                navigate('/Account/profile');
            } catch (error: any) {
                if (error.response?.status === 401) {
                    setErrors(prev => ({
                        ...prev,
                        currentPassword: 'Current password is incorrect'
                    }));
                } else {
                    console.error("Error updating profile:", error);
                }
            }
        } catch (error) {
            console.error("Error in handleSubmit:", error);
        }
    };

    if (!currentUser) {
        return null;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>Welcome, {formData.firstName}!</h2>
            </div>
            <div className="profile-card">
                <div className="profile-info">
                    <div className="profile-details">
                        <h3>{`${formData.firstName} ${formData.lastName}`}</h3>
                        <p>{formData.email}</p>
                    </div>
                </div>

                <div className="profile-form">
                    <label>First Name</label>
                    <input
                        type="text"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    />

                    <label>Last Name</label>
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    />

                    <label>Current Password</label>
                    <input
                        type="password"
                        placeholder="Current Password"
                        className={errors.currentPassword ? 'error' : ''}
                        value={formData.currentPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        onBlur={() => handlePasswordBlur('currentPassword')}
                    />
                    {errors.currentPassword && 
                        <span className="error-message">{errors.currentPassword}</span>
                    }

                    <label>New Password</label>
                    <input
                        type="password"
                        placeholder="New Password"
                        className={errors.newPassword ? 'error' : ''}
                        value={formData.newPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                        onBlur={() => handlePasswordBlur('newPassword')}
                    />
                    {errors.newPassword && 
                        <span className="error-message">{errors.newPassword}</span>
                    }

                    <label>NEU Role</label>
                    <select
                        value={formData.role}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    >
                        <option value="">Select Role</option>
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                    </select>

                    <div className="form-actions">
                        <button className="cancel-btn" onClick={() => navigate('/Account/profile')}>Cancel</button>
                        <button className="save-btn" onClick={handleSubmit}>Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}