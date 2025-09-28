'use client';

import { Button } from "@/components/ui/button"
import { Mail, Globe, ShoppingCart, Users, Plus, Minus, TestTube } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DashboardStats {
  totalInboxes: number;
  totalDomains: number;
  totalOrders: number;
  totalClients: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [showProductModal, setShowProductModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalInboxes: 0,
    totalDomains: 0,
    totalOrders: 0,
    totalClients: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [isCreatingDummy, setIsCreatingDummy] = useState(false);

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Create dummy order
  const createDummyOrder = async () => {
    if (!user) return;
    
    setIsCreatingDummy(true);
    try {
      const response = await fetch('/api/test/create-dummy-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerEmail: user.email,
          customerName: user.name,
          quantity: 2 // Create 2 inboxes for testing
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Success! Created ${data.message}`);
        // Refresh stats
        await fetchStats();
      } else {
        console.error('Failed to create dummy order:', data);
        alert('Failed to create dummy order. Please try again.');
      }
    } catch (error) {
      console.error('Error creating dummy order:', error);
      alert('Failed to create dummy order. Please try again.');
    } finally {
      setIsCreatingDummy(false);
    }
  };

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/signin');
    }
  }, [user, loading, router]);

  // Fetch stats when component mounts
  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Show loading while redirecting if not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const handleNewInbox = () => {
    setShowProductModal(true);
  };

  const handleProductSelection = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Create a Stripe checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: quantity,
          customerEmail: user.email,
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        console.error('Failed to create checkout session:', data);
        alert('Failed to start checkout. Please try again.');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <section className="mb-6 md:mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">Inbox Navigator</h1>
            <p className="text-pretty text-sm text-muted-foreground">Fast, focused, and ready to ship.</p>
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              onClick={handleNewInbox}
              className="h-9 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" /> New Inbox
            </Button>
            <Button 
              onClick={createDummyOrder}
              disabled={isCreatingDummy}
              variant="outline"
              className="h-9"
            >
              <TestTube className="mr-2 h-4 w-4" /> 
              {isCreatingDummy ? 'Creating...' : 'Create Test Data'}
            </Button>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Inboxes</h3>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : stats.totalInboxes}
            </div>
            <p className="text-xs text-muted-foreground">Real data from database</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Active Domains</h3>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : stats.totalDomains}
            </div>
            <p className="text-xs text-muted-foreground">Real data from database</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Orders</h3>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : stats.totalOrders}
            </div>
            <p className="text-xs text-muted-foreground">Real data from database</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Active Clients</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : stats.totalClients}
            </div>
            <p className="text-xs text-muted-foreground">Real data from database</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mt-6 md:mt-8">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Welcome to Inbox Navigator</h2>
          <p className="text-muted-foreground mb-4">
            Your comprehensive email management platform. The dashboard above shows real data from your database.
            Use the "Create Test Data" button to add sample inboxes, domains, and orders to see the data populate.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleNewInbox}>
              <Plus className="mr-2 h-4 w-4" /> Create Inbox (Stripe)
            </Button>
            <Button onClick={createDummyOrder} disabled={isCreatingDummy} variant="outline">
              <TestTube className="mr-2 h-4 w-4" /> 
              {isCreatingDummy ? 'Creating Test Data...' : 'Create Test Data (No Stripe)'}
            </Button>
          </div>
          {stats.totalInboxes > 0 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ Database is populated! You have {stats.totalInboxes} inbox(es), {stats.totalDomains} domain(s), 
                and {stats.totalOrders} order(s) in your database.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Product Selection Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Select Inbox Package</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Number of Inboxes</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="text-center"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Package Details</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Each inbox includes:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Professional email setup</li>
                  <li>• Domain configuration</li>
                  <li>• ESP integration (Smartlead, etc.)</li>
                  <li>• Warmup service</li>
                  <li>• 24/7 support</li>
                </ul>
                <div className="mt-3 pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Price:</span>
                    <span className="text-lg font-bold">${(quantity * 100).toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500">${100} per inbox</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleProductSelection}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}