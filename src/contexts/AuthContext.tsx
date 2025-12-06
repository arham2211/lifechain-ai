import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock mode for testing without backend
    const MOCK_MODE = true; // Set to false when backend is ready
    
    if (MOCK_MODE) {
      // Mock login - determine role based on email
      let mockUser: User;
      
      if (email === 'patient@test.com' && password === 'password') {
        mockUser = {
          id: '1',
          email: 'patient@test.com',
          name: 'John Doe',
          role: 'patient',
          entity_id: 'P001',
        };
      } else if (email === 'doctor@test.com' && password === 'password') {
        mockUser = {
          id: '2',
          email: 'doctor@test.com',
          name: 'Dr. Sarah Smith',
          role: 'doctor',
          entity_id: 'D001',
        };
      } else if (email === 'lab@test.com' && password === 'password') {
        mockUser = {
          id: '3',
          email: 'lab@test.com',
          name: 'Lab Technician',
          role: 'lab_staff',
          entity_id: 'L001',
        };
      } else if (email === 'admin@test.com' && password === 'password') {
        mockUser = {
          id: '4',
          email: 'admin@test.com',
          name: 'Admin User',
          role: 'admin',
          entity_id: 'A001',
        };
      } else {
        throw new Error('Invalid credentials');
      }
      
      // Save mock auth data
      localStorage.setItem('access_token', 'mock_token_' + mockUser.role);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return;
    }
    
    // Real backend login
    try {
      const authResponse = await authService.login(email, password);
      authService.saveAuth(authResponse);
      setUser(authResponse.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

