"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Globe, 
  Mail, 
  CreditCard, 
  Bell, 
  User, 
  ChevronDown,
  Plus,
  TrendingUp,
  TrendingDown,
  Eye,
  FileText,
  ExternalLink,
  ShoppingCart,
  Settings,
  MessageCircle,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, signOut } = useAuth();

  const navigation = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "domains", label: "Domains", icon: Globe },
    { id: "inboxes", label: "Inboxes", icon: Mail },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  const orders = [
    {
      id: "ord_7f8a9b2c1d3e4f5g",
      date: "2024-01-15",
      inboxCount: 12,
      domainCount: 3,
      status: "Active",
      subscriptionId: "sub_8a9b2c3d4e5f6g7h",
    },
    {
      id: "ord_9e8d7c6b5a4f3g2h", 
      date: "2024-01-10",
      inboxCount: 8,
      domainCount: 2,
      status: "Pending",
      subscriptionId: "sub_2b3c4d5e6f7g8h9i",
    },
    {
      id: "ord_1a2b3c4d5e6f7g8h",
      date: "2024-01-05",
      inboxCount: 15,
      domainCount: 4,
      status: "Completed",
      subscriptionId: "sub_5c6d7e8f9g0h1i2j",
    },
  ];

  const requests = [
    {
      id: 1,
      status: "Processing",
      type: "Domain Setup - techflow-solutions.com",
      submittedOn: "2024-01-15 14:30",
      assignedTo: "Support Team",
    },
    {
      id: 2,
      status: "Completed",
      type: "Inbox Creation - 12 inboxes",
      submittedOn: "2024-01-15 12:15",
      assignedTo: "Alex Johnson",
    },
    {
      id: 3,
      status: "Pending",
      type: "Billing Query - Enterprise Plan",
      submittedOn: "2024-01-15 10:45",
      assignedTo: "Billing Team",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "completed":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "processing":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "processing":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-foreground">Inbox Navigator</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Buy More Inboxes</span>
            </button>
            
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground">Hey,</span>
              <span className="font-medium text-foreground">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}</span>
              <button 
                onClick={signOut}
                className="p-1 hover:bg-muted rounded"
                title="Sign Out"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Active Domains</p>
                    <p className="text-3xl font-bold text-foreground">20</p>
                  </div>
                  <div className="flex items-center space-x-1 text-green-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">+2.5%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Active Mailboxes</p>
                    <p className="text-3xl font-bold text-foreground">125</p>
                  </div>
                  <div className="flex items-center space-x-1 text-green-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">+8.1%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Tracking Table */}
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Order Tracking</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Inbox Count</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Domain Count</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Subscription ID</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b border-border/50">
                            <td className="py-3 px-4 text-sm text-foreground">{order.date}</td>
                            <td className="py-3 px-4 text-sm text-foreground">{order.inboxCount}</td>
                            <td className="py-3 px-4 text-sm text-foreground">{order.domainCount}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span>{order.status}</span>
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-foreground font-mono">{order.id}</td>
                            <td className="py-3 px-4 text-sm text-foreground font-mono">{order.subscriptionId}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                                  <FileText className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center space-x-3 p-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                      <Plus className="w-5 h-5" />
                      <span>Order New Inboxes</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
                      <Globe className="w-5 h-5" />
                      <span>Buy Domains</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
                      <Settings className="w-5 h-5" />
                      <span>Manage Subscription</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span>Talk to Support</span>
                    </button>
                  </div>
                </div>

                {/* Live Requests Feed */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Live Requests</h3>
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <div key={request.id} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(request.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-foreground">{request.type}</p>
                            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                              <span>{request.status}</span>
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Submitted: {request.submittedOn}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Assigned to: {request.assignedTo}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
        </div>
      </main>
      </div>
    </div>
    </ProtectedRoute>
  );
}