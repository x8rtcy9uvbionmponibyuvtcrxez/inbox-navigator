'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

interface Order {
  id: string
  orderNumber: string
  workspaceId: string
  status: string
  totalAmount: number
  quantity: number
  inboxCount: number
  domainCount: number
}

interface OnboardingContextType {
  order: Order | null
  loading: boolean
  error: string | null
  setOrder: (order: Order | null) => void
  submitOnboarding: (data: any) => Promise<{ success: boolean; error?: string }>
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Try to get order from URL params or localStorage
  useEffect(() => {
    const getOrderFromParams = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const sessionId = urlParams.get('session_id')
      const orderId = urlParams.get('order_id')
      
      if (sessionId || orderId) {
        // Store in localStorage for persistence
        if (sessionId) localStorage.setItem('onboarding_session_id', sessionId)
        if (orderId) localStorage.setItem('onboarding_order_id', orderId)
        
        // Fetch order details
        fetchOrderDetails(sessionId, orderId)
      } else {
        // Try to get from localStorage
        const storedSessionId = localStorage.getItem('onboarding_session_id')
        const storedOrderId = localStorage.getItem('onboarding_order_id')
        
        if (storedSessionId || storedOrderId) {
          fetchOrderDetails(storedSessionId, storedOrderId)
        }
      }
    }

    getOrderFromParams()
  }, [])

  const fetchOrderDetails = async (sessionId: string | null, orderId: string | null) => {
    if (!sessionId && !orderId) return

    setLoading(true)
    setError(null)

    try {
      // Try to fetch order by session ID first, then by order ID
      let response
      if (sessionId) {
        response = await fetch(`/api/orders/by-session/${sessionId}`)
      } else if (orderId) {
        response = await fetch(`/api/orders/${orderId}`)
      }

      if (!response?.ok) {
        // If order doesn't exist and we have a session ID, create a test order
        if (sessionId && user) {
          console.log('Order not found, creating test order for onboarding...')
          const createResponse = await fetch('/api/test/create-onboarding-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId,
              customerEmail: user.email,
              customerName: user.name,
              quantity: 2
            })
          })

          if (createResponse.ok) {
            const createData = await createResponse.json()
            setOrder(createData.order)
            return
          }
        }
        throw new Error('Failed to fetch order details')
      }

      const orderData = await response.json()
      setOrder(orderData)
    } catch (err) {
      console.error('Error fetching order:', err)
      setError(err instanceof Error ? err.message : 'Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  const submitOnboarding = async (formData: any) => {
    if (!order) {
      return { success: false, error: 'No order found. Please ensure you accessed this page from a valid order.' }
    }

    setLoading(true)
    setError(null)

    try {
      // Transform form data to match API expectations
      const transformedData = transformFormData(formData, order)
      
      const response = await fetch('/api/onboarding/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save onboarding data')
      }

      const result = await response.json()
      
      // Clear stored session data on successful completion
      if (result.success) {
        localStorage.removeItem('onboarding_session_id')
        localStorage.removeItem('onboarding_order_id')
      }

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit onboarding data'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return (
    <OnboardingContext.Provider value={{ 
      order, 
      loading, 
      error, 
      setOrder, 
      submitOnboarding 
    }}>
      {children}
    </OnboardingContext.Provider>
  )
}

// Transform form data to match API expectations
function transformFormData(formData: any, order: Order) {
  const {
    businessProfile,
    domainSetup,
    espIntegration,
    personas,
    customTags
  } = formData

  return {
    sessionId: order.id, // Using order ID as session identifier
    stepCompleted: 4, // Assuming this is the final step
    isCompleted: true,
    businessType: businessProfile?.businessType || '',
    industry: businessProfile?.industry || '',
    companySize: businessProfile?.teamSize || '',
    website: businessProfile?.businessName || '',
    preferredDomains: domainSetup?.choice === 'byod' 
      ? (domainSetup.byodDomains || '').split('\n').filter((d: string) => d.trim())
      : [],
    domainRequirements: domainSetup?.notes || '',
    personas: personas || [],
    personaCount: personas ? personas.length : 0,
    espProvider: espIntegration?.platform || '',
    espCredentials: espIntegration ? {
      loginEmail: espIntegration.loginEmail || '',
      password: espIntegration.password || '',
      workspace: espIntegration.workspace || '',
      apiKey: espIntegration.apiKey || '',
      notes: espIntegration.notes || ''
    } : null,
    specialRequirements: customTags?.join(', ') || '',
    customTags: customTags || [],
  }
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}
