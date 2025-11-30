import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Create the Context object
export const AuthContext = createContext();

// 2. Create the Provider component
export const AuthProvider = ({ children }) => {
    // State to hold the user object and the token
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // Set the base URL for Axios
    axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

    // 3. User Login Function 
    const login = (userData) => {
        // We will call this function after a successful API call
        setUser(userData.user);
        setToken(userData.token);
        
        // Save the token/user data to local storage for persistence
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData.user));
    };

    // 4. User Logout Function
    const logout = () => {
        setUser(null);
        setToken(null);
        // Also remove the token from localStorage (we'll add this persistence later)
        console.log('User logged out');
    };
    // 4a. User Registration Function
    const registerUser = async (name, email, password) => {
        try {
            const response = await axios.post('/auth/register', { 
                name, 
                email, 
                password 
            });

            // If registration is successful, we can automatically log them in
            login(response.data); // Use the data from the server response
            
            // Return true for components to handle navigation
            return true; 
        } catch (error) {
            console.error("Registration failed:", error.response.data);
            // Throw the error for the component to display to the user
            throw error.response.data; 
        }
    };

    // 5. Context Value - The data and functions we expose
  const contextValue = {
        user,
        token,
        login, // We keep the original login function name for simplicity
        logout,
        registerUser, // 👈 Expose the new registration function
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// 6. Custom Hook for easy use
export const useAuth = () => {
    return useContext(AuthContext);
};