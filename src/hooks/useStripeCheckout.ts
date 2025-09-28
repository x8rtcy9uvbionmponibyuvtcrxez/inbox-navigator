'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface CheckoutSession {
  sessionId: string;
  url: string;
}

export function useStripeCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const createCheckoutSession = async (
    quantity: number,
    workspaceId?: string,
    workspaceName?: string
  ): Promise<CheckoutSession | null> => {
    if (!user?.email) {
      throw new Error('User email is required for checkout');
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity,
          customerEmail: user.email,
          workspaceId: workspaceId || 'demo_workspace_123',
          workspaceName: workspaceName || 'My Workspace',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToCheckout = async (
    quantity: number,
    workspaceId?: string,
    workspaceName?: string
  ) => {
    try {
      const session = await createCheckoutSession(quantity, workspaceId, workspaceName);
      
      if (session?.url) {
        window.location.href = session.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      throw error;
    }
  };

  return {
    createCheckoutSession,
    redirectToCheckout,
    isLoading,
  };
}
