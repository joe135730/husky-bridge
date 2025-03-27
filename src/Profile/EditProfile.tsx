import { useState } from 'react';
import './EditProfile.css';

export default function EditProfile() {
    const [fullName, setFullName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [neuRole, setNeuRole] = useState('');

    const handleSubmit = () => {
        // Handle form submission logic
    };

    return (
        <>

            <div className="profile-container">
                <div className="profile-header">
                    <h2>Welcome, Amanda!</h2>
                </div>
                <div className="profile-card">
                    <div className="profile-info">
                        {/*                         <img src="https://via.placeholder.com/100" alt="Profile Avatar" className="profile-avatar" /> */}
                        <div className="profile-details">
                            <h3>Amanda Rawles</h3>
                            <p>alexarawles@northeastern.edu</p>
                        </div>
                    </div>

                    <div className="profile-form">
                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="Your Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />

                        <label>Current Password</label>
                        <input
                            type="password"
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />

                        <label>New Password</label>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                        <label>NEU Role</label>
                        <select
                            value={neuRole}
                            onChange={(e) => setNeuRole(e.target.value)}
                        >
                            <option value="">Role name</option>
                            <option value="undergraduate">Undergraduate Student</option>
                            <option value="graduate">Graduate Student</option>
                            <option value="international">International Student</option>
                        </select>

                        <div className="form-actions">
                            <button className="cancel-btn" onClick={() => navigate('/profile')}>Cancel</button>
                            <button className="save-btn" onClick={handleSubmit}>Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}