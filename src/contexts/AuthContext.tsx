import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Define types
export interface User {
  id: string;
  email: string;
  phone?: string;
  name?: string;         // optional since Supabase doesn't return it directly
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
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const { data, error } = await supabase.auth.getUser();

          if (error || !data.user) {
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
          } else {
            const supaUser = data.user;
            const appUser: User = {
              id: supaUser.id,
              email: supaUser.email ?? '',
              phone: supaUser.phone ?? '',
              name: supaUser.user_metadata?.name ?? '',  // try to extract name
              role: 'user', // default role
            };
            setUser(appUser);
            setIsAuthenticated(true);
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        toast.error(error?.message || 'Login failed');
        return false;
      }

      localStorage.setItem('token', data.session?.access_token || '');

      const appUser: User = {
        id: data.user.id,
        email: data.user.email ?? '',
        phone: data.user.phone ?? '',
        name: data.user.user_metadata?.name ?? '',
        role: 'user',
      };

      setUser(appUser);
      setIsAuthenticated(true);
      toast.success('Successfully logged in!');
      return true;
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Login failed');
      }
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error || !data.user) {
        toast.error(error?.message || 'Registration failed');
        return false;
      }

      localStorage.setItem('token', data.session?.access_token || '');

      const appUser: User = {
        id: data.user.id,
        email: data.user.email ?? '',
        phone: data.user.phone ?? '',
        name,
        role: 'user',
      };

      setUser(appUser);
      setIsAuthenticated(true);
      toast.success('Registration successful!');
      return true;
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Registration failed');
      }
      return false;
    }
  };

  const logout = () => {
    supabase.auth.signOut();
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/');
    toast.success('Successfully logged out');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
