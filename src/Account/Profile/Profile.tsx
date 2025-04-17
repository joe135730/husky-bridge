import { useState } from 'react';
import Navbar from '../../navbar/navbar';
import './Profile.css';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const [fullName, setFullName] = useState('');
    const [neuRole, setNeuRole] = useState('');

    const navigate = useNavigate();

    return (
        <>
            <Navbar />
            <div className="profile-container">
                <div className="profile-header">
                    <h2>Welcome, Amanda!</h2>
                </div>
                <div className="profile-card">
                    <div className="profile-info">
                        {/*             <img src="https://via.placeholder.com/100" alt="Profile Avatar" className="profile-avatar" /> */}
                        <div className="profile-details">
                            <h3>Amanda Rawles</h3>
                            <p>alexarawles@northeastern.edu</p>
                        </div>
                        <button className="edit-btn" onClick={() => navigate('/edit-profile')}>
                            Edit
                        </button>
                    </div>

                    <div className="profile-form">
                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="Your Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />

                        <label>NEU Role</label>
                        <select
                            value={neuRole}
                            onChange={(e) => setNeuRole(e.target.value)}
                        >
                            <option value="">Select Role</option>
                            <option value="undergraduate">Undergraduate Student</option>
                            <option value="graduate">Graduate Student</option>
                            <option value="international">International Student</option>
                        </select>
                    </div>
                </div>
            </div>
        </>
    );
}