import React, { useState, useEffect } from 'react';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import Dashboard from './components/Layout/Dashboard'; // Правилен път до твоя Layout

function App() {
    // Възможни състояния: 'login', 'signup' или 'dashboard'
    const [currentScreen, setCurrentScreen] = useState('login');

    // Автоматична проверка при зареждане: ако има токен, потребителят влиза директно
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setCurrentScreen('dashboard');
        }
    }, []);

    // Тази функция се задейства при успешен login/signup
    const handleAuthSuccess = (token) => {
        // Когато Login или SignUp компонентите ти подадат сигнал за успех,
        // сменяме стейта и React веднага ни вкарва в Dashboard
        setCurrentScreen('dashboard');
    };

    // 1. Ако сме логнати успешно, показваме твоя Dashboard
    if (currentScreen === 'dashboard') {
        return <Dashboard />;
    }

    // 2. Ако не сме логнати, показваме Login или SignUp, спрямо твоята логика
    return (
        <>
            {currentScreen === 'login' ? (
                <Login
                    onLoginSuccess={handleAuthSuccess}
                    onNavigateToSignUp={() => setCurrentScreen('signup')}
                />
            ) : (
                <SignUp
                    onRegisterSuccess={handleAuthSuccess}
                    onNavigateToLogin={() => setCurrentScreen('login')}
                />
            )}
        </>
    );
}

export default App;