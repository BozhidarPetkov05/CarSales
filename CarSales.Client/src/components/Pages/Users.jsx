import React, { useState, useEffect } from 'react';
import './Users.css';

const Users = () => {
    const [usersData, setUsersData] = useState({
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

    // Стейтове за полетата във формата (визуално въведеното от потребителя)
    const [searchUsername, setSearchUsername] = useState('');
    const [filterAdmin, setFilterAdmin] = useState('');
    const [isDescending, setIsDescending] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // Стейтове за заключените филтри (използват се при реалната заявка)
    const [activeFilters, setActiveFilters] = useState({
        username: '',
        isAdmin: '',
        isDescending: true
    });

    const fetchUsers = async (pageToFetch, filtersToUse) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const queryParams = new URLSearchParams();

            queryParams.append('page', pageToFetch);
            queryParams.append('pageSize', 8);
            queryParams.append('isDescending', filtersToUse.isDescending);

            if (filtersToUse.username.trim()) {
                queryParams.append('username', filtersToUse.username.trim());
            }
            if (filtersToUse.isAdmin !== '') {
                queryParams.append('isAdmin', filtersToUse.isAdmin);
            }

            const response = await fetch(`https://localhost:7125/api/users?${queryParams.toString()}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401 || response.status === 403) {
                throw new Error('Access denied. Admin rights required.');
            }
            if (!response.ok) throw new Error('Failed to fetch users database.');

            const data = await response.json();

            setUsersData({
                items: data.items || [],
                totalCount: data.totalCount || 0,
                page: data.page || 1,
                pageSize: data.pageSize || 8,
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

    // Задейства се само при смяна на страницата
    useEffect(() => {
        fetchUsers(currentPage, activeFilters);
    }, [currentPage]);

    // Задейства се ръчно при натискане на "Apply Filters"
    const handleApplyFilters = (e) => {
        e.preventDefault();

        const newFilters = {
            username: searchUsername,
            isAdmin: filterAdmin,
            isDescending: isDescending
        };
        setActiveFilters(newFilters);
        setCurrentPage(1);
        fetchUsers(1, newFilters);
    };

    if (error) return <div className="users-status-container error-box"><i className="fa-solid fa-triangle-exclamation"></i> Error: {error}</div>;

    return (
        <div className="users-container">
            <h1 className="users-main-title">User Management Panel</h1>

            {/* ── СЕКЦИЯ С ФИЛТРИ И ТЪРСЕНЕ ── */}
            <form className="users-filter-bar" onSubmit={handleApplyFilters}>
                <div className="filter-group search-input">
                    <label>Search Username</label>
                    <div className="input-icon-wrapper">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            placeholder="Type username..."
                            value={searchUsername}
                            onChange={(e) => setSearchUsername(e.target.value)}
                        />
                    </div>
                </div>

                <div className="filter-group">
                    <label>Role Filter</label>
                    <select value={filterAdmin} onChange={(e) => setFilterAdmin(e.target.value)}>
                        <option value="">All Roles</option>
                        <option value="true">Administrators Only</option>
                        <option value="false">Regular Users</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Order by Creation</label>
                    <select value={isDescending} onChange={(e) => setIsDescending(e.target.value === 'true')}>
                        <option value="true">Newest First</option>
                        <option value="false">Oldest First</option>
                    </select>
                </div>

                <button type="submit" className="btn-filter-search">
                    <i className="fa-solid fa-filter"></i> Apply Filters
                </button>
            </form>

            {/* ── ТАБЛИЦА С ПОТРЕБИТЕЛИ ── */}
            <div className="users-table-wrapper">
                {loading ? (
                    <div className="users-table-loading">Loading system accounts...</div>
                ) : usersData.items.length === 0 ? (
                    <div className="users-empty-box">
                        <i className="fa-solid fa-users-slash"></i>
                        <p>No users found matching the filter criteria.</p>
                    </div>
                ) : (
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Full Name</th>
                                <th>Role</th>
                                <th>Member Since</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersData.items.map((u) => (
                                <tr key={u.id}>
                                    <td className="cell-username">{u.username}</td>
                                    <td>{u.firstName} {u.lastName}</td>
                                    <td>
                                        {u.isAdmin ? (
                                            <span className="badge-role admin">Admin</span>
                                        ) : (
                                            <span className="badge-role user">User</span>
                                        )}
                                    </td>
                                    <td>{new Date(u.createdAt).toLocaleDateString('en-GB')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ── СТРАНИЦИРАНЕ (PAGINATION) ── */}
            <div className="pagination-footer">
                <span className="pagination-info">
                    Total: <strong>{usersData.totalCount}</strong> users | Page <strong>{usersData.page}</strong> of <strong>{usersData.totalPages}</strong>
                </span>
                <div className="pagination-buttons">
                    <button
                        className="btn-page"
                        disabled={!usersData.hasPrevious || loading}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                        <i className="fa-solid fa-chevron-left"></i> Previous
                    </button>
                    <button
                        className="btn-page"
                        disabled={!usersData.hasNext || loading}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        Next <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Users;