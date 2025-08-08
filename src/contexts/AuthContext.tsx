
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { signup as apiSignup, login as apiLogin } from '@/services/authApi';

interface User {
  id: string;
  email: string;
  provider?: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  totalUsers: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    // Check if user is already authenticated
    const checkUser = async () => {
      try {
        // When Supabase is connected, replace with actual authentication check
        const storedUser = localStorage.getItem('snappy_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        
        // Get total users count
        const storedUsers = localStorage.getItem('snappy_all_users');
        const allUsers = storedUsers ? JSON.parse(storedUsers) : [];
        setTotalUsers(allUsers.length);
      } catch (error) {
        console.error('Error checking auth state:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const updateTotalUsers = () => {
    // Get all users from storage
    const storedUsers = localStorage.getItem('snappy_all_users');
    const allUsers = storedUsers ? JSON.parse(storedUsers) : [];
    setTotalUsers(allUsers.length);
  };

  const addUserToStorage = (newUser: User) => {
    // Get all users from storage
    const storedUsers = localStorage.getItem('snappy_all_users');
    const allUsers = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Check if user already exists
    const userExists = allUsers.some((u: User) => u.id === newUser.id);
    
    if (!userExists) {
      allUsers.push(newUser);
      localStorage.setItem('snappy_all_users', JSON.stringify(allUsers));
    }
    
    updateTotalUsers();
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await apiSignup(email, password);
      localStorage.setItem('snappy_user', JSON.stringify(res.user));
      localStorage.setItem('snappy_jwt', res.token);
      setUser(res.user);
      toast.success('Account created successfully!');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to sign up');
        throw error;
      } else {
        toast.error('Failed to sign up');
        throw new Error('Failed to sign up');
      }
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await apiLogin(email, password);
      localStorage.setItem('snappy_user', JSON.stringify(res.user));
      localStorage.setItem('snappy_jwt', res.token);
      setUser(res.user);
      toast.success('Logged in successfully!');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to sign in');
        throw error;
      } else {
        toast.error('Failed to sign in');
        throw new Error('Failed to sign in');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      // Open backend Google OAuth endpoint in a popup
      const popup = window.open(
        `${import.meta.env.VITE_API_URL?.replace('/api/urls', '') || 'http://localhost:5000'}/api/auth/google`,
        'google-oauth',
        'width=500,height=600'
      );
      if (!popup) throw new Error('Failed to open Google sign-in window');

      // Listen for message from popup
      const userFromOAuth: Promise<any> = new Promise((resolve, reject) => {
        const timer = setInterval(() => {
          if (popup.closed) {
            clearInterval(timer);
            reject(new Error('Google sign-in was closed'));
          }
        }, 500);
        window.addEventListener('message', function handler(event) {
          if (event.origin !== window.location.origin) return;
          if (event.data && event.data.type === 'google-auth-success') {
            clearInterval(timer);
            window.removeEventListener('message', handler);
            popup.close();
            resolve(event.data.user);
          }
        });
      });
      const user = await userFromOAuth;
      if (!user || !user.email) throw new Error('Failed to get user info from Google');
      localStorage.setItem('snappy_user', JSON.stringify(user));
      setUser(user);
      addUserToStorage(user);
      toast.success('Logged in with Google successfully!');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to sign in with Google');
        throw error;
      } else {
        toast.error('Failed to sign in with Google');
        throw new Error('Failed to sign in with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      // Mock logout - replace with Supabase auth when connected
      localStorage.removeItem('snappy_user');
      setUser(null);
      toast.success('Logged out successfully!');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to sign out');
        throw error;
      } else {
        toast.error('Failed to sign out');
        throw new Error('Failed to sign out');
      }
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    setUser,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    totalUsers,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
