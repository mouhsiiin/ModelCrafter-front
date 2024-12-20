export interface User {
    id: string;
    email: string;
    username: string;
    is_active: boolean;
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