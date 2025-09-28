'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, ArrowRight, Mail, Globe, Users, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useOnboarding } from '@/contexts/OnboardingContext'

export default function OnboardingSuccessPage() {
  const router = useRouter()
  const { order } = useOnboarding()
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    // Get session_id from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const sessionId = urlParams.get('session_id')
    
    if (sessionId) {
      // Redirect to onboarding with the session ID
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            router.push(`/onboarding?session_id=${sessionId}`)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    } else {
      // Fallback to dashboard if no session ID
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            router.push('/dashboard')
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [router])

  const handleGoToOnboarding = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const sessionId = urlParams.get('session_id')
    
    if (sessionId) {
      router.push(`/onboarding?session_id=${sessionId}`)
    } else {
      router.push('/dashboard')
    }
  }

        return (
    <main className="mx-auto max-w-4xl p-6 md:p-10">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful! 🎉
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Your payment has been processed successfully.
        </p>
        <p className="text-gray-500">
          Now let's set up your workspace with your requirements.
        </p>
              </div>

      {order && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Order Number:</span>
                <p className="text-gray-600">{order.orderNumber}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Total Amount:</span>
                <p className="text-gray-600">${order.totalAmount}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Inboxes:</span>
                <p className="text-gray-600">{order.inboxCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="text-center">
          <CardContent className="pt-6">
            <Mail className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Email Setup</h3>
                  <p className="text-sm text-gray-600">
              We'll configure your email inboxes and personas
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <Globe className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Domain Setup</h3>
                  <p className="text-sm text-gray-600">
              Your domains will be configured and verified
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Persona Creation</h3>
                  <p className="text-sm text-gray-600">
              Email personas will be created as specified
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <Settings className="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">ESP Integration</h3>
                  <p className="text-sm text-gray-600">
              Your email service provider will be connected
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-3">What happens next?</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Our team will review your setup requirements</p>
            <p>• We'll configure your email infrastructure</p>
            <p>• You'll receive email notifications as we progress</p>
            <p>• Your workspace will be ready within 24-48 hours</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-8">
        <Button 
          onClick={handleGoToOnboarding}
          className="px-8 py-3 text-base"
        >
          Start Onboarding
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <p className="text-sm text-gray-500 mt-4">
          Redirecting to onboarding in {countdown} seconds...
        </p>
      </div>
    </main>
  )
}