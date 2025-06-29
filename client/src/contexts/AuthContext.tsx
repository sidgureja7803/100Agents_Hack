import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService, User } from '@/lib/appwrite';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: {
    withGoogle: () => Promise<void>;
    withGitHub: () => Promise<void>;
    withEmail: (email: string, password: string) => Promise<User>;
  };
  register: (email: string, password: string, name: string) => Promise<User>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.log('No active session');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    await AuthService.loginWithGoogle();
    // Note: OAuth redirects, so user state will be updated on return
  };

  const loginWithGitHub = async () => {
    await AuthService.loginWithGitHub();
    // Note: OAuth redirects, so user state will be updated on return
  };

  const loginWithEmail = async (email: string, password: string) => {
    const user = await AuthService.loginWithEmail(email, password);
    setUser(user);
    return user;
  };

  const register = async (email: string, password: string, name: string) => {
    const user = await AuthService.registerWithEmail(email, password, name);
    setUser(user);
    return user;
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login: {
      withGoogle: loginWithGoogle,
      withGitHub: loginWithGitHub,
      withEmail: loginWithEmail,
    },
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 