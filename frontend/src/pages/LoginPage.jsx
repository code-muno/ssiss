// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);

    // If user is already logged in, kick them to the home page
    if (isAuthenticated) {
        navigate('/');
        return null;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;

        try {
            // 1. Make the API Call directly or via context
            // Note: Since 'login' in context just updates state, we do the axios call here
            // OR we could move this axios call into the context like 'registerUser'
            const response = await axios.post('/auth/login', { email, password });
            
            // 2. Pass the data (token + user) to the context to update global state
            login(response.data);
            
            // 3. Navigate Home
            navigate('/');
        } catch (err) {
            console.error("Login Error:", err);
            setError(err.response?.data?.error || "Invalid email or password");
        }
    };

    return (
        <div className="auth-form-container">
            <h2>Login</h2>
            {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                />
                <button type="submit">Login</button>
            </form>
            
            <p style={{marginTop: '15px'}}>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
};

export default LoginPage;