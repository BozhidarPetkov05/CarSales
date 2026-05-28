import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Settings from '../Pages/Settings';
import Users from '../Pages/Users'; // <--- 1. ДОБАВИ ТОЗИ ИМПОРТ
import './Dashboard.css';

const Dashboard = () => {
    const [activePage, setActivePage] = useState('cars');

    const renderPageContent = () => {
        switch (activePage) {
            case 'cars':
                return (
                    <div className="page-container">
                        <h1 style={{ textAlign: 'center', marginTop: '40px' }}>Cars Inventory Page</h1>
                    </div>
                );
            case 'favourites':
                return (
                    <div className="page-container">
                        <h1 style={{ textAlign: 'center', marginTop: '40px' }}>Your Favourite Cars</h1>
                    </div>
                );
            case 'users':
                return <Users />; // <--- 2. ТУК ЗАРЕЖДАМЕ ИСТИНСКАТА СТРАНИЦА
            case 'settings':
                return <Settings />;
            default:
                return <div className="page-container"><h1>Welcome</h1></div>;
        }
    };

    return (
        <div className="dashboard-wrapper">
            <TopBar />
            <Sidebar activePage={activePage} setActivePage={setActivePage} />
            <main className="main-content">
                {renderPageContent()}
            </main>
        </div>
    );
};

export default Dashboard;