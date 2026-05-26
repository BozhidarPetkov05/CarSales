import { useEffect, useState } from 'react';

const CarList = ({ onLogout }) => {
    const [cars, setCars] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCars = async () => {
            const token = localStorage.getItem('token');

            try {
                const response = await fetch('https://localhost:7125/api/cars', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();

                    if (Array.isArray(data)) {
                        setCars(data);
                    } else if (data && Array.isArray(data.cars)) {
                        setCars(data.cars);
                    } else if (data && typeof data === 'object') {
                        const values = Object.values(data);
                        const foundArray = values.find(val => Array.isArray(val));
                        if (foundArray) {
                            setCars(foundArray);
                        } else {
                            setError('Backend did not return an array of cars.');
                        }
                    } else {
                        setError('Invalid data format received from server.');
                    }
                } else {
                    setError(`Failed to fetch cars. Status: ${response.status}`);
                }
            } catch (e) {
                /* eslint-disable-next-line no-unused-vars */
                setError('Could not connect to the server.');
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    if (loading) return <div className="loading-text">Loading cars...</div>;
    if (error) return <div className="error-message">{error}</div>;

    const carsArray = Array.isArray(cars) ? cars : [];

    return (
        <div className="car-container">
            <div className="car-header">
                <h2>Available Cars</h2>
                <button onClick={onLogout} className="btn-logout">Logout</button>
            </div>

            <div className="car-grid">
                {carsArray.length === 0 ? (
                    <p className="no-cars">No cars available at the moment.</p>
                ) : (
                    carsArray.map((car) => (
                        <div key={car.id || Math.random()} className="car-card">
                            <div className="car-image-wrapper">
                                <img
                                    src={car.mainPhotoUrl || 'https://placehold.co/300x200?text=No+Image'}
                                    alt={`${car.brand || 'Unknown'} ${car.model || 'Car'}`}
                                />
                            </div>
                            <div className="car-details">
                                <h3>{car.brand} {car.model}</h3>
                                <p><strong>Year:</strong> {car.year} | <strong>Fuel:</strong> {car.fuel}</p>
                                <p className="car-price">${car.price ? car.price.toLocaleString() : '0'}</p>
                                <small>Added on: {car.createdAt ? new Date(car.createdAt).toLocaleDateString() : 'Unknown'}</small>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CarList;