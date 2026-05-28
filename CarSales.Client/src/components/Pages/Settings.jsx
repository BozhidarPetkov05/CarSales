import React, { useState, useEffect } from 'react';
import { getLoggedUserId } from '../../utils/jwtHelper';
import './Settings.css';

const Settings = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [globalError, setGlobalError] = useState(null);

    // States for the modal and its status messages
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalError, setModalError] = useState('');
    const [modalSuccess, setModalSuccess] = useState('');

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        age: ''
    });

    const fetchUserData = async () => {
        const userId = getLoggedUserId();
        if (!userId) {
            setGlobalError('User ID not found in session token.');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://localhost:7125/api/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to fetch user settings.');

            const data = await response.json();
            setUser(data);

            setFormData({
                username: data.username || '',
                password: '',
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                age: data.age || ''
            });
        } catch (err) {
            setGlobalError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleOpenModal = () => {
        setModalError('');
        setModalSuccess('');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Validation logic (matching registration criteria)
    const validateForm = () => {
        const nameRegex = /^[A-Za-zА-Яа-яЁё]+$/;

        if (formData.username.trim().length < 3) {
            return "Username must be at least 3 characters long.";
        }
        if (/\s/.test(formData.username)) {
            return "Username cannot contain spaces.";
        }
        if (formData.password.length < 6) {
            return "Password must be at least 6 characters long.";
        }
        if (!nameRegex.test(formData.firstName)) {
            return "First name must contain letters only.";
        }
        if (!nameRegex.test(formData.lastName)) {
            return "Last name must contain letters only.";
        }
        if (formData.age !== '') {
            const ageNum = parseInt(formData.age, 10);
            if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
                return "Age must be a valid number between 18 and 120.";
            }
        }
        return null;
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setModalError('');
        setModalSuccess('');

        const validationError = validateForm();
        if (validationError) {
            setModalError(validationError);
            return;
        }

        const userId = getLoggedUserId();
        const token = localStorage.getItem('token');

        const updateBody = {
            username: formData.username.trim(),
            password: formData.password,
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            age: formData.age ? parseInt(formData.age, 10) : null
        };

        try {
            const response = await fetch(`https://localhost:7125/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateBody)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to update profile.');
            }

            setModalSuccess('Profile updated successfully!');

            setTimeout(() => {
                setIsModalOpen(false);
                fetchUserData();
            }, 1200);

        } catch (err) {
            setModalError(err.message);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete your account permanently? This action cannot be undone.");
        if (!confirmDelete) return;

        const userId = getLoggedUserId();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://localhost:7125/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete the user account.');

            localStorage.removeItem('token');
            window.location.reload();
        } catch (err) {
            setGlobalError(`Delete failed: ${err.message}`);
        }
    };

    if (loading) return <div className="settings-loading">Loading account profiles...</div>;
    if (globalError) return <div className="settings-error">Error: {globalError}</div>;
    if (!user) return <div className="settings-error">No user data found.</div>;

    return (
        <div className="settings-container">
            <h1 className="settings-main-title">Your Account Settings</h1>

            <div className="settings-layout-card">
                <div className="profile-header">
                    <div>
                        <h2 className="profile-fullname">{user.firstName} {user.lastName}</h2>
                        <p className="profile-id">ID: <span>{user.id}</span></p>
                    </div>
                    {user.isAdmin && <span className="admin-badge">ADMINISTRATOR</span>}
                </div>

                {/* Личните данни - подредени точно по редове в решетката */}
                <div className="profile-grid">
                    {/* РЕД 1 */}
                    <div className="grid-item">
                        <label>Username</label>
                        <p>{user.username}</p>
                    </div>
                    <div className="grid-item">
                        <label>Member Since</label>
                        <p>{new Date(user.createdAt).toLocaleDateString('en-GB')}</p>
                    </div>

                    {/* РЕД 2 */}
                    <div className="grid-item">
                        <label>First Name</label>
                        <p>{user.firstName}</p>
                    </div>
                    <div className="grid-item">
                        <label>Last Updated (UTC)</label>
                        <p>
                            {new Date(user.lastChanged).toLocaleString('en-GB', { timeZone: 'UTC' })} UTC
                        </p>
                    </div>

                    {/* РЕД 3 */}
                    <div className="grid-item">
                        <label>Last Name</label>
                        <p>{user.lastName}</p>
                    </div>
                    <div className="grid-item">
                        <label>Age</label>
                        <p>{user.age ? user.age : 'Not specified'}</p>
                    </div>
                </div>

                {/* Бутоните за действие */}
                <div className="settings-actions">
                    <button className="btn-action-update" onClick={handleOpenModal}>
                        <i className="fa-solid fa-user-pen"></i> Update Profile
                    </button>
                    <button className="btn-action-delete" onClick={handleDelete}>
                        <i className="fa-solid fa-trash-can"></i> Delete Account
                    </button>
                </div>

                {/* Секцията с колите */}
                <div className="cars-inventory-section">
                    <h3>Your Cars Inventory</h3>
                    {user.cars && user.cars.length > 0 ? (
                        <div className="cars-placeholder-list">
                            <p>You have {user.cars.length} active car listings inside the system.</p>
                        </div>
                    ) : (
                        <div className="no-cars-box">
                            <i className="fa-solid fa-car-tunnel"></i>
                            <p>You currently have no listed cars.</p>
                            <span>Add your first car to get started.</span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── UPDATE MODAL WINDOW ── */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content-box">
                        <div className="modal-header">
                            <h2>Edit Personal Information</h2>
                            <button className="modal-close-x" onClick={handleCloseModal}>&times;</button>
                        </div>

                        <form onSubmit={handleUpdateSubmit} className="modal-form">

                            {modalError && (
                                <div className="modal-status-error">
                                    <i className="fa-solid fa-triangle-exclamation"></i> {modalError}
                                </div>
                            )}

                            {modalSuccess && (
                                <div className="modal-status-success">
                                    <i className="fa-solid fa-circle-check"></i> {modalSuccess}
                                </div>
                            )}

                            <div className="modal-form-grid">
                                <div className="form-group full-width">
                                    <label>Username</label>
                                    <div className="input-with-icon">
                                        <i className="fa-solid fa-user"></i>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group full-width">
                                    <label>Password <span className="label-optional">(Enter your old password to save or new to update)</span></label>
                                    <div className="input-with-icon">
                                        <i className="fa-solid fa-lock"></i>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>First Name</label>
                                    <div className="input-with-icon">
                                        <i className="fa-solid fa-signature"></i>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Last Name</label>
                                    <div className="input-with-icon">
                                        <i className="fa-solid fa-signature"></i>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group full-width">
                                    <label>Age</label>
                                    <div className="input-with-icon">
                                        <i className="fa-solid fa-calendar-days"></i>
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="modal-buttons">
                                <button type="button" className="btn-modal-cancel" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="btn-modal-submit">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;