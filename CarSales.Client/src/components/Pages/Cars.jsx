import React, { useState, useEffect } from 'react';
import './Cars.css';

const Cars = () => {
    // Всички състояния за филтрите
    const [searchBrand, setSearchBrand] = useState('');
    const [searchModel, setSearchModel] = useState('');
    const [filterFuel, setFilterFuel] = useState('');
    const [filterTransmission, setFilterTransmission] = useState('');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');

    // Стейт за изпратените филтри (актуалните филтри, които в момента са приложени)
    const [appliedFilters, setAppliedFilters] = useState({
        brand: '',
        model: '',
        fuel: '',
        transmission: '',
        priceMin: '',
        priceMax: '',
        page: 1
    });

    const [carsData, setCarsData] = useState({
        items: [],
        totalCount: 0,
        page: 1,
        pageSize: 8,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const pageSize = 8;

    const fetchCars = async (filters) => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const queryParams = new URLSearchParams();

            // Задължителни параметри за пагинация
            queryParams.append('page', filters.page);
            queryParams.append('pageSize', pageSize);

            // Добавяме филтрите само ако имат избрана стойност
            if (filters.brand) queryParams.append('brand', filters.brand);
            if (filters.model) queryParams.append('model', filters.model);
            if (filters.fuel) queryParams.append('fuel', filters.fuel);
            if (filters.transmission) queryParams.append('transmission', filters.transmission);
            if (filters.priceMin) queryParams.append('priceMin', filters.priceMin);
            if (filters.priceMax) queryParams.append('priceMax', filters.priceMax);

            const headers = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(
                `https://localhost:7125/api/cars?${queryParams.toString()}`,
                { method: 'GET', headers: headers }
            );

            if (response.status === 401) {
                throw new Error('Сесията изтече. Моля, логнете се отново.');
            }

            if (!response.ok) {
                throw new Error('Failed to fetch cars database.');
            }

            const data = await response.json();

            setCarsData({
                items: data.items || [],
                totalCount: data.totalCount || 0,
                page: data.page || 1,
                pageSize: data.pageSize || pageSize,
                totalPages: data.totalPages || 1,
                hasNext: data.hasNext || false,
                hasPrevious: data.hasPrevious || false
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Изпълнява се първоначално и при всяка смяна на приложените филтри/страници
    useEffect(() => {
        fetchCars(appliedFilters);
    }, [appliedFilters]);

    // Функция, която се задейства при натискане на "Apply Filters"
    const handleApplyFilters = (e) => {
        e.preventDefault();
        setAppliedFilters({
            brand: searchBrand,
            model: searchModel,
            fuel: filterFuel,
            transmission: filterTransmission,
            priceMin: priceMin,
            priceMax: priceMax,
            page: 1 // При нов филтър винаги връщаме на първа страница
        });
    };

    // Функция за смяна на страниците
    const handlePageChange = (newPage) => {
        setAppliedFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    // Форматиране на датата (ДД/ММ/ГГГГ)
    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="cars-container">
            <h1 className="cars-main-title">Vehicles Management Panel</h1>

            {/* ФИЛТЪР ПАНЕЛ (Аналогичен на User Management) */}
            <form className="filter-panel" onSubmit={handleApplyFilters}>
                <div className="filter-group">
                    <label>BRAND</label>
                    <div className="input-with-icon">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            placeholder="Type brand..."
                            value={searchBrand}
                            onChange={(e) => setSearchBrand(e.target.value)}
                        />
                    </div>
                </div>

                <div className="filter-group">
                    <label>MODEL</label>
                    <div className="input-with-icon">
                        <i className="fa-solid fa-car-side"></i>
                        <input
                            type="text"
                            placeholder="Type model..."
                            value={searchModel}
                            onChange={(e) => setSearchModel(e.target.value)}
                        />
                    </div>
                </div>

                <div className="filter-group">
                    <label>FUEL TYPE</label>
                    <select value={filterFuel} onChange={(e) => setFilterFuel(e.target.value)}>
                        <option value="">All Fuels</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="Gasoline">Gasoline</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="PlugInHybrid">PlugInHybrid</option>
                        <option value="LPG">LPG</option>
                        <option value="Hydrogen">Hydrogen</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>TRANSMISSION</label>
                    <select value={filterTransmission} onChange={(e) => setFilterTransmission(e.target.value)}>
                        <option value="">All</option>
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                        <option value="SemiAutomatic">SemiAutomatic</option>
                        <option value="CVT">CVT</option>
                    </select>
                </div>

                <div className="filter-group price-range-group">
                    <label>PRICE RANGE (€)</label>
                    <div className="price-inputs">
                        <input
                            type="number"
                            placeholder="Min"
                            value={priceMin}
                            onChange={(e) => setPriceMin(e.target.value)}
                        />
                        <span>-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={priceMax}
                            onChange={(e) => setPriceMax(e.target.value)}
                        />
                    </div>
                </div>

                <button type="submit" className="btn-apply-filters">
                    <i className="fa-solid fa-filter"></i> Apply Filters
                </button>
            </form>

            {/* СЪДЪРЖАНИЕ / РЕЗУЛТАТИ */}
            {error && (
                <div className="cars-status-container error-box">
                    <i className="fa-solid fa-triangle-exclamation"></i> Error: {error}
                </div>
            )}

            {loading ? (
                <div className="cars-loading">Loading vehicles...</div>
            ) : carsData.items.length === 0 ? (
                <div className="cars-empty-box">
                    <i className="fa-solid fa-car-burst"></i>
                    <p>No cars found matching the criteria.</p>
                </div>
            ) : (
                <>
                    <div className="cars-grid">
                        {carsData.items.map((car) => (
                            <div key={car.id} className="car-card">
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
                                            {car.price.toLocaleString('de-DE', { minimumFractionDigits: 0 })} €
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* PAGINATION */}
                    <div className="pagination-footer">
                        <span className="pagination-info">
                            Total: <strong>{carsData.totalCount}</strong> cars |
                            Page <strong>{carsData.page}</strong> of <strong>{carsData.totalPages}</strong>
                        </span>

                        <div className="pagination-buttons">
                            <button
                                className="btn-page"
                                disabled={!carsData.hasPrevious || loading}
                                onClick={() => handlePageChange(appliedFilters.page - 1)}
                            >
                                <i className="fa-solid fa-chevron-left"></i> Previous
                            </button>

                            <button
                                className="btn-page"
                                disabled={!carsData.hasNext || loading}
                                onClick={() => handlePageChange(appliedFilters.page + 1)}
                            >
                                Next <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cars;