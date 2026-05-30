import React, { useState, useEffect } from 'react';
import { getLoggedUserId } from '../../utils/jwtHelper';
import './Settings.css';

const Settings = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [globalError, setGlobalError] = useState(null);

    // Profile Edit Modal States
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

    // ── CAR DETAILS MODAL STATES (MATCHING CARS.JSX) ──
    const [selectedCarId, setSelectedCarId] = useState(null);
    const [modalCarData, setModalCarData] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalCarError, setModalCarError] = useState(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [deleteLoading, setDeleteLoading] = useState(false);

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

    // ── FETCH CAR DETAILS ──
    const fetchCarDetails = async (id) => {
        setSelectedCarId(id);
        setModalLoading(true);
        setModalCarError(null);
        setModalCarData(null);
        setCurrentPhotoIndex(0);

        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`https://localhost:7125/api/cars/${id}`, { method: 'GET', headers });
            if (response.status === 401) throw new Error('Session expired. Please log in again.');
            if (!response.ok) throw new Error('Failed to load car details.');

            const data = await response.json();
            setModalCarData(data);
        } catch (err) {
            setModalCarError(err.message);
        } finally {
            setModalLoading(false);
        }
    };

    // ── DELETE CAR OFFER ──
    const handleDeleteCar = async (id) => {
        if (!window.confirm("Are you sure you want to delete this vehicle advertisement permanently?")) {
            return;
        }

        setDeleteLoading(true);
        setModalCarError(null);

        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`https://localhost:7125/api/cars/${id}`, {
                method: 'DELETE',
                headers
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to delete the listing.');
            }

            closeCarModal();
            fetchUserData(); // Презарежда данните за потребителя и неговия инвентар
            alert('The advertisement was successfully removed.');

        } catch (err) {
            alert(err.message);
        } finally {
            setDeleteLoading(false);
        }
    };

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

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    };

    const nextPhoto = (e) => {
        e.stopPropagation();
        if (modalCarData?.photoUrls?.length) {
            setCurrentPhotoIndex((prev) => (prev + 1) % modalCarData.photoUrls.length);
        }
    };

    const prevPhoto = (e) => {
        e.stopPropagation();
        if (modalCarData?.photoUrls?.length) {
            setCurrentPhotoIndex((prev) => (prev - 1 + modalCarData.photoUrls.length) % modalCarData.photoUrls.length);
        }
    };

    const closeCarModal = () => {
        setSelectedCarId(null);
        setModalCarData(null);
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

                {/* Personal Information Grid */}
                <div className="profile-grid">
                    <div className="grid-item">
                        <label>Username</label>
                        <p>{user.username}</p>
                    </div>
                    <div className="grid-item">
                        <label>Member Since</label>
                        <p>{new Date(user.createdAt).toLocaleDateString('en-GB')}</p>
                    </div>

                    <div className="grid-item">
                        <label>First Name</label>
                        <p>{user.firstName}</p>
                    </div>
                    <div className="grid-item">
                        <label>Last Updated (UTC)</label>
                        <p>{new Date(user.lastChanged).toLocaleString('en-GB', { timeZone: 'UTC' })} UTC</p>
                    </div>

                    <div className="grid-item">
                        <label>Last Name</label>
                        <p>{user.lastName}</p>
                    </div>
                    <div className="grid-item">
                        <label>Age</label>
                        <p>{user.age ? user.age : 'Not specified'}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="settings-actions">
                    <button className="btn-action-update" onClick={handleOpenModal}>
                        <i className="fa-solid fa-user-edit"></i> Update Profile
                    </button>
                    <button className="btn-action-delete" onClick={handleDelete}>
                        <i className="fa-solid fa-trash"></i> Delete Account
                    </button>
                </div>

                {/* ── НАЧАЛО НА СЕКЦИЯТА С КОЛИ ПОДРЕДЕНИ КАТО В CARS.JSX ── */}
                <div className="cars-inventory-section">
                    <h3>Your Cars Inventory</h3>
                    {user.cars && user.cars.length > 0 ? (
                        <div className="cars-grid">
                            {user.cars.map((car) => (
                                <div key={car.id} className="car-card" onClick={() => fetchCarDetails(car.id)}>
                                    <div className="car-card-image-wrapper">
                                        {car.mainPhotoUrl ? (
                                            <img src={car.mainPhotoUrl} alt={`${car.brand} ${car.model}`} className="car-card-image" />
                                        ) : (
                                            <div className="car-card-no-image">
                                                <i className="fa-solid fa-camera"></i>
                                                <span>No Photo Available</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="car-card-details">
                                        <h3 className="car-card-title">{car.brand} {car.model}</h3>
                                        <div className="car-card-bottom-section">
                                            <div className="car-card-specs-left">
                                                <p className="car-info-row">
                                                    <i className="fa-solid fa-gas-pump"></i> {car.fuel}
                                                </p>
                                                <p className="car-info-row">
                                                    <i className="fa-solid fa-calendar-days"></i> {car.year}
                                                </p>
                                                <span className="car-card-created-at">
                                                    <i className="fa-solid fa-clock"></i> {formatDate(car.createdAt)}
                                                </span>
                                            </div>
                                            <p className="car-card-price">
                                                {car.price ? car.price.toLocaleString('de-DE') : 0} €
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="cars-empty-box">
                            <i className="fa-solid fa-car-burst"></i>
                            <p>You currently have no listed cars.</p>
                        </div>
                    )}
                </div>
                {/* ── КРАЙ НА СЕКЦИЯТА С КОЛИ ── */}
            </div>

            {/* ── MODAL 1: EDIT PROFILE ── */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>
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
                                        <input type="text" name="username" value={formData.username} onChange={handleInputChange} required />
                                    </div>
                                </div>

                                <div className="form-group full-width">
                                    <label>Password <span className="label-optional">(Enter password to verify or change)</span></label>
                                    <div className="input-with-icon">
                                        <i className="fa-solid fa-lock"></i>
                                        <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" required />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>First Name</label>
                                    <div className="input-with-icon">
                                        <i className="fa-solid fa-signature"></i>
                                        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Last Name</label>
                                    <div className="input-with-icon">
                                        <i className="fa-solid fa-signature"></i>
                                        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                                    </div>
                                </div>

                                <div className="form-group full-width">
                                    <label>Age</label>
                                    <div className="input-with-icon">
                                        <i className="fa-solid fa-calendar-days"></i>
                                        <input type="number" name="age" value={formData.age} onChange={handleInputChange} />
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

            {/* ── MODAL 2: CAR DETAILS (DUPLICATED FROM CARS.JSX) ── */}
            {selectedCarId && (
                <div className="modal-overlay" onClick={closeCarModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={closeCarModal}>&times;</button>

                        {modalLoading && <div className="modal-status">Loading specifications...</div>}
                        {modalCarError && <div className="modal-status modal-error"><i className="fa-solid fa-circle-exclamation"></i> {modalCarError}</div>}

                        {modalCarData && (
                            <div className="modal-body">
                                <div className="modal-gallery-section">
                                    {modalCarData.photoUrls && modalCarData.photoUrls.length > 0 ? (
                                        <div className="carousel-container">
                                            <img src={modalCarData.photoUrls[currentPhotoIndex]} alt="Vehicle detail view" className="carousel-image" />
                                            {modalCarData.photoUrls.length > 1 && (
                                                <>
                                                    <button type="button" className="carousel-btn prev" onClick={prevPhoto}>
                                                        <i className="fa-solid fa-chevron-left"></i>
                                                    </button>
                                                    <button type="button" className="carousel-btn next" onClick={nextPhoto}>
                                                        <i className="fa-solid fa-chevron-right"></i>
                                                    </button>
                                                    <div className="carousel-dots">
                                                        {modalCarData.photoUrls.map((_, index) => (
                                                            <span key={index} className={`dot ${index === currentPhotoIndex ? 'active' : ''}`} onClick={() => setCurrentPhotoIndex(index)} />
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="modal-no-image">
                                            <i className="fa-solid fa-camera"></i>
                                            <span>No Detailed Photos Available</span>
                                        </div>
                                    )}
                                </div>

                                <div className="modal-info-section">
                                    <div className="modal-header-info">
                                        <h2>{modalCarData.brand} {modalCarData.model}</h2>
                                        <p className="modal-price-tag">{modalCarData.price.toLocaleString('de-DE')} €</p>
                                    </div>

                                    <div className="specs-table-grid">
                                        <div className="spec-item">
                                            <span className="spec-label"><i className="fa-solid fa-calendar"></i> Year</span>
                                            <span className="spec-value">{modalCarData.year}</span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-label"><i className="fa-solid fa-gas-pump"></i> Fuel</span>
                                            <span className="spec-value">{modalCarData.fuel}</span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-label"><i className="fa-solid fa-gears"></i> Gearbox</span>
                                            <span className="spec-value">{modalCarData.transmission}</span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-label"><i className="fa-solid fa-palette"></i> Color</span>
                                            <span className="spec-value">{modalCarData.color || 'N/A'}</span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-label"><i className="fa-solid fa-bolt"></i> Power</span>
                                            <span className="spec-value">{modalCarData.power ? `${modalCarData.power} hp` : 'N/A'}</span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-label"><i className="fa-solid fa-cubes"></i> Engine Volume</span>
                                            <span className="spec-value">{modalCarData.engineVolume ? `${modalCarData.engineVolume} cm³` : 'N/A'}</span>
                                        </div>
                                    </div>

                                    {modalCarData.description && (
                                        <div className="modal-description-box">
                                            <h3>Description</h3>
                                            <div className="modal-description-scroll-area">
                                                <p>{modalCarData.description}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="modal-dates-footer">
                                        <span><strong>Published:</strong> {formatDate(modalCarData.createdAt)}</span>
                                        <span><strong>Modified:</strong> {formatDate(modalCarData.lastChanged)}</span>
                                    </div>

                                    {/* DELETE BUTTON FOR USER'S OWN LISTING */}
                                    <div className="admin-actions-wrapper" style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                                        <button
                                            type="button"
                                            className="btn-delete-car"
                                            disabled={deleteLoading}
                                            onClick={() => handleDeleteCar(modalCarData.id)}
                                            style={{
                                                backgroundColor: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                padding: '10px 15px',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <i className="fa-solid fa-trash-can"></i>
                                            {deleteLoading ? 'Deleting Listing...' : 'Delete Listing'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;