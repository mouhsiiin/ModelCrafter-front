import React, { createContext, useContext, useState } from 'react';
import { AuthState, User } from '@/lib/types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isGuest: false,
  });

  const login = async (email: string, password: string) => {
    try {

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // bypass the login process
      const user: User = {
        id: '1',
        name: 'John Doe',
        email: email,
      };
      setAuthState({ user, isAuthenticated: true, isGuest: false });
      
      // if (!response.ok) throw new Error('Login failed');
      
      // const user = await response.json();
      // setAuthState({ user, isAuthenticated: true, isGuest: false });
    } catch (error) {
      throw new Error('Login failed. Please try again.');
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      // TODO: Implement actual API call
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      
      if (!response.ok) throw new Error('Signup failed');
      
      const user = await response.json();
      setAuthState({ user, isAuthenticated: true, isGuest: false });
    } catch (error) {
      throw new Error('Signup failed. Please try again.');
    }
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false, isGuest: false });
  };

  const continueAsGuest = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isGuest: true,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, signup, logout, continueAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };