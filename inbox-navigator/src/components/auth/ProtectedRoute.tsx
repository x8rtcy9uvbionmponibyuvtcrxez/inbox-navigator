"use client";

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireWorkspace?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireWorkspace = true 
}: ProtectedRouteProps) {
  const { user, loading, currentWorkspace } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // User not authenticated, redirect to auth
        router.push('/auth');
        return;
      }

      if (requireWorkspace && !currentWorkspace) {
        // User authenticated but no workspace, redirect to auth for workspace setup
        router.push('/auth');
        return;
      }
    }
  }, [user, loading, currentWorkspace, requireWorkspace, router]);

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

  if (!user) {
    return null; // Will redirect to auth
  }

  if (requireWorkspace && !currentWorkspace) {
    return null; // Will redirect to auth for workspace setup
  }

  return <>{children}</>;
}
