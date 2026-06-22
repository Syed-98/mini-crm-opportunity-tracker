import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const TOKEN_EXPIRY_MS = 2 * 60 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistAuth = (userData, authToken) => {
    const expiresAt = Date.now() + TOKEN_EXPIRY_MS;
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('expiresAt', expiresAt.toString());
    setUser(userData);
    setToken(authToken);
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('expiresAt');
    setUser(null);
    setToken(null);
  };

  const logout = () => {
    clearAuth();
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/api/auth/register', { name, email, password });
    const userData = { _id: data._id, name: data.name, email: data.email };
    persistAuth(userData, data.token);
    return userData;
  };

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    const userData = { _id: data._id, name: data.name, email: data.email };
    persistAuth(userData, data.token);
    return userData;
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const expiresAt = localStorage.getItem('expiresAt');

    if (storedToken && storedUser && expiresAt) {
      if (Date.now() < parseInt(expiresAt, 10)) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        clearAuth();
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
