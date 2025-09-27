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
  ChevronDown,
  Plus,
  Download,
  Eye,
  Settings,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  CreditCard as CardIcon,
  DollarSign,
  FileText,
  ExternalLink
} from "lucide-react";

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState("billing");
  const { user, signOut } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);

  const navigation = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "domains", label: "Domains", icon: Globe },
    { id: "inboxes", label: "Inboxes", icon: Mail },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  const subscriptions = [
    {
      id: "sub_8a9b2c3d4e5f6g7h",
      name: "Professional Plan",
      status: "Active",
      amount: "$149.00",
      interval: "monthly",
      next_billing: "2024-02-15",
      inboxes_included: 100,
      domains_included: 15,
      created_at: "2024-01-15"
    },
    {
      id: "sub_2b3c4d5e6f7g8h9i",
      name: "Starter Plan",
      status: "Active",
      amount: "$49.00",
      interval: "monthly",
      next_billing: "2024-02-10",
      inboxes_included: 25,
      domains_included: 5,
      created_at: "2024-01-10"
    },
    {
      id: "sub_5c6d7e8f9g0h1i2j",
      name: "Enterprise Plan",
      status: "Cancelled",
      amount: "$399.00",
      interval: "monthly",
      next_billing: "2024-01-20",
      inboxes_included: 500,
      domains_included: 100,
      created_at: "2023-12-01"
    }
  ];

  const invoices = [
    {
      id: "inv_7f8a9b2c1d3e4f5g",
      amount: "$149.00",
      status: "Paid",
      date: "2024-01-15",
      subscription_id: "sub_8a9b2c3d4e5f6g7h",
      download_url: "#"
    },
    {
      id: "inv_9e8d7c6b5a4f3g2h",
      amount: "$49.00",
      status: "Paid",
      date: "2024-01-10",
      subscription_id: "sub_2b3c4d5e6f7g8h9i",
      download_url: "#"
    },
    {
      id: "inv_1a2b3c4d5e6f7g8h",
      amount: "$149.00",
      status: "Pending",
      date: "2024-02-15",
      subscription_id: "sub_8a9b2c3d4e5f6g7h",
      download_url: "#"
    },
    {
      id: "inv_3f4g5h6i7j8k9l0m",
      amount: "$399.00",
      status: "Failed",
      date: "2024-01-20",
      subscription_id: "sub_5c6d7e8f9g0h1i2j",
      download_url: "#"
    },
    {
      id: "inv_6h7i8j9k0l1m2n3o",
      amount: "$49.00",
      status: "Paid",
      date: "2023-12-10",
      subscription_id: "sub_2b3c4d5e6f7g8h9i",
      download_url: "#"
    },
    {
      id: "inv_9k0l1m2n3o4p5q6r",
      amount: "$149.00",
      status: "Paid",
      date: "2023-12-15",
      subscription_id: "sub_8a9b2c3d4e5f6g7h",
      download_url: "#"
    },
    {
      id: "inv_2m3n4o5p6q7r8s9t",
      amount: "$399.00",
      status: "Paid",
      date: "2023-12-01",
      subscription_id: "sub_5c6d7e8f9g0h1i2j",
      download_url: "#"
    }
  ];

  const paymentMethods = [
    {
      id: "pm_7f8a9b2c1d3e4f5g",
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiry_month: "12",
      expiry_year: "2025",
      is_default: true
    },
    {
      id: "pm_9e8d7c6b5a4f3g2h",
      type: "card",
      last4: "5555",
      brand: "Mastercard",
      expiry_month: "08",
      expiry_year: "2026",
      is_default: false
    },
    {
      id: "pm_1a2b3c4d5e6f7g8h",
      type: "card",
      last4: "3782",
      brand: "American Express",
      expiry_month: "06",
      expiry_year: "2027",
      is_default: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "paid":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "cancelled":
      case "failed":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "paid":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "cancelled":
      case "failed":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getCardBrandColor = (brand: string) => {
    switch (brand.toLowerCase()) {
      case "visa":
        return "text-blue-600";
      case "mastercard":
        return "text-red-600";
      case "amex":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const handleManageSubscription = (subscriptionId: string) => {
    const subscription = subscriptions.find(s => s.id === subscriptionId);
    if (subscription) {
      alert(`Managing subscription: ${subscription.name}`);
    }
  };

  const handleCancelSubscription = (subscriptionId: string) => {
    const subscription = subscriptions.find(s => s.id === subscriptionId);
    if (subscription && confirm(`Are you sure you want to cancel ${subscription.name}?`)) {
      alert(`Subscription ${subscription.name} cancelled`);
    }
  };

  const handleViewInvoice = (invoiceId: string) => {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (invoice) {
      alert(`Viewing invoice: ${invoice.id} - ${invoice.amount}`);
    }
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (invoice) {
      alert(`Downloading invoice: ${invoice.id}`);
    }
  };

  const handleUpgradePlan = () => {
    setShowUpgradeModal(true);
  };

  const handleAddPaymentMethod = () => {
    setShowAddPaymentModal(true);
  };

  const handleManagePaymentMethod = (paymentMethodId: string) => {
    const paymentMethod = paymentMethods.find(pm => pm.id === paymentMethodId);
    if (paymentMethod) {
      alert(`Managing payment method: ${paymentMethod.brand} •••• ${paymentMethod.last4}`);
    }
  };

  const handleViewAllInvoices = () => {
    alert("Opening all invoices view");
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
            {/* Page Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">Billing & Subscriptions</h2>
              <p className="text-muted-foreground mt-1">Manage your subscriptions, invoices, and payment methods</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Subscriptions */}
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-foreground">Active Subscriptions</h3>
                    <button 
                      onClick={handleUpgradePlan}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Upgrade Plan</span>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {subscriptions.filter(sub => sub.status === "Active").map((subscription) => (
                      <div key={subscription.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground">{subscription.name}</h4>
                              <p className="text-sm text-muted-foreground">ID: {subscription.id}</p>
                            </div>
                          </div>
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(subscription.status)}`}>
                            {getStatusIcon(subscription.status)}
                            <span>{subscription.status}</span>
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Amount</p>
                            <p className="font-semibold text-foreground">{subscription.amount}/{subscription.interval}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Next Billing</p>
                            <p className="font-semibold text-foreground">{subscription.next_billing}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Inboxes</p>
                            <p className="font-semibold text-foreground">{subscription.inboxes_included}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Domains</p>
                            <p className="font-semibold text-foreground">{subscription.domains_included}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleManageSubscription(subscription.id)}
                            className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/80 transition-colors flex items-center space-x-1"
                          >
                            <Settings className="w-3 h-3" />
                            <span>Manage</span>
                          </button>
                          <button 
                            onClick={() => handleCancelSubscription(subscription.id)}
                            className="px-3 py-1 bg-destructive/10 text-destructive border border-destructive/20 rounded text-sm hover:bg-destructive/20 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Invoice History */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Invoice History</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Invoice ID</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Subscription</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map((invoice) => (
                          <tr key={invoice.id} className="border-b border-border/50">
                            <td className="py-3 px-4 text-sm text-foreground font-mono">{invoice.id}</td>
                            <td className="py-3 px-4 text-sm text-foreground font-semibold">{invoice.amount}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                                {getStatusIcon(invoice.status)}
                                <span>{invoice.status}</span>
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-foreground">{invoice.date}</td>
                            <td className="py-3 px-4 text-sm text-foreground font-mono">{invoice.subscription_id}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={() => handleViewInvoice(invoice.id)}
                                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                                  title="View Invoice"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDownloadInvoice(invoice.id)}
                                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                                  title="Download Invoice"
                                >
                                  <Download className="w-4 h-4" />
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

              {/* Payment Methods */}
              <div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-foreground">Payment Methods</h3>
                    <button 
                      onClick={handleAddPaymentMethod}
                      className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm hover:bg-primary/90 transition-colors flex items-center space-x-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="border border-border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <CardIcon className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className={`font-semibold ${getCardBrandColor(method.brand)}`}>
                                {method.brand} •••• {method.last4}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Expires {method.expiry_month}/{method.expiry_year}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {method.is_default && (
                              <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20">
                                Default
                              </span>
                            )}
                            <button 
                              onClick={() => handleManagePaymentMethod(method.id)}
                              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                              title="Manage Payment Method"
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Billing Summary */}
                <div className="bg-card border border-border rounded-xl p-6 mt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Billing Summary</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">This Month</span>
                      <span className="font-semibold text-foreground">$198.00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Next Billing</span>
                      <span className="font-semibold text-foreground">Feb 10, 2024</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Inboxes</span>
                      <span className="font-semibold text-foreground">125</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Domains</span>
                      <span className="font-semibold text-foreground">20</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border">
                    <button 
                      onClick={handleViewAllInvoices}
                      className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      View All Invoices
                    </button>
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
