import React, { useState, useEffect } from 'react';
import './Cars.css';

const Cars = () => {
    // Стейтове за филтри и списък
    const [searchBrand, setSearchBrand] = useState('');
    const [searchModel, setSearchModel] = useState('');
    const [filterFuel, setFilterFuel] = useState('');
    const [filterTransmission, setFilterTransmission] = useState('');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [pageSize, setPageSize] = useState(8);

    const [appliedFilters, setAppliedFilters] = useState({
        brand: '',
        model: '',
        fuel: '',
        transmission: '',
        priceMin: '',
        priceMax: '',
        page: 1,
        pageSize: 8
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

    // Стейтове за модал ДЕТАЙЛИ
    const [selectedCarId, setSelectedCarId] = useState(null);
    const [modalCarData, setModalCarData] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    // ── СТЙТ ЗА ДИНАМИЧНИТЕ ENUM-И ОТ БЕКЕНДА ──
    const [carOptions, setCarOptions] = useState({
        brands: [],
        fuels: [],
        transmissions: [],
        colors: []
    });

    // Стейтове за новия модал "ADD CAR"
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState(null);

    // Форма съвпадаща с C# модела ти
    const [newCar, setNewCar] = useState({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: '',
        fuel: '',
        transmission: '',
        color: '',
        power: '',
        engineVolume: '',
        description: ''
    });

    // only file uploads are supported
    const [photoFiles, setPhotoFiles] = useState([]);

    // ── 1. FETCH НА ENUM-ИТЕ ПРИ ЗАРЕЖДАНЕ ──
    useEffect(() => {
        const fetchEnums = async () => {
            try {
                const response = await fetch('https://localhost:7125/api/cars/enums/car-options');
                if (!response.ok) throw new Error('Неуспешно зареждане на опциите за коли.');

                const data = await response.json();

                const normalize = (arr) => (arr || []).map(it => ({ name: it.Name ?? it.name ?? it, value: it.Value ?? it.value ?? it }));

                const brands = normalize(data.Brands || data.brands);
                const fuels = normalize(data.Fuels || data.fuels);
                const transmissions = normalize(data.Transmissions || data.transmissions);
                const colors = normalize(data.Colors || data.colors);

                setCarOptions({ brands, fuels, transmissions, colors });

                setNewCar(prev => ({
                    ...prev,
                    brand: brands[0] ? brands[0].value : '',
                    fuel: fuels[0] ? fuels[0].value : '',
                    transmission: transmissions[0] ? transmissions[0].value : '',
                    color: colors[0] ? colors[0].value : ''
                }));

            } catch (err) {
                console.error("Грешка при взимане на енуми:", err);
            }
        };

        fetchEnums();
    }, []);

    // ── 2. FETCH НА СПИСЪКА С КОЛИ ──
    const fetchCars = async (filters) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const queryParams = new URLSearchParams();

            queryParams.append('page', filters.page);
            queryParams.append('pageSize', filters.pageSize);

            if (filters.brand) queryParams.append('brand', filters.brand);
            if (filters.model) queryParams.append('model', filters.model);
            if (filters.fuel) queryParams.append('fuel', filters.fuel);
            if (filters.transmission) queryParams.append('transmission', filters.transmission);
            if (filters.priceMin) queryParams.append('priceMin', filters.priceMin);
            if (filters.priceMax) queryParams.append('priceMax', filters.priceMax);

            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`https://localhost:7125/api/cars?${queryParams.toString()}`, { headers });
            if (response.status === 401) throw new Error('Сесията изтече. Моля, логнете се отново.');
            if (!response.ok) throw new Error('Failed to fetch cars database.');

            const data = await response.json();
            setCarsData({
                items: data.items || [],
                totalCount: data.totalCount || 0,
                page: data.page || 1,
                pageSize: data.pageSize || filters.pageSize,
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

    const fetchCarDetails = async (id) => {
        setSelectedCarId(id);
        setModalLoading(true);
        setModalError(null);
        setModalCarData(null);
        setCurrentPhotoIndex(0);

        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`https://localhost:7125/api/cars/${id}`, { method: 'GET', headers });
            if (response.status === 401) throw new Error('Сесията изтече. Логнете се отново.');
            if (!response.ok) throw new Error('Неуспешно зареждане на детайлите за колата.');

            const data = await response.json();
            setModalCarData(data);
        } catch (err) {
            setModalError(err.message);
        } finally {
            setModalLoading(false);
        }
    };

    useEffect(() => {
        fetchCars(appliedFilters);
    }, [appliedFilters]);

    // Хендлъри за форма
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // for enum fields sent as numeric values convert to number
        if (['brand', 'fuel', 'transmission', 'color'].includes(name)) {
            setNewCar(prev => ({ ...prev, [name]: value !== '' ? Number(value) : '' }));
        } else {
            setNewCar(prev => ({ ...prev, [name]: value }));
        }
    };

    // removed URL-based photo inputs per user request

    const handleAddCarSubmit = async (e) => {
        e.preventDefault();
        setAddLoading(true);
        setAddError(null);

        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const payload = {
                ...newCar,
                brand: Number(newCar.brand),
                fuel: Number(newCar.fuel),
                transmission: Number(newCar.transmission),
                color: Number(newCar.color),
                year: parseInt(newCar.year, 10),
                price: parseFloat(newCar.price),
                power: parseInt(newCar.power, 10),
                engineVolume: parseInt(newCar.engineVolume, 10)
            };

            const response = await fetch('https://localhost:7125/api/cars', {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Неуспешно създаване на обява за кола.');
            }

            // get created car id from response body
            const created = await response.json().catch(() => null);
            const createdCarId = created?.id;

            // upload files if any were selected
            if (createdCarId && photoFiles && photoFiles.length > 0) {
                try {
                    const token = localStorage.getItem('token');
                    for (const file of photoFiles) {
                        const form = new FormData();
                        form.append('File', file);
                        form.append('CarId', createdCarId);

                        const uploadHeaders = {};
                        if (token) uploadHeaders['Authorization'] = `Bearer ${token}`;

                        await fetch('https://localhost:7125/api/photos', {
                            method: 'POST',
                            headers: uploadHeaders,
                            body: form
                        });
                    }
                } catch (uploadErr) {
                    console.error('Photo upload failed', uploadErr);
                }
            }

            setIsAddModalOpen(false);
            setNewCar({
                brand: carOptions.brands[0] ? carOptions.brands[0].value : '',
                model: '',
                year: new Date().getFullYear(),
                price: '',
                fuel: carOptions.fuels[0] ? carOptions.fuels[0].value : '',
                transmission: carOptions.transmissions[0] ? carOptions.transmissions[0].value : '',
                color: carOptions.colors[0] ? carOptions.colors[0].value : '',
                power: '',
                engineVolume: '',
                description: ''
            });
            setPhotoFiles([]);
            fetchCars(appliedFilters);
        } catch (err) {
            setAddError(err.message);
        } finally {
            setAddLoading(false);
        }
    };

    const handleApplyFilters = (e) => {
        e.preventDefault();
        setAppliedFilters({
            brand: searchBrand, model: searchModel, fuel: filterFuel,
            transmission: filterTransmission, priceMin: priceMin, priceMax: priceMax,
            page: 1, pageSize: pageSize
        });
    };

    const handlePageSizeChange = (e) => {
        const newSize = parseInt(e.target.value, 10);
        setPageSize(newSize);
        setAppliedFilters(prev => ({ ...prev, page: 1, pageSize: newSize }));
    };

    const handlePageChange = (newPage) => {
        setAppliedFilters(prev => ({ ...prev, page: newPage }));
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

    const closeModel = () => {
        setSelectedCarId(null);
        setModalCarData(null);
    };

    return (
        <div className="cars-container">
            {/* ГОРНА СЕКЦИЯ С ТИТЛА И БУТОН ADD CAR */}
            <div className="cars-header-wrapper">
                <h1 className="cars-main-title">Vehicles Management Panel</h1>
                <button className="btn-add-car-trigger" onClick={() => setIsAddModalOpen(true)}>
                    <i className="fa-solid fa-plus"></i> Add Car
                </button>
            </div>

            {/* ФИЛТЪР ПАНЕЛ (ИЗПОЛЗВА ДИНАМИЧНИТЕ ЕНУМИ) */}
            <form className="filter-panel" onSubmit={handleApplyFilters}>
                <div className="filter-group search-input">
                    <label>BRAND</label>
                    <div className="input-with-icon">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input type="text" placeholder="Type brand..." value={searchBrand} onChange={(e) => setSearchBrand(e.target.value)} />
                    </div>
                </div>

                <div className="filter-group search-input">
                    <label>MODEL</label>
                    <div className="input-with-icon">
                        <i className="fa-solid fa-car-side"></i>
                        <input type="text" placeholder="Type model..." value={searchModel} onChange={(e) => setSearchModel(e.target.value)} />
                    </div>
                </div>

                <div className="filter-group small-filter">
                    <label>FUEL TYPE</label>
                    <select value={filterFuel} onChange={(e) => setFilterFuel(e.target.value)}>
                        <option value="">All Fuels</option>
                        {carOptions.fuels.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                    </select>
                </div>

                <div className="filter-group small-filter">
                    <label>TRANSMISSION</label>
                    <select value={filterTransmission} onChange={(e) => setFilterTransmission(e.target.value)}>
                        <option value="">All</option>
                        {carOptions.transmissions.map(t => <option key={t.value} value={t.value}>{t.name}</option>)}
                    </select>
                </div>

                <div className="filter-group price-range-group">
                    <label>PRICE RANGE (€)</label>
                    <div className="price-inputs">
                        <input type="number" placeholder="Min" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
                        <span>-</span>
                        <input type="number" placeholder="Max" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
                    </div>
                </div>

                <button type="submit" className="btn-apply-filters">
                    <i className="fa-solid fa-filter"></i> Apply Filters
                </button>
            </form>

            {/* ГЛАВНИ РЕЗУЛТАТИ */}
            {error && <div className="error-box"><i className="fa-solid fa-triangle-exclamation"></i> Error: {error}</div>}

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
                                            <p className="car-info-row"><i className="fa-solid fa-gas-pump"></i> {car.fuel}</p>
                                            <p className="car-info-row"><i className="fa-solid fa-calendar-days"></i> {car.year}</p>
                                            <span className="car-card-created-at"><i className="fa-solid fa-clock"></i> {formatDate(car.createdAt)}</span>
                                        </div>
                                        <p className="car-card-price">{car.price.toLocaleString('de-DE')} €</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ПАГИНАЦИЯ */}
                    <div className="pagination-footer">
                        <span className="pagination-info">
                            Total: <strong>{carsData.totalCount}</strong> cars | Page <strong>{carsData.page}</strong> of <strong>{carsData.totalPages}</strong>
                        </span>

                        <div className="pagination-size-selector">
                            <span>Cars per page:</span>
                            <select value={pageSize} onChange={handlePageSizeChange}>
                                <option value={4}>4</option>
                                <option value={8}>8</option>
                                <option value={12}>12</option>
                                <option value={20}>20</option>
                            </select>
                        </div>

                        <div className="pagination-buttons">
                            <button className="btn-page" disabled={!carsData.hasPrevious || loading} onClick={() => handlePageChange(appliedFilters.page - 1)}>
                                <i className="fa-solid fa-chevron-left"></i> Previous
                            </button>
                            <button className="btn-page" disabled={!carsData.hasNext || loading} onClick={() => handlePageChange(appliedFilters.page + 1)}>
                                Next <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* ── MODAL 1: ADD NEW CAR (ИЗПОЛЗВА ДИНАМИЧНИТЕ ЕНУМИ) ── */}
            {isAddModalOpen && (
                <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
                    <div className="modal-content add-car-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>&times;</button>

                        <div className="add-modal-header">
                            <h2>Create New Vehicle Offer</h2>
                            <p>Values fetched dynamically from your .NET backend backend enums</p>
                        </div>

                        {addError && <div className="error-box"><i className="fa-solid fa-circle-exclamation"></i> {addError}</div>}

                        <form onSubmit={handleAddCarSubmit} className="add-car-form-scrollable">
                            <div className="form-grid-2cols">
                                <div className="form-field">
                                    <label>Brand *</label>
                                    <select name="brand" value={newCar.brand} onChange={handleInputChange} required>
                                        {carOptions.brands.map(b => <option key={b.value} value={b.value}>{b.name}</option>)}
                                    </select>
                                </div>

                                <div className="form-field">
                                    <label>Model *</label>
                                    <input type="text" name="model" placeholder="e.g. 320d" value={newCar.model} onChange={handleInputChange} required />
                                </div>

                                <div className="form-field">
                                    <label>Year *</label>
                                    <input type="number" name="year" value={newCar.year} onChange={handleInputChange} required />
                                </div>

                                <div className="form-field">
                                    <label>Price (€) *</label>
                                    <input type="number" step="any" name="price" placeholder="e.g. 15400" value={newCar.price} onChange={handleInputChange} required />
                                </div>

                                <div className="form-field">
                                    <label>Fuel *</label>
                                    <select name="fuel" value={newCar.fuel} onChange={handleInputChange} required>
                                        {carOptions.fuels.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                                    </select>
                                </div>

                                <div className="form-field">
                                    <label>Transmission *</label>
                                    <select name="transmission" value={newCar.transmission} onChange={handleInputChange} required>
                                        {carOptions.transmissions.map(t => <option key={t.value} value={t.value}>{t.name}</option>)}
                                    </select>
                                </div>

                                <div className="form-field">
                                    <label>Color *</label>
                                    <select name="color" value={newCar.color} onChange={handleInputChange} required>
                                        {carOptions.colors.map(c => <option key={c.value} value={c.value}>{c.name}</option>)}
                                    </select>
                                </div>

                                <div className="form-field">
                                    <label>Power (hp) *</label>
                                    <input type="number" name="power" placeholder="e.g. 184" value={newCar.power} onChange={handleInputChange} required />
                                </div>

                                <div className="form-field full-width-field">
                                    <label>Engine Volume (cm³) *</label>
                                    <input type="number" name="engineVolume" placeholder="e.g. 1995" value={newCar.engineVolume} onChange={handleInputChange} required />
                                </div>
                            </div>

                            {/* СЕКЦИЯ ЗА СНИМКИ (PHOTO URLS) */}
                            <div className="form-field photo-urls-section">
                                <label>Vehicle Images</label>
                                <div className="photo-input-row file-upload-row">
                                    <label className="file-upload-label">Select image files to upload:</label>
                                    <input type="file" accept="image/*" multiple onChange={(e) => setPhotoFiles(Array.from(e.target.files || []))} />
                                </div>
                            </div>

                            <div className="form-field">
                                <label>Seller Description</label>
                                <textarea name="description" rows="3" placeholder="Describe technical state, extras, history..." value={newCar.description} onChange={handleInputChange}></textarea>
                            </div>

                            <div className="add-form-actions">
                                <button type="button" className="btn-cancel-add" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-submit-add" disabled={addLoading}>
                                    {addLoading ? 'Saving Offer...' : 'Publish Advertisement'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: ДЕТАЙЛИ НА КОЛА */}
            {selectedCarId && (
                <div className="modal-overlay" onClick={closeModel}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={closeModel}>&times;</button>

                        {modalLoading && <div className="modal-status">Loading specifications...</div>}
                        {modalError && <div className="modal-status modal-error"><i className="fa-solid fa-circle-exclamation"></i> {modalError}</div>}

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
                                            <h3>Seller Description</h3>
                                            <div className="modal-description-scroll-area">
                                                <p>{modalCarData.description}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="modal-dates-footer">
                                        <span><strong>Published:</strong> {formatDate(modalCarData.createdAt)}</span>
                                        <span><strong>Modified:</strong> {formatDate(modalCarData.lastChanged)}</span>
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

export default Cars;