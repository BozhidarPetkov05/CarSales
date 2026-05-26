import { useState } from 'react';

const SignUp = ({ onSwitchToLogin, onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        age: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const value = e.target.name === 'age' ? (e.target.value ? parseInt(e.target.value, 10) : '') : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const validateForm = () => {
        const nameRegex = /^[A-Za-zА-Яа-яЁё-]+$/;

        if (!formData.username.trim()) return "Username is required!";
        if (formData.username.length < 4) return "Username length must be at least 4 characters!";
        if (formData.username.length > 20) return "Username length must not exceed 20 characters!";

        if (!formData.password) return "Password is required!";
        if (formData.password.length < 5) return "Password must be at least 5 characters!";
        if (formData.password.length > 50) return "Password must not exceed 50 characters!";

        if (!formData.firstName.trim()) return "First name is required!";
        if (formData.firstName.length < 2) return "First name must be at least 2 characters!";
        if (formData.firstName.length > 30) return "First name must not exceed 30 characters!";
        if (!nameRegex.test(formData.firstName)) return "First name can contain letters and hyphens!";

        if (!formData.lastName.trim()) return "Last name is required!";
        if (formData.lastName.length < 2) return "Last name must be at least 2 characters!";
        if (formData.lastName.length > 30) return "Last name must not exceed 30 characters!";
        if (!nameRegex.test(formData.lastName)) return "Last name can contain letters and hyphens!";

        if (formData.age !== '') {
            if (formData.age < 1 || formData.age > 120) {
                return "Age must be between 1 and 120!";
            }
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        const backendData = {
            Username: formData.username,
            Password: formData.password,
            FirstName: formData.firstName,
            LastName: formData.lastName
        };

        if (formData.age !== '') {
            backendData.Age = formData.age;
        }

        try {
            // 1. СТЪПКА: Регистрация (JSON)
            const response = await fetch('https://localhost:7125/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(backendData),
            });

            if (response.ok) {
                // 2. СТЪПКА: Автоматичен логин (x-www-form-urlencoded)
                try {
                    const formBody = new URLSearchParams();
                    formBody.append('Username', formData.username);
                    formBody.append('Password', formData.password);

                    const authResponse = await fetch('https://localhost:7125/api/auth', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: formBody.toString(),
                    });

                    if (authResponse.ok) {
                        const data = await authResponse.json();
                        localStorage.setItem('token', data.token);

                        // Сега onLoginSuccess е дефинирана функция и няма да дава грешка!
                        if (typeof onLoginSuccess === 'function') {
                            onLoginSuccess();
                        } else {
                            console.error("onLoginSuccess не е подадена правилно като функция!");
                            onSwitchToLogin();
                        }
                    } else {
                        console.log("Автоматичният вход върна статус:", authResponse.status);
                        setError('Account created, but automatic login failed. Please log in manually.');
                    }
                } catch (authErr) {
                    console.error("Грешка при автоматичен вход към api/auth:", authErr);
                    setError('Account created, but could not connect to login server. Please log in manually.');
                }
            } else {
                let errorMessage = 'Registration failed.';
                try {
                    const data = await response.json();
                    errorMessage = data.detail || data.message || errorMessage;
                } catch {
                    errorMessage = `Server responded with status ${response.status}`;
                }
                setError(errorMessage);
            }
        } catch (err) {
            console.error("Грешка при връзка към api/users:", err);
            setError('Could not connect to the server.');
        }
    };

    return (
        <div className="auth-card">
            <h2>Car Sales Management System</h2>
            <form onSubmit={handleSubmit}>
                {error && <p className="error-message">{error}</p>}

                <div className="form-row">
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>First Name</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group">
                    <label>Age (Optional)</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} />
                </div>

                <button type="submit" className="btn-submit">Sign Up</button>

                <p className="switch-text">
                    Already have an account? <span onClick={onSwitchToLogin}>Login here</span>
                </p>
            </form>
        </div>
    );
};

export default SignUp;