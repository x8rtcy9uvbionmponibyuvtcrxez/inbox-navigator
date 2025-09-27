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
  ArrowUpDown
} from "lucide-react";

export default function DomainsPage() {
  const [activeTab, setActiveTab] = useState("domains");
  const { user, signOut } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDomain, setNewDomain] = useState({
    name: "",
    redirect_url: "",
    client_id: ""
  });

  const navigation = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "domains", label: "Domains", icon: Globe },
    { id: "inboxes", label: "Inboxes", icon: Mail },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  const domains = [
    {
      id: "dom_7f8a9b2c1d3e4f5g",
      name: "techflow-solutions.com",
      redirect_url: "https://techflow-solutions.com/lead-capture",
      status: "Active",
      client_id: "client_8a9b2c3d4e5f6g7h",
      linked_inboxes: 12,
      date_of_purchase: "2024-01-15"
    },
    {
      id: "dom_9e8d7c6b5a4f3g2h",
      name: "innovate-digital.co",
      redirect_url: "https://innovate-digital.co/contact-form",
      status: "Pending",
      client_id: "client_2b3c4d5e6f7g8h9i",
      linked_inboxes: 0,
      date_of_purchase: "2024-01-12"
    },
    {
      id: "dom_1a2b3c4d5e6f7g8h",
      name: "cloudscale-ventures.net",
      redirect_url: "https://cloudscale-ventures.net/newsletter-signup",
      status: "Suspended",
      client_id: "client_5c6d7e8f9g0h1i2j",
      linked_inboxes: 0,
      date_of_purchase: "2024-01-10"
    },
    {
      id: "dom_3f4g5h6i7j8k9l0m",
      name: "nexus-marketing.io",
      redirect_url: "https://nexus-marketing.io/landing-page",
      status: "Active",
      client_id: "client_8a9b2c3d4e5f6g7h",
      linked_inboxes: 18,
      date_of_purchase: "2024-01-08"
    },
    {
      id: "dom_6h7i8j9k0l1m2n3o",
      name: "velocity-startups.com",
      redirect_url: "https://velocity-startups.com/early-access",
      status: "Active",
      client_id: "client_2b3c4d5e6f7g8h9i",
      linked_inboxes: 7,
      date_of_purchase: "2024-01-05"
    },
    {
      id: "dom_9k0l1m2n3o4p5q6r",
      name: "data-driven-insights.org",
      redirect_url: "https://data-driven-insights.org/whitepaper-download",
      status: "Active",
      client_id: "client_5c6d7e8f9g0h1i2j",
      linked_inboxes: 15,
      date_of_purchase: "2024-01-03"
    },
    {
      id: "dom_2m3n4o5p6q7r8s9t",
      name: "growth-hackers.co",
      redirect_url: "https://growth-hackers.co/free-trial",
      status: "Expired",
      client_id: "client_8a9b2c3d4e5f6g7h",
      linked_inboxes: 0,
      date_of_purchase: "2023-12-28"
    },
    {
      id: "dom_5o6p7q8r9s0t1u2v",
      name: "enterprise-saas.io",
      redirect_url: "https://enterprise-saas.io/demo-request",
      status: "Active",
      client_id: "client_2b3c4d5e6f7g8h9i",
      linked_inboxes: 25,
      date_of_purchase: "2023-12-20"
    }
  ];

  const clients = [
    { id: "client_8a9b2c3d4e5f6g7h", name: "TechFlow Solutions" },
    { id: "client_2b3c4d5e6f7g8h9i", name: "Innovate Digital" },
    { id: "client_5c6d7e8f9g0h1i2j", name: "CloudScale Ventures" }
  ];

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

  const filteredDomains = domains.filter(domain => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === "" || 
                         domain.name.toLowerCase().includes(searchLower) ||
                         domain.redirect_url.toLowerCase().includes(searchLower) ||
                         domain.client_id.toLowerCase().includes(searchLower) ||
                         getClientName(domain.client_id).toLowerCase().includes(searchLower);
    
    const matchesStatus = statusFilter === "all" || domain.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesClient = clientFilter === "all" || domain.client_id === clientFilter;
    
    return matchesSearch && matchesStatus && matchesClient;
  });

  const handleSelectAll = () => {
    if (selectedDomains.length === filteredDomains.length) {
      setSelectedDomains([]);
    } else {
      setSelectedDomains(filteredDomains.map(domain => domain.id));
    }
  };

  const handleSelectDomain = (domainId: string) => {
    setSelectedDomains(prev => 
      prev.includes(domainId) 
        ? prev.filter(id => id !== domainId)
        : [...prev, domainId]
    );
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : clientId;
  };

  const handleBulkEdit = () => {
    if (selectedDomains.length === 0) return;
    alert(`Bulk editing ${selectedDomains.length} domains`);
  };

  const handleBulkDelete = () => {
    if (selectedDomains.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedDomains.length} domains?`)) {
      setSelectedDomains([]);
      alert(`${selectedDomains.length} domains deleted`);
    }
  };

  const handleAddDomain = () => {
    if (!newDomain.name || !newDomain.redirect_url || !newDomain.client_id) {
      alert("Please fill in all fields");
      return;
    }
    
    // In a real app, this would make an API call
    alert(`Domain ${newDomain.name} added successfully`);
    setNewDomain({ name: "", redirect_url: "", client_id: "" });
    setShowAddModal(false);
  };

  const handleEditDomain = (domainId: string) => {
    const domain = domains.find(d => d.id === domainId);
    if (domain) {
      alert(`Editing domain: ${domain.name}`);
    }
  };

  const handleDeleteDomain = (domainId: string) => {
    const domain = domains.find(d => d.id === domainId);
    if (domain && confirm(`Are you sure you want to delete ${domain.name}?`)) {
      alert(`Domain ${domain.name} deleted`);
    }
  };

  const handleViewDomain = (domainId: string) => {
    const domain = domains.find(d => d.id === domainId);
    if (domain) {
      window.open(domain.redirect_url, '_blank');
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
                <h2 className="text-2xl font-bold text-foreground">Domains Management</h2>
                <p className="text-muted-foreground mt-1">Manage your domains and their configurations</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Domain</span>
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
                    placeholder="Search domains, URLs, or client IDs..."
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

                {/* Client Filter */}
                <div className="relative">
                  <select
                    value={clientFilter}
                    onChange={(e) => setClientFilter(e.target.value)}
                    className="appearance-none bg-input border border-border rounded-lg px-4 py-2 pr-8 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Clients</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                  <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedDomains.length > 0 && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-primary font-medium">
                    {selectedDomains.length} domain{selectedDomains.length > 1 ? 's' : ''} selected
                  </span>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={handleBulkEdit}
                      className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors"
                    >
                      Bulk Edit
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

            {/* Domains Table */}
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
                            selectedDomains.length === filteredDomains.length && filteredDomains.length > 0
                              ? 'bg-primary border-primary text-primary-foreground'
                              : 'bg-background'
                          }`}>
                            {selectedDomains.length === filteredDomains.length && filteredDomains.length > 0 && (
                              <Check className="w-3 h-3" />
                            )}
                          </div>
                          <span>Select All</span>
                        </button>
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Domain ID</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Redirect URL</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Client</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Linked Inboxes</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Date of Purchase</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDomains.map((domain) => (
                      <tr key={domain.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-6">
                          <button
                            onClick={() => handleSelectDomain(domain.id)}
                            className={`w-4 h-4 border border-border rounded flex items-center justify-center ${
                              selectedDomains.includes(domain.id)
                                ? 'bg-primary border-primary text-primary-foreground'
                                : 'bg-background hover:border-primary/50'
                            }`}
                          >
                            {selectedDomains.includes(domain.id) && (
                              <Check className="w-3 h-3" />
                            )}
                          </button>
                        </td>
                        <td className="py-4 px-6 text-sm text-foreground font-mono">{domain.id}</td>
                        <td className="py-4 px-6 text-sm text-foreground font-medium">{domain.name}</td>
                        <td className="py-4 px-6 text-sm text-foreground">
                          <a 
                            href={domain.redirect_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 transition-colors flex items-center space-x-1"
                          >
                            <span className="truncate max-w-xs">{domain.redirect_url}</span>
                            <Eye className="w-3 h-3 flex-shrink-0" />
                          </a>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(domain.status)}`}>
                            {getStatusIcon(domain.status)}
                            <span>{domain.status}</span>
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-foreground">{getClientName(domain.client_id)}</td>
                        <td className="py-4 px-6 text-sm text-foreground">
                          <span className="font-medium">{domain.linked_inboxes}</span>
                        </td>
                        <td className="py-4 px-6 text-sm text-foreground">{domain.date_of_purchase}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleEditDomain(domain.id)}
                              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                              title="Edit Domain"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleViewDomain(domain.id)}
                              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                              title="View Domain"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteDomain(domain.id)}
                              className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                              title="Delete Domain"
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

              {filteredDomains.length === 0 && (
                <div className="text-center py-12">
                  <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No domains found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || statusFilter !== "all" || clientFilter !== "all"
                      ? "Try adjusting your search or filters"
                      : "Get started by adding your first domain"
                    }
                  </p>
                  {(!searchTerm && statusFilter === "all" && clientFilter === "all") && (
                    <button 
                      onClick={() => setShowAddModal(true)}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Add Domain
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Results Summary */}
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredDomains.length} of {domains.length} domains
            </div>
          </div>
        </main>
      </div>

      {/* Add Domain Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Add New Domain</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Domain Name</label>
                <input
                  type="text"
                  placeholder="example.com"
                  value={newDomain.name}
                  onChange={(e) => setNewDomain(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Redirect URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/landing"
                  value={newDomain.redirect_url}
                  onChange={(e) => setNewDomain(prev => ({ ...prev, redirect_url: e.target.value }))}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Client</label>
                <select 
                  value={newDomain.client_id}
                  onChange={(e) => setNewDomain(prev => ({ ...prev, client_id: e.target.value }))}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select a client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddDomain}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Add Domain
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </ProtectedRoute>
  );
}
