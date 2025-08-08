
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
      // Mock Google sign in - replace with Supabase auth when connected
      // Always use the same email for demo; in real app, use Google profile email
      const email = 'demo-google-user@gmail.com';
      const googleUser = { 
        id: email, // Use email as unique ID for Google users
        email,
        provider: 'google'
      };
      localStorage.setItem('snappy_user', JSON.stringify(googleUser));
      setUser(googleUser);
      // Add to all users list
      addUserToStorage(googleUser);
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
