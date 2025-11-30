// frontend/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const { registerUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);

  // If already authenticated, redirect immediately
  if (isAuthenticated) {
      navigate('/');
      return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear errors on input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;

    try {
        // Call the register function from our AuthContext
        const success = await registerUser(name, email, password);
        
        if (success) {
            // Navigate to the home page on successful registration/login
            navigate('/');
        }
    } catch (err) {
        // Display the error message from the backend
        // err is the object thrown from AuthContext (error.response.data)
        setError(err.error || "An unknown registration error occurred.");
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Register Account</h2>
      {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom: '10px'}}>
            <input 
            type="text" 
            name="name" 
            placeholder="Full Name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            style={{padding: '8px', width: '100%'}}
            />
        </div>
        <div style={{marginBottom: '10px'}}>
            <input 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            style={{padding: '8px', width: '100%'}}
            />
        </div>
        <div style={{marginBottom: '10px'}}>
            <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            style={{padding: '8px', width: '100%'}}
            />
        </div>
        <button type="submit" style={{padding: '10px 20px', cursor: 'pointer'}}>Register</button>
      </form>
      
      <p style={{marginTop: '15px'}}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default RegisterPage;