'use client';

import { Button } from "@/components/ui/button"
import { Mail, Globe, ShoppingCart, Users, Plus, LinkIcon, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter();

  const handleNewInbox = async () => {
    try {
      // Create a Stripe checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: 1,
          customerEmail: 'user@example.com', // In a real app, get this from auth context
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
    }
  };

  const handleConnectDomain = () => {
    // For now, redirect to domains page
    router.push('/domains');
  };

  const handleInviteMember = () => {
    // For now, redirect to settings page
    router.push('/settings');
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
              onClick={handleConnectDomain}
              variant="outline" 
              className="h-9 bg-transparent hover:bg-accent"
            >
              <LinkIcon className="mr-2 h-4 w-4" /> Connect Domain
            </Button>
            <Button 
              onClick={handleInviteMember}
              variant="outline" 
              className="h-9 bg-transparent hover:bg-accent"
            >
              <UserPlus className="mr-2 h-4 w-4" /> Invite Member
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
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Active Domains</h3>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Orders</h3>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Active Clients</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mt-6 md:mt-8">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Welcome to Inbox Navigator</h2>
          <p className="text-muted-foreground mb-4">
            Your comprehensive email management platform. Get started by creating your first inbox or connecting a domain.
          </p>
          <div className="flex gap-2">
            <Button onClick={handleNewInbox}>
              <Plus className="mr-2 h-4 w-4" /> Create Inbox
            </Button>
            <Button onClick={handleConnectDomain} variant="outline">
              <LinkIcon className="mr-2 h-4 w-4" /> Connect Domain
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}