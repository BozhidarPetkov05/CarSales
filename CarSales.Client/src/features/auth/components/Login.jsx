import { useState } from 'react';

const Login = ({ onLoginSuccess, onSwitchToSignUp }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.username || !formData.password) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const formBody = new URLSearchParams();
            formBody.append('Username', formData.username);
            formBody.append('Password', formData.password);

            const response = await fetch('https://localhost:7125/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formBody.toString(),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                onLoginSuccess();
            } else {
                let errorMessage = 'Login failed.';
                try {
                    const data = await response.json();
                    errorMessage = data.detail || data.message || errorMessage;
                } catch {
                    errorMessage = `Error: ${response.status}`;
                }
                setError(errorMessage);
            }
        } catch {
            setError('Could not connect to the server.');
        }
    };

    return (
        <div className="auth-card">
            <h2>Car Sales Management System</h2>
            <form onSubmit={handleSubmit}>
                {error && <p className="error-message">{error}</p>}

                <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} />
                </div>

                <button type="submit" className="btn-submit">Login</button>

                <p className="switch-text">
                    Don't have an account? <span onClick={onSwitchToSignUp}>Sign up here</span>
                </p>
            </form>
        </div>
    );
};

export default Login;