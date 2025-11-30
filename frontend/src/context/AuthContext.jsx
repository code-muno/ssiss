// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// 1) Create context
export const AuthContext = createContext(null);

// 2) Helper: set axios auth header
function setAxiosAuthToken(token) {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
}

// 3) Provider implementation
export const AuthProvider = ({ children }) => {
  // state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check localStorage / validate token
  const [error, setError] = useState(null);

  // base URL for axios (change to your deployed API in production)
  axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // helper to persist auth into state + localStorage + axios header
  const persistAuth = useCallback((newToken, newUser) => {
    if (newToken) {
      setToken(newToken);
      localStorage.setItem('auth_token', newToken);
      setAxiosAuthToken(newToken);
    }

    if (newUser) {
      setUser(newUser);
      // optionally: persist minimal user info
      localStorage.setItem('auth_user', JSON.stringify(newUser));
    }
  }, []);

  // login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/auth/login', { email, password });
      // Expecting either { token, user } or { token }
      const { token: resToken, user: resUser } = res.data;

      if (!resToken) {
        // backend didn't return token: throw
        throw new Error('Authentication failed: no token returned by server.');
      }

      // persist token + user
      persistAuth(resToken, resUser || null);

      // if server didn't return user, attempt to fetch profile
      if (!resUser) {
        try {
          const me = await axios.get('/auth/me');
          setUser(me.data.user || me.data);
          localStorage.setItem('auth_user', JSON.stringify(me.data.user || me.data));
        } catch (e) {
          // profile fetch failed — still logged in with token, but warn
          console.warn('Failed to fetch profile after login:', e);
        }
      }

      setLoading(false);
      return { ok: true };
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.error || error.message || 'Login failed');
      setLoading(false);
      return { ok: false, error: error || error.message };
    }
  };

  // register function (optional helper)
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/auth/register', { name, email, password });
      // If register returns token, auto-login behaviour:
      const { token: resToken, user: resUser } = res.data;
      if (resToken) {
        persistAuth(resToken, resUser || null);
      }
      setLoading(false);
      return { ok: true, data: res.data };
    } catch (err) {
      console.error('Register failed:', err);
      setError(err.response?.data?.error || err.message || 'Register failed');
      setLoading(false);
      return { ok: false, error: error || err.message };
    }
  };

  // logout
  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    setAxiosAuthToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    // Optionally call backend logout endpoint to invalidate refresh tokens (if you implement them)
    // axios.post('/auth/logout').catch(() => {});
  };

  // try to load token/user from storage on mount and validate token
  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');

      if (!storedToken) {
        setLoading(false);
        return;
      }

      // set token on axios and in state immediately to allow parallel requests
      setAxiosAuthToken(storedToken);
      setToken(storedToken);

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          // ignore parse errors
          localStorage.removeItem('auth_user');
        }
      }

      // attempt to validate token by calling /auth/me (if backend exposes it)
      try {
        const res = await axios.get('/auth/me');
        // typical response shape: { user: { ... } } or direct user object
        const validatedUser = res.data.user || res.data;
        setUser(validatedUser);
        localStorage.setItem('auth_user', JSON.stringify(validatedUser));
      } catch (err) {
        console.warn('Token validation failed, clearing auth', err);
        // invalid token — clear
        logout();
      } finally {
        setLoading(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // context value
  const contextValue = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
    error,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// 4) Custom hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx === undefined || ctx === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
