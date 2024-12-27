'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  role: string | null; // e.g. 'admin', 'customer', or null
  login: (role: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  role: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // On mount, optionally read localStorage
    const authStatus = localStorage.getItem('authenticated') === 'true';
    const storedRole = localStorage.getItem('role');
    if (authStatus && storedRole) {
      setIsAuthenticated(true);
      setRole(storedRole);
    }
  }, []);

  // login function
  const login = (newRole: string) => {
    setIsAuthenticated(true);
    setRole(newRole);
    localStorage.setItem('authenticated', 'true');
    localStorage.setItem('role', newRole);
  };

  // logout function
  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem('authenticated');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
