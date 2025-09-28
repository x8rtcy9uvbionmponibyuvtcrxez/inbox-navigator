"use client";

import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
}

interface AuthContextType {
  user: User | null;
  session: any | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  createWorkspace: (name: string, description?: string) => Promise<{ error: any; workspace?: any }>;
  currentWorkspace: any | null;
  setCurrentWorkspace: (workspace: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState<any | null>(null);

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      // Mock signup - in real app, this would call Supabase
      const mockUser = {
        id: `user_${Date.now()}`,
        email,
        user_metadata: { full_name: fullName },
      };
      
      setUser(mockUser);
      setSession({ user: mockUser });
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Mock signin - in real app, this would call Supabase
      const mockUser = {
        id: `user_${Date.now()}`,
        email,
        user_metadata: { full_name: 'Test User' },
      };
      
      setUser(mockUser);
      setSession({ user: mockUser });
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setCurrentWorkspace(null);
  };

  const createWorkspace = async (name: string, description?: string) => {
    try {
      // Mock workspace creation
      const workspace = {
        id: `workspace_${Date.now()}`,
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: description || null,
        ownerId: user?.id || 'mock_user_id',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: {
          id: user?.id || 'mock_user_id',
          email: user?.email || 'user@example.com',
          fullName: user?.user_metadata?.full_name || 'Mock User',
        },
        _count: {
          members: 1,
          clients: 0,
          domains: 0,
          inboxes: 0,
        },
      };
      
      setCurrentWorkspace(workspace);
      return { error: null, workspace };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    createWorkspace,
    currentWorkspace,
    setCurrentWorkspace,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}