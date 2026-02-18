import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext } from './AuthContext'; // Import from File A
import { checkAuth as checkAuthAPI, logoutUser } from '../lib/api';
import type { User, AuthContextType } from '../types';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const data = await checkAuthAPI();
      setUser(data.user); 
    } catch (error: any) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Update this to match your backend response structure
  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error: any) {
      console.error('Logout failed:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}