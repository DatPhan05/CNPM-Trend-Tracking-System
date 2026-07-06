import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface UserPayload {
  id: number;
  email: string;
  userName?: string;
  identityUid?: string;
  schoolName?: string;
  role: string;
  fullName: string;
  iat: number;
  exp: number;
}

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: number;
    email: string;
    userName?: string;
    identityUid?: string;
    schoolName?: string;
    role: string;
    fullName: string;
  } | null;
  isLoading: boolean;
}

interface UserData {
  id: number;
  email: string;
  userName?: string;
  identityUid?: string;
  schoolName?: string;
  role: string;
  fullName: string;
}

interface AuthContextType extends AuthState {
  login: (accessToken: string, refreshToken: string, userData: UserData) => void;
  logout: () => void;
  updateUser: (userData: Partial<UserData> & { fullName: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  const checkAuth = () => {
    const token = localStorage.getItem('access_token');
    const userName = localStorage.getItem('user_name');
    const userRole = localStorage.getItem('user_role');

    if (token && userName && userRole) {
      try {
        const decoded = jwtDecode<UserPayload>(token);
        if (decoded.exp * 1000 > Date.now()) {
          setState({
            isAuthenticated: true,
            user: {
              id: decoded.id,
              email: decoded.email,
              role: userRole,
              fullName: userName,
            },
            isLoading: false,
          });
          return;
        }
      } catch (err) {
        console.error('Invalid token', err);
      }
    }
    
    // Clear if invalid or expired
    setState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_role');

    setState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkAuth();

    // Listen to unauthorized event from axios interceptor
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = (accessToken: string, refreshToken: string, userData: UserData) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user_name', userData.fullName);
    localStorage.setItem('user_role', userData.role.toUpperCase());

    setState({
      isAuthenticated: true,
      user: {
        id: userData.id,
        email: userData.email,
        userName: userData.userName,
        identityUid: userData.identityUid,
        schoolName: userData.schoolName,
        role: userData.role.toUpperCase(),
        fullName: userData.fullName,
      },
      isLoading: false,
    });
  };

  const updateUser = (userData: Partial<UserData> & { fullName: string }) => {
    if (state.user) {
      localStorage.setItem('user_name', userData.fullName);
      // userRole and tokens remain unchanged
      setState({
        ...state,
        user: {
          ...state.user,
          fullName: userData.fullName,
          email: userData.email || state.user.email,
        },
      });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
