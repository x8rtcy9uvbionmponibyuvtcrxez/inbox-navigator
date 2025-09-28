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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Eye, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Users, 
  Mail,
  Globe,
  Filter,
  Search
} from 'lucide-react'
import { Input } from '@/components/ui/input'

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
  client: {
    name: string
    email: string
  }
  workspace: {
    name: string
  }
  onboardingData?: {
    businessType: string
    industry: string
    companySize: string
    stepCompleted: number
    isCompleted: boolean
    personas: any[]
  }
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        await fetchOrders() // Refresh the list
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesSearch
  })

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

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'PENDING').length,
    deliveredOrders: orders.filter(o => o.status === 'DELIVERED').length,
    totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={fetchOrders} variant="outline">
          Refresh
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
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.deliveredOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Inboxes</TableHead>
                <TableHead>Domains</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.client.name}</div>
                      <div className="text-sm text-muted-foreground">{order.client.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>${order.totalAmount}</TableCell>
                  <TableCell>{order.inboxCount}</TableCell>
                  <TableCell>{order.domainCount}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {order.status === 'PENDING' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Fulfill
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)}
          onUpdate={updateOrderStatus}
        />
      )}
    </div>
  )
}

function OrderDetailModal({ order, onClose, onUpdate }: { 
  order: Order, 
  onClose: () => void, 
  onUpdate: (id: string, status: string) => void 
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Order Details - {order.orderNumber}</CardTitle>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Order Information</h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Order ID:</span> {order.id}</div>
                <div><span className="font-medium">Status:</span> {order.status}</div>
                <div><span className="font-medium">Amount:</span> ${order.totalAmount}</div>
                <div><span className="font-medium">Quantity:</span> {order.quantity}</div>
                <div><span className="font-medium">Created:</span> {new Date(order.createdAt).toLocaleString()}</div>
                {order.fulfilledDate && (
                  <div><span className="font-medium">Fulfilled:</span> {new Date(order.fulfilledDate).toLocaleString()}</div>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Customer Information</h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Name:</span> {order.client.name}</div>
                <div><span className="font-medium">Email:</span> {order.client.email}</div>
                <div><span className="font-medium">Workspace:</span> {order.workspace.name}</div>
              </div>
            </div>
          </div>

          {/* Onboarding Data */}
          {order.onboardingData && (
            <div>
              <h3 className="font-semibold mb-2">Onboarding Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div><span className="font-medium">Business Type:</span> {order.onboardingData.businessType}</div>
                  <div><span className="font-medium">Industry:</span> {order.onboardingData.industry}</div>
                  <div><span className="font-medium">Company Size:</span> {order.onboardingData.companySize}</div>
                </div>
                <div>
                  <div><span className="font-medium">Step Completed:</span> {order.onboardingData.stepCompleted}</div>
                  <div><span className="font-medium">Is Completed:</span> {order.onboardingData.isCompleted ? 'Yes' : 'No'}</div>
                  <div><span className="font-medium">Personas:</span> {order.onboardingData.personas?.length || 0}</div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {order.status === 'PENDING' && (
              <Button onClick={() => onUpdate(order.id, 'DELIVERED')}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Fulfilled
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
