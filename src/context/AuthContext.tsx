import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginDTO, RegisterDTO } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginDTO) => Promise<void>;
  register: (data: RegisterDTO) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const savedUser = localStorage.getItem('user');

      console.log('🔍 checkAuth called:', { tokenExists: !!token, savedUser });

      if (token && savedUser) {
        setUser(JSON.parse(savedUser));

        try {
          const response = await authAPI.getCurrentUser();
          if (response.success && response.data) {
            console.log('✅ Token verified with backend');
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
          } else {
            console.warn('⚠️ Token verification failed, keeping local user');
          }
        } catch (err) {
          console.warn('⚠️ /me request failed, skipping clear:', err);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginDTO) => {
    try {
      console.log('🟢 Attempting login with', data);
      const response = await authAPI.login(data);
      console.log('🟢 Raw login response:', response);

      if (response.success && response.data) {
        const { user, tokens } = response.data;

        if (!tokens?.accessToken) {
          throw new Error('Missing access token from backend');
        }

        // ✅ Save to localStorage
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        // ✅ Update React state
        setUser(user);

        console.log('✅ Login success — data saved:', {
          accessToken: localStorage.getItem('accessToken'),
          user: JSON.parse(localStorage.getItem('user') || 'null'),
        });
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  };

  const register = async (data: RegisterDTO) => {
    try {
      const response = await authAPI.register(data);
      if (response.success && response.data) {
        const { user, tokens } = response.data;

        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        setUser(user);
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    authAPI.logout().catch(() => {});
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    console.log('🚪 User logged out and storage cleared');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
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
