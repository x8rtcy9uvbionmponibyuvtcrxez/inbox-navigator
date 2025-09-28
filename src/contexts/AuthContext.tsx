'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name?: string
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => void
  isAdmin: boolean
  isSuperAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        } catch (error) {
          localStorage.removeItem('user')
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      // For now, create a simple mock user
      // In a real app, this would call your API
      const mockUser: User = {
        id: '1',
        email: email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'ADMIN' : 'USER'
      }
      
      setUser(mockUser)
      localStorage.setItem('user', JSON.stringify(mockUser))
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to sign in' }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // For now, create a simple mock user
      // In a real app, this would call your API
      const mockUser: User = {
        id: '1',
        email: email,
        name: name,
        role: 'USER'
      }
      
      setUser(mockUser)
      localStorage.setItem('user', JSON.stringify(mockUser))
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to sign up' }
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('user')
    router.push('/auth/signin')
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