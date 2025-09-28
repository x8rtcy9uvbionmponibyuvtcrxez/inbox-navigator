'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, User } from 'lucide-react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      let result
      if (isSignUp) {
        result = await signUp(email, password, name)
      } else {
        result = await signIn(email, password)
      }

      if (result.success) {
        router.push('/')
      } else {
        setError(result.error || 'Authentication failed')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignUp ? 'Get started with your inbox management dashboard' : 'Access your inbox management dashboard'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {isSignUp ? 'Welcome' : 'Welcome Back'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required={isSignUp}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  placeholder="Enter your password"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isSignUp ? <User className="w-4 h-4 mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
                {isLoading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign in with Email')}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-600">
              <p>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto"
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setError('')
                  }}
                >
                  {isSignUp ? 'Sign in here' : 'Sign up here'}
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-500">
          <p>
            By {isSignUp ? 'creating an account' : 'signing in'}, you agree to our{' '}
            <Button variant="link" className="p-0 h-auto text-xs">
              Terms of Service
            </Button>{' '}
            and{' '}
            <Button variant="link" className="p-0 h-auto text-xs">
              Privacy Policy
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}