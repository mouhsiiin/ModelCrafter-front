import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';  // Recommended: use a proper JWT decoding library
import api from '@/services/api';  // Import the Axios instance
import { User, TokenResponse, AuthState } from '@/lib/types/auth';


interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  continueAsGuest: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isGuest: false,
  });

  useEffect(() => {
    // Check if there's a token in localStorage and validate it
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        // Use jwt-decode for safe token decoding
        const decodedUser = jwtDecode<User>(token);
        setAuthState({ 
          user: decodedUser, 
          isAuthenticated: true, 
          isGuest: false 
        });
      } catch (error) {
        // If token is invalid, remove it
        localStorage.removeItem('access_token');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const requestBody = new URLSearchParams({
        username: email,
        password: password
      });
  
      const response = await api.post<TokenResponse>('/token', requestBody, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'accept': 'application/json'
        }
      });
  
      const { access_token } = response.data;
      localStorage.setItem('access_token', access_token);
  
      // Safely decode the token
      const user = jwtDecode<User>(access_token);
      setAuthState({ user, isAuthenticated: true, isGuest: false });
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed. Please try again.');
    }
  };


  const signup = async (email: string, password: string, name: string) => {
    try {
      const requestBody = {
        email: email,
        password: password,
        username: name
      };

      const response = await api.post<TokenResponse>('/users/register', requestBody);

      const { access_token } = response.data;
      localStorage.setItem('access_token', access_token);

      // Safely decode the token
      const user = jwtDecode<User>(access_token);
      setAuthState({ user, isAuthenticated: true, isGuest: false });
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error('Signup failed. Please try again.');
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setAuthState({ user: null, isAuthenticated: false, isGuest: false });
  };

  const continueAsGuest = () => {
    setAuthState({ user: null, isAuthenticated: false, isGuest: true });
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