'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { log } from '@/lib/logger'

interface User {
  id: string
  email: string
  name?: string
  fullName?: string
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
  avatarUrl?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  isAdmin: boolean
  isSuperAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          log.error('Error getting session', error)
          setLoading(false)
          return
        }

        if (session?.user) {
          // Get user data from database
          const response = await fetch('/api/auth/user', {
            headers: {
              'Authorization': `Bearer ${session.access_token}`
            }
          })
          
          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
          } else {
            // Create user in database if doesn't exist
            const createResponse = await fetch('/api/auth/create-user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: session.user.id,
                email: session.user.email,
                fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0]
              })
            })
            
            if (createResponse.ok) {
              const newUser = await createResponse.json()
              setUser(newUser)
            }
          }
        }
      } catch (error) {
        log.error('Auth check failed', error as Error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const response = await fetch('/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        })
        
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        router.push('/auth/signin')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const signIn = async (email: string, password: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        log.error('Sign in failed', error)
        return { success: false, error: error.message }
      }

      if (data.user) {
        // User will be set by the auth state change listener
        return { success: true }
      }

      return { success: false, error: 'Sign in failed' }
    } catch (error) {
      log.error('Sign in error', error as Error)
      return { success: false, error: 'Failed to sign in' }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (error) {
        log.error('Sign up failed', error)
        return { success: false, error: error.message }
      }

      if (data.user) {
        return { success: true }
      }

      return { success: false, error: 'Sign up failed' }
    } catch (error) {
      log.error('Sign up error', error as Error)
      return { success: false, error: 'Failed to sign up' }
    }
  }

  const signOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      setUser(null)
      router.push('/auth/signin')
    } catch (error) {
      log.error('Sign out error', error as Error)
    }
  }

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'
  const isSuperAdmin = user?.role === 'SUPER_ADMIN'

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      isAdmin,
      isSuperAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}