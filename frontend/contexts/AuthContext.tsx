import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On initial load, check if there's an active session
    const checkLoggedInStatus = async () => {
      setIsLoading(true);
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Session check failed", error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkLoggedInStatus();
  }, []);

  const login = useCallback(async (email: string, pass: string) => {
    const user = await authService.login(email, pass);
    setCurrentUser(user);
  }, []);

  const signup = useCallback(async (email: string, pass: string) => {
    const user = await authService.signup(email, pass);
    setCurrentUser(user);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setCurrentUser(null);
  }, []);

  const value = {
    currentUser,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};