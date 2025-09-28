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
  const { user, loading } = useAuth();
  const router = useRouter();

  console.log('AuthPage state:', { user, loading });

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

  // Always show workspace setup for now
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <WorkspaceSetup />
      </div>
    </div>
  );
}
