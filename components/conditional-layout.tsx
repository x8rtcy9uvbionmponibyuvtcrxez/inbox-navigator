'use client'

import { usePathname } from 'next/navigation'
import { TopNav } from '@/components/top-nav'
import { SidebarNav } from '@/components/sidebar-nav'
import { Providers } from '@/components/providers'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Routes that should show navigation (authenticated routes)
  const authenticatedRoutes = [
    '/',
    '/dashboard',
    '/dashboard/billing',
    '/dashboard/domains', 
    '/dashboard/inboxes',
    '/billing',
    '/domains',
    '/inboxes',
    '/settings',
    '/admin',
    '/admin/dashboard',
    '/admin/orders',
    '/customer',
    '/customer/dashboard',
    '/onboarding',
    '/onboarding/success'
  ]
  
  // Routes that should NOT show navigation (auth pages)
  const authRoutes = [
    '/auth',
    '/auth/signin',
    '/auth/signup'
  ]
  
  const shouldShowNavigation = authenticatedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  const isAuthRoute = authRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  return (
    <Providers>
      <div className="min-h-dvh bg-background text-foreground">
        {shouldShowNavigation && <TopNav />}
        <div className={shouldShowNavigation ? "mx-auto max-w-[1400px] px-4 md:px-6" : ""}>
          <div className={shouldShowNavigation ? "flex gap-6 py-6" : ""}>
            {shouldShowNavigation && <SidebarNav />}
            <main className={shouldShowNavigation ? "flex-1 min-w-0" : ""}>
              {children}
            </main>
          </div>
        </div>
      </div>
    </Providers>
  )
}
