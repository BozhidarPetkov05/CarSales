import React, { useState } from 'react';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';

function App() {
    // Възможни състояния: 'login' или 'signup'
    const [currentScreen, setCurrentScreen] = useState('login');

    const handleAuthSuccess = (token) => {
        // Токенът е вече записан в localStorage. 
        // Можеш да смениш стейта към основната част на приложението.
    };

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