"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import WorkspaceSetup from '@/components/auth/WorkspaceSetup';
import { Loader2 } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'workspace';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const { user, loading, currentWorkspace } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (currentWorkspace) {
        // User is authenticated and has a workspace, redirect to dashboard
        router.push('/');
      } else {
        // User is authenticated but no workspace, show workspace setup
        setMode('workspace');
      }
    }
  }, [user, loading, currentWorkspace, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (user && currentWorkspace) {
    // User is fully authenticated, redirect to dashboard
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {mode === 'login' && (
          <LoginForm onSwitchToSignup={() => setMode('signup')} />
        )}
        
        {mode === 'signup' && (
          <SignupForm onSwitchToLogin={() => setMode('login')} />
        )}
        
        {mode === 'workspace' && user && (
          <WorkspaceSetup />
        )}
      </div>
    </div>
  );
}
