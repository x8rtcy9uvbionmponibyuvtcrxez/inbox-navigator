'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  createWorkspace: (name: string, description?: string) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    
    const getUser = async () => {
      try {
        console.log('Getting user...')
        const { data: { user }, error } = await supabase.auth.getUser()
        console.log('User result:', { user, error })
        setUser(user)
        setLoading(false)
      } catch (error) {
        console.error('Error getting user:', error)
        setLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', { event, session })
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  // For now, always show loading as false to allow UI to render
  // TODO: Fix the authentication loading logic
  const isLoading = false;

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const createWorkspace = async (name: string, description?: string) => {
    try {
      console.log('Creating workspace:', { name, description })
      const response = await fetch('/api/workspaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Workspace creation failed:', errorData)
        return { error: new Error(errorData.error || 'Failed to create workspace') }
      }

      const workspace = await response.json()
      console.log('Workspace created successfully:', workspace)
      
      // Redirect to dashboard after successful workspace creation
      window.location.href = '/dashboard'
      
      return { error: null }
    } catch (error) {
      console.error('Error creating workspace:', error)
      return { error: new Error('Network error occurred') }
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading: isLoading, signUp, signIn, signOut, createWorkspace }}>
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