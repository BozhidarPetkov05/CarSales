import React, { useState } from 'react';
import Login from './components/Login';
import SignUp from './components/SignUp';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="auth-header">
                    <h2>Car Sales Management System</h2>
                    <p className="auth-subtitle">{isLogin ? 'Login' : 'Sign Up'}</p>
                </div>

                {isLogin ? (
                    <Login onSwitchToSignUp={() => setIsLogin(false)} />
                ) : (
                    <SignUp onSwitchToLogin={() => setIsLogin(true)} />
                )}
            </div>
        </div>
    );
};

export default AuthPage;