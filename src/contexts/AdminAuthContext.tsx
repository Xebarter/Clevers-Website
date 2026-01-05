"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const ADMIN_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if admin is already authenticated and session hasn't expired
    const authStatus = localStorage.getItem('adminAuthenticated');
    const authTimestamp = localStorage.getItem('adminAuthTimestamp');
    
    if (authStatus === 'true' && authTimestamp) {
      const timeDiff = Date.now() - parseInt(authTimestamp, 10);
      if (timeDiff < ADMIN_TIMEOUT) {
        setIsAuthenticated(true);
      } else {
        // Session has expired, remove auth data
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminAuthTimestamp');
      }
    }
  }, []);

  const login = async (password: string): Promise<boolean> => {
    // In a real application, this would be an API call to verify credentials
    // For demo purposes, we'll use a simple check
    if (password === 'admin123') { // This should be replaced with proper authentication
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.setItem('adminAuthTimestamp', Date.now().toString());
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminAuthTimestamp');
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}