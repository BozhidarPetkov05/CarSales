import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Settings from '../Pages/Settings';
import Users from '../Pages/Users';
import Cars from '../Pages/Cars'; // 1. Импортираме новия компонент за колите (напасни пътя, ако е различен)
import './Dashboard.css';

const Dashboard = () => {
    // По подразбиране е 'cars', така че това ще е първото, което се вижда
    const [activePage, setActivePage] = useState('cars');

    const renderPageContent = () => {
        switch (activePage) {
            case 'cars':
                return <Cars />; // 2. Заменяме временния div с истинския компонент
            case 'favourites':
                return (
                    <div className="page-container">
                        <h1 style={{ textAlign: 'center', marginTop: '40px' }}>Your Favourite Cars</h1>
                    </div>
                );
            case 'users':
                return <Users />;
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