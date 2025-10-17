import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthUser, setAuthUser as saveAuthUser, clearAuthUser, getUsers, simpleHash } from '@/lib/storage';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const username = getAuthUser();
    if (username) {
      const users = getUsers();
      const foundUser = users.find(u => u.username === username);
      if (foundUser) {
        setUser(foundUser);
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const users = getUsers();
    const foundUser = users.find(
      u => u.username === username && u.passwordHash === simpleHash(password)
    );

    if (foundUser) {
      setUser(foundUser);
      saveAuthUser(username);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    clearAuthUser();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
