import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

// Define types
export interface User {
  id: string;
  email: string;
  phone?: string;
  name?: string;
  role?: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const response = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data?.user) {
            const u = response.data.user;
            setUser({
              id: u._id || u.id,
              email: u.email ?? '',
              phone: u.phone ?? '',
              name: u.name ?? '',
              role: u.role ?? 'user',
            });
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch {
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        setUser({
          id: data.user._id || data.user.id,
          email: data.user.email ?? '',
          phone: data.user.phone ?? '',
          name: data.user.name ?? '',
          role: data.user.role ?? 'user',
        });
        setIsAuthenticated(true);
        toast.success('Successfully logged in!');
        return true;
      }
      return false;
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : 'Login failed';
      toast.error(msg);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await axios.post('/api/auth/register', { name, email, password });
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        setUser({
          id: data.user._id || data.user.id,
          email: data.user.email ?? '',
          phone: data.user.phone ?? '',
          name: data.user.name ?? name,
          role: data.user.role ?? 'user',
        });
        setIsAuthenticated(true);
        toast.success('Registration successful!');
        return true;
      }
      return false;
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : 'Registration failed';
      toast.error(msg);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Successfully logged out');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
