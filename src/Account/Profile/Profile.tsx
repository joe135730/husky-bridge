import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { StoreType } from '../../store';
import * as client from '../client';
import './Profile.css';

export default function Profile() {
    const navigate = useNavigate();
    const { currentUser } = useSelector((state: StoreType) => state.accountReducer);
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: ''
    });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const user = await client.profile();
                setUserData({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                    role: user.role || ''
                });
            } catch (error) {
                console.error("Error loading profile:", error);
                navigate('/Account/login');
            }
        };
        loadProfile();
    }, [navigate]);

    if (!currentUser) {
        return null; // or a loading spinner
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>Welcome, {userData.firstName}!</h2>
            </div>
            <div className="profile-card">
                <div className="profile-info">
                    {/*             <img src="https://via.placeholder.com/100" alt="Profile Avatar" className="profile-avatar" /> */}
                    <div className="profile-details">
                        <h3>{`${userData.firstName} ${userData.lastName}`}</h3>
                        <p>{userData.email}</p>
                    </div>
                    <button className="edit-btn" onClick={() => navigate('/Account/profile/edit')}>
                        Edit
                    </button>
                </div>

                <div className="profile-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={`${userData.firstName} ${userData.lastName}`}
                            disabled
                        />
                    </div>

                    <div className="form-group">
                        <label>NEU Role</label>
                        <input
                            type="text"
                            value={userData.role}
                            disabled
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}