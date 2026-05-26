import { useState } from 'react';
import Login from './features/auth/components/Login';
import SignUp from './features/auth/components/SignUp';
import CarList from './features/cars/components/CarList';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isLoginView, setIsLoginView] = useState(true);

    const handleLoginSuccess = () => {
        const savedToken = localStorage.getItem('token');
        setToken(savedToken);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setIsLoginView(true);
    };

    // 1. Ако има токен, показваме списъка с коли
    if (token) {
        return (
            <div className="app-container">
                <CarList onLogout={handleLogout} />
            </div>
        );
    }

    // 2. Ако няма токен, показваме логин или регистрация без никакви излишни логвания
    return (
        <div className="app-container">
            {isLoginView ? (
                <Login
                    onLoginSuccess={handleLoginSuccess}
                    onSwitchToSignUp={() => setIsLoginView(false)}
                />
            ) : (
                <SignUp
                    onSwitchToLogin={() => setIsLoginView(true)}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}
        </div>
    );
};

export default App;