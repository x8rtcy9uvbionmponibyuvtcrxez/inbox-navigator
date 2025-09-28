'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Mail,
  Globe,
  Users,
  Settings,
  ExternalLink,
  Eye
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface Order {
  id: string
  orderNumber: string
  status: string
  totalAmount: number
  quantity: number
  inboxCount: number
  domainCount: number
  createdAt: string
  fulfilledDate?: string
  productsBought: string[]
  typesOfInboxes: string[]
}

interface Inbox {
  id: string
  email: string
  password: string
  status: string
  domain: {
    name: string
  }
  personas: Array<{
    firstName: string
    lastName: string
    role: string
  }>
}

export default function CustomerDashboard() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [inboxes, setInboxes] = useState<Inbox[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('orders')

  useEffect(() => {
    if (user) {
      fetchCustomerData()
    }
  }, [user])

  const fetchCustomerData = async () => {
    try {
      // Fetch orders
      const ordersResponse = await fetch('/api/customer/orders')
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        setOrders(ordersData)
      }

      // Fetch inboxes
      const inboxesResponse = await fetch('/api/customer/inboxes')
      if (inboxesResponse.ok) {
        const inboxesData = await inboxesResponse.json()
        setInboxes(inboxesData)
      }
    } catch (error) {
      console.error('Error fetching customer data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      DELIVERED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      CANCELLED: { color: 'bg-red-100 text-red-800', icon: Clock },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    const Icon = config.icon
    
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    )
  }

  const openStripeCustomerPortal = async () => {
    try {
      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (response.ok) {
        const { url } = await response.json()
        window.open(url, '_blank')
      }
    } catch (error) {
      console.error('Error opening customer portal:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  const deliveredOrders = orders.filter(o => o.status === 'DELIVERED')
  const totalInboxes = deliveredOrders.reduce((sum, o) => sum + o.inboxCount, 0)
  const totalDomains = deliveredOrders.reduce((sum, o) => sum + o.domainCount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.email}</p>
        </div>
        <Button onClick={openStripeCustomerPortal} variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Manage Subscription
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveredOrders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Inboxes</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInboxes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Domains</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDomains}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'orders' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('orders')}
          className="px-4"
        >
          Orders
        </Button>
        <Button
          variant={activeTab === 'inboxes' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('inboxes')}
          className="px-4"
        >
          Inboxes
        </Button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <Card>
          <CardHeader>
            <CardTitle>Your Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No orders found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Inboxes</TableHead>
                    <TableHead>Domains</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>${order.totalAmount}</TableCell>
                      <TableCell>{order.inboxCount}</TableCell>
                      <TableCell>{order.domainCount}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Inboxes Tab */}
      {activeTab === 'inboxes' && (
        <Card>
          <CardHeader>
            <CardTitle>Your Inboxes</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage your email inboxes and personas
            </p>
          </CardHeader>
          <CardContent>
            {inboxes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No inboxes available yet. Complete your orders to see inboxes here.
              </div>
            ) : (
              <div className="space-y-4">
                {inboxes.map((inbox) => (
                  <Card key={inbox.id} className="border">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{inbox.email}</h3>
                          <p className="text-sm text-muted-foreground">
                            {inbox.domain.name}
                          </p>
                        </div>
                        <Badge variant={inbox.status === 'ACTIVE' ? 'default' : 'secondary'}>
                          {inbox.status}
                        </Badge>
                      </div>
                      
                      {inbox.personas.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Personas:</h4>
                          <div className="flex flex-wrap gap-2">
                            {inbox.personas.map((persona, index) => (
                              <Badge key={index} variant="outline">
                                {persona.firstName} {persona.lastName}
                                {persona.role && ` (${persona.role})`}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm">
                          <Mail className="w-4 h-4 mr-1" />
                          Access Inbox
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-1" />
                          Settings
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
