import { createContext, useState, useEffect, useContext } from 'react';
import api, { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Token is automatically added by api interceptor

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Listen for login events (for direct admin login)
  useEffect(() => {
    const handleLoginEvent = (event) => {
      const userData = event.detail;
      if (userData) {
        const storedToken = localStorage.getItem('token');
        if (storedToken) setToken(storedToken);
        setUser(userData);
        setLoading(false);
      }
    };
    window.addEventListener('auth-login', handleLoginEvent);
    return () => window.removeEventListener('auth-login', handleLoginEvent);
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await authAPI.getMe();
      setUser(data.data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await authAPI.login({ email, password });
      
      setToken(data.data.token);
      setUser(data.data.user);
      localStorage.setItem('token', data.data.token);
      
      toast.success(`Welcome back, ${data.data.user.name}!`);
      return data.data.user;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await authAPI.register(userData);
      setToken(data.data.token);
      setUser(data.data.user);
      localStorage.setItem('token', data.data.token);
      toast.success('Registration successful!');
      return data.data.user;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
