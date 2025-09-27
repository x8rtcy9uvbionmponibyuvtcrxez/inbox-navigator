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
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Check,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpDown,
  ShoppingCart,
  User,
  Calendar
} from "lucide-react";

export default function InboxesPage() {
  const [activeTab, setActiveTab] = useState("inboxes");
  const { user, signOut } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [espFilter, setEspFilter] = useState("all");
  const [selectedInboxes, setSelectedInboxes] = useState<string[]>([]);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    inboxCount: "",
    domain: "",
    esp: "",
    personas: ""
  });

  const navigation = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "domains", label: "Domains", icon: Globe },
    { id: "inboxes", label: "Inboxes", icon: Mail },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  const inboxes = [
    {
      id: "inb_7f8a9b2c1d3e4f5g",
      email: "alex.johnson@techflow-solutions.com",
      status: "Active",
      esp: "Gmail",
      domain_name: "techflow-solutions.com",
      persona: "Alex Johnson - CEO",
      subscription_id: "sub_8a9b2c3d4e5f6g7h",
      created_at: "2024-01-15"
    },
    {
      id: "inb_9e8d7c6b5a4f3g2h",
      email: "support@innovate-digital.co",
      status: "Pending",
      esp: "Outlook",
      domain_name: "innovate-digital.co",
      persona: "Support Team Lead",
      subscription_id: "sub_2b3c4d5e6f7g8h9i",
      created_at: "2024-01-12"
    },
    {
      id: "inb_1a2b3c4d5e6f7g8h",
      email: "sales@cloudscale-ventures.net",
      status: "Suspended",
      esp: "Yahoo",
      domain_name: "cloudscale-ventures.net",
      persona: "Sarah Mitchell - Sales Director",
      subscription_id: "sub_5c6d7e8f9g0h1i2j",
      created_at: "2024-01-10"
    },
    {
      id: "inb_3f4g5h6i7j8k9l0m",
      email: "marketing@nexus-marketing.io",
      status: "Active",
      esp: "Gmail",
      domain_name: "nexus-marketing.io",
      persona: "Marketing Manager",
      subscription_id: "sub_8a9b2c3d4e5f6g7h",
      created_at: "2024-01-08"
    },
    {
      id: "inb_6h7i8j9k0l1m2n3o",
      email: "founder@velocity-startups.com",
      status: "Active",
      esp: "Outlook",
      domain_name: "velocity-startups.com",
      persona: "David Chen - Founder",
      subscription_id: "sub_2b3c4d5e6f7g8h9i",
      created_at: "2024-01-05"
    },
    {
      id: "inb_9k0l1m2n3o4p5q6r",
      email: "analytics@data-driven-insights.org",
      status: "Active",
      esp: "Gmail",
      domain_name: "data-driven-insights.org",
      persona: "Data Analyst",
      subscription_id: "sub_5c6d7e8f9g0h1i2j",
      created_at: "2024-01-03"
    },
    {
      id: "inb_2m3n4o5p6q7r8s9t",
      email: "growth@growth-hackers.co",
      status: "Expired",
      esp: "Apple Mail",
      domain_name: "growth-hackers.co",
      persona: "Growth Hacker",
      subscription_id: "sub_8a9b2c3d4e5f6g7h",
      created_at: "2023-12-28"
    },
    {
      id: "inb_5o6p7q8r9s0t1u2v",
      email: "enterprise@enterprise-saas.io",
      status: "Active",
      esp: "Custom SMTP",
      domain_name: "enterprise-saas.io",
      persona: "Enterprise Sales",
      subscription_id: "sub_2b3c4d5e6f7g8h9i",
      created_at: "2023-12-20"
    },
    {
      id: "inb_8r9s0t1u2v3w4x5y",
      email: "partnerships@techflow-solutions.com",
      status: "Active",
      esp: "Gmail",
      domain_name: "techflow-solutions.com",
      persona: "Partnership Manager",
      subscription_id: "sub_8a9b2c3d4e5f6g7h",
      created_at: "2024-01-18"
    },
    {
      id: "inb_1t2u3v4w5x6y7z8a",
      email: "hr@innovate-digital.co",
      status: "Active",
      esp: "Outlook",
      domain_name: "innovate-digital.co",
      persona: "HR Director",
      subscription_id: "sub_2b3c4d5e6f7g8h9i",
      created_at: "2024-01-16"
    },
    {
      id: "inb_4v5w6x7y8z9a0b1c",
      email: "finance@cloudscale-ventures.net",
      status: "Pending",
      esp: "Gmail",
      domain_name: "cloudscale-ventures.net",
      persona: "CFO",
      subscription_id: "sub_5c6d7e8f9g0h1i2j",
      created_at: "2024-01-14"
    },
    {
      id: "inb_7x8y9z0a1b2c3d4e",
      email: "product@nexus-marketing.io",
      status: "Active",
      esp: "Gmail",
      domain_name: "nexus-marketing.io",
      persona: "Product Manager",
      subscription_id: "sub_8a9b2c3d4e5f6g7h",
      created_at: "2024-01-12"
    }
  ];

  const esps = ["Gmail", "Outlook", "Yahoo", "Apple Mail", "Custom SMTP"];
  const statuses = ["Active", "Pending", "Suspended", "Expired"];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "suspended":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "expired":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "suspended":
        return <AlertCircle className="w-4 h-4" />;
      case "expired":
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getEspColor = (esp: string) => {
    switch (esp.toLowerCase()) {
      case "gmail":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "outlook":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "yahoo":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "apple mail":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      default:
        return "bg-green-500/10 text-green-400 border-green-500/20";
    }
  };

  const filteredInboxes = inboxes.filter(inbox => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === "" || 
                         inbox.email.toLowerCase().includes(searchLower) ||
                         inbox.persona.toLowerCase().includes(searchLower) ||
                         inbox.domain_name.toLowerCase().includes(searchLower) ||
                         inbox.subscription_id.toLowerCase().includes(searchLower);
    
    const matchesStatus = statusFilter === "all" || inbox.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesEsp = espFilter === "all" || inbox.esp.toLowerCase() === espFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesEsp;
  });

  const handleSelectAll = () => {
    if (selectedInboxes.length === filteredInboxes.length) {
      setSelectedInboxes([]);
    } else {
      setSelectedInboxes(filteredInboxes.map(inbox => inbox.id));
    }
  };

  const handleSelectInbox = (inboxId: string) => {
    setSelectedInboxes(prev => 
      prev.includes(inboxId) 
        ? prev.filter(id => id !== inboxId)
        : [...prev, inboxId]
    );
  };

  const handleBulkEdit = () => {
    if (selectedInboxes.length === 0) return;
    alert(`Bulk editing ${selectedInboxes.length} inboxes`);
  };

  const handleBulkSuspend = () => {
    if (selectedInboxes.length === 0) return;
    if (confirm(`Are you sure you want to suspend ${selectedInboxes.length} inboxes?`)) {
      setSelectedInboxes([]);
      alert(`${selectedInboxes.length} inboxes suspended`);
    }
  };

  const handleBulkDelete = () => {
    if (selectedInboxes.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedInboxes.length} inboxes?`)) {
      setSelectedInboxes([]);
      alert(`${selectedInboxes.length} inboxes deleted`);
    }
  };

  const handlePlaceOrder = () => {
    if (!newOrder.inboxCount || !newOrder.domain || !newOrder.esp) {
      alert("Please fill in all required fields");
      return;
    }
    
    // In a real app, this would make an API call
    alert(`Order placed for ${newOrder.inboxCount} inboxes on ${newOrder.domain}`);
    setNewOrder({ inboxCount: "", domain: "", esp: "", personas: "" });
    setShowNewOrderModal(false);
  };

  const handleEditInbox = (inboxId: string) => {
    const inbox = inboxes.find(i => i.id === inboxId);
    if (inbox) {
      alert(`Editing inbox: ${inbox.email}`);
    }
  };

  const handleDeleteInbox = (inboxId: string) => {
    const inbox = inboxes.find(i => i.id === inboxId);
    if (inbox && confirm(`Are you sure you want to delete ${inbox.email}?`)) {
      alert(`Inbox ${inbox.email} deleted`);
    }
  };

  const handleViewInbox = (inboxId: string) => {
    const inbox = inboxes.find(i => i.id === inboxId);
    if (inbox) {
      alert(`Viewing inbox details: ${inbox.email}`);
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
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Inboxes Management</h2>
                <p className="text-muted-foreground mt-1">Manage your email inboxes and personas</p>
              </div>
              <button 
                onClick={() => setShowNewOrderModal(true)}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>New Order</span>
              </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search emails, personas, domains, or subscription IDs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none bg-input border border-border rounded-lg px-4 py-2 pr-8 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Statuses</option>
                    {statuses.map(status => (
                      <option key={status} value={status.toLowerCase()}>{status}</option>
                    ))}
                  </select>
                  <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
                </div>

                {/* ESP Filter */}
                <div className="relative">
                  <select
                    value={espFilter}
                    onChange={(e) => setEspFilter(e.target.value)}
                    className="appearance-none bg-input border border-border rounded-lg px-4 py-2 pr-8 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All ESPs</option>
                    {esps.map(esp => (
                      <option key={esp} value={esp.toLowerCase()}>{esp}</option>
                    ))}
                  </select>
                  <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedInboxes.length > 0 && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-primary font-medium">
                    {selectedInboxes.length} inbox{selectedInboxes.length > 1 ? 'es' : ''} selected
                  </span>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={handleBulkEdit}
                      className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors"
                    >
                      Bulk Edit
                    </button>
                    <button 
                      onClick={handleBulkSuspend}
                      className="px-3 py-1 bg-destructive text-destructive-foreground rounded text-sm hover:bg-destructive/90 transition-colors"
                    >
                      Suspend Selected
                    </button>
                    <button 
                      onClick={handleBulkDelete}
                      className="px-3 py-1 bg-destructive text-destructive-foreground rounded text-sm hover:bg-destructive/90 transition-colors"
                    >
                      Delete Selected
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Inboxes Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left py-4 px-6">
                        <button
                          onClick={handleSelectAll}
                          className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <div className={`w-4 h-4 border border-border rounded flex items-center justify-center ${
                            selectedInboxes.length === filteredInboxes.length && filteredInboxes.length > 0
                              ? 'bg-primary border-primary text-primary-foreground'
                              : 'bg-background'
                          }`}>
                            {selectedInboxes.length === filteredInboxes.length && filteredInboxes.length > 0 && (
                              <Check className="w-3 h-3" />
                            )}
                          </div>
                          <span>Select All</span>
                        </button>
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Inbox ID</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Email</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">ESP</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Domain</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Persona</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Subscription ID</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Created At</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInboxes.map((inbox) => (
                      <tr key={inbox.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-6">
                          <button
                            onClick={() => handleSelectInbox(inbox.id)}
                            className={`w-4 h-4 border border-border rounded flex items-center justify-center ${
                              selectedInboxes.includes(inbox.id)
                                ? 'bg-primary border-primary text-primary-foreground'
                                : 'bg-background hover:border-primary/50'
                            }`}
                          >
                            {selectedInboxes.includes(inbox.id) && (
                              <Check className="w-3 h-3" />
                            )}
                          </button>
                        </td>
                        <td className="py-4 px-6 text-sm text-foreground font-mono">{inbox.id}</td>
                        <td className="py-4 px-6 text-sm text-foreground font-medium">{inbox.email}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(inbox.status)}`}>
                            {getStatusIcon(inbox.status)}
                            <span>{inbox.status}</span>
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getEspColor(inbox.esp)}`}>
                            {inbox.esp}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-foreground">{inbox.domain_name}</td>
                        <td className="py-4 px-6 text-sm text-foreground flex items-center space-x-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span>{inbox.persona}</span>
                        </td>
                        <td className="py-4 px-6 text-sm text-foreground font-mono">{inbox.subscription_id}</td>
                        <td className="py-4 px-6 text-sm text-foreground flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{inbox.created_at}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleEditInbox(inbox.id)}
                              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                              title="Edit Inbox"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleViewInbox(inbox.id)}
                              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                              title="View Inbox"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteInbox(inbox.id)}
                              className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                              title="Delete Inbox"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredInboxes.length === 0 && (
                <div className="text-center py-12">
                  <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No inboxes found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || statusFilter !== "all" || espFilter !== "all"
                      ? "Try adjusting your search or filters"
                      : "Get started by placing your first order"
                    }
                  </p>
                  {(!searchTerm && statusFilter === "all" && espFilter === "all") && (
                    <button 
                      onClick={() => setShowNewOrderModal(true)}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      New Order
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Results Summary */}
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredInboxes.length} of {inboxes.length} inboxes
            </div>
          </div>
        </main>
      </div>

      {/* New Order Modal */}
      {showNewOrderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Place New Order</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Number of Inboxes</label>
                <input
                  type="number"
                  placeholder="5"
                  min="1"
                  value={newOrder.inboxCount}
                  onChange={(e) => setNewOrder(prev => ({ ...prev, inboxCount: e.target.value }))}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Domain</label>
                <select 
                  value={newOrder.domain}
                  onChange={(e) => setNewOrder(prev => ({ ...prev, domain: e.target.value }))}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select a domain</option>
                  <option value="techflow-solutions.com">techflow-solutions.com</option>
                  <option value="innovate-digital.co">innovate-digital.co</option>
                  <option value="cloudscale-ventures.net">cloudscale-ventures.net</option>
                  <option value="nexus-marketing.io">nexus-marketing.io</option>
                  <option value="velocity-startups.com">velocity-startups.com</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">ESP Preference</label>
                <select 
                  value={newOrder.esp}
                  onChange={(e) => setNewOrder(prev => ({ ...prev, esp: e.target.value }))}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select ESP</option>
                  {esps.map(esp => (
                    <option key={esp} value={esp}>{esp}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Persona Names (comma-separated)</label>
                <textarea
                  placeholder="Alex Johnson, Support Team, Sales Rep"
                  value={newOrder.personas}
                  onChange={(e) => setNewOrder(prev => ({ ...prev, personas: e.target.value }))}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewOrderModal(false)}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handlePlaceOrder}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </ProtectedRoute>
  );
}
