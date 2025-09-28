'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import { OnboardingProvider } from '@/contexts/OnboardingContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <OnboardingProvider>
        {children}
      </OnboardingProvider>
    </AuthProvider>
  )
}
