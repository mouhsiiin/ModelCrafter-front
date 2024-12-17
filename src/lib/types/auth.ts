export interface User {
    id: string;
    email: string;
    name: string;
  }
  
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isGuest: boolean;
  }

  export interface TokenResponse {
    access_token: string;
    token_type: string;
  }