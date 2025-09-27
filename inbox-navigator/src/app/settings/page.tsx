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
  User,
  Users,
  Bell as BellIcon,
  Mail as MailIcon,
  Settings as SettingsIcon,
  Save,
  Edit,
  Trash2,
  Plus as PlusIcon,
  X,
  Check,
  AlertCircle,
  Shield,
  Key,
  Smartphone,
  Globe as GlobeIcon
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const { user, signOut } = useAuth();
  const [activeSettingsTab, setActiveSettingsTab] = useState("account");

  const navigation = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "domains", label: "Domains", icon: Globe },
    { id: "inboxes", label: "Inboxes", icon: Mail },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  const settingsTabs = [
    { id: "account", label: "Account", icon: User },
    { id: "team", label: "Team", icon: Users },
    { id: "notifications", label: "Notifications", icon: BellIcon },
    { id: "sending", label: "Sending Accounts", icon: MailIcon },
  ];

  const teamMembers = [
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex@example.com",
      role: "Owner",
      status: "Active",
      lastActive: "2 hours ago"
    },
    {
      id: "2",
      name: "Sarah Wilson",
      email: "sarah@example.com",
      role: "Admin",
      status: "Active",
      lastActive: "1 day ago"
    },
    {
      id: "3",
      name: "Mike Chen",
      email: "mike@example.com",
      role: "Member",
      status: "Pending",
      lastActive: "Never"
    }
  ];

  const sendingAccounts = [
    {
      id: "1",
      name: "Gmail Business",
      email: "business@example.com",
      provider: "Gmail",
      status: "Active",
      dailyLimit: "500",
      usedToday: "127"
    },
    {
      id: "2",
      name: "Outlook Corporate",
      email: "corporate@example.com",
      provider: "Outlook",
      status: "Active",
      dailyLimit: "300",
      usedToday: "89"
    },
    {
      id: "3",
      name: "Custom SMTP",
      email: "smtp@example.com",
      provider: "Custom",
      status: "Inactive",
      dailyLimit: "1000",
      usedToday: "0"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "inactive":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Check className="w-4 h-4" />;
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      case "inactive":
        return <X className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "owner":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "admin":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "member":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
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
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">Settings</h2>
              <p className="text-muted-foreground mt-1">Manage your account, team, and preferences</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Settings Navigation */}
              <div className="lg:w-64">
                <div className="bg-card border border-border rounded-xl p-4">
                  <nav className="space-y-1">
                    {settingsTabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeSettingsTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveSettingsTab(tab.id)}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm">{tab.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* Settings Content */}
              <div className="flex-1">
                {/* Account Settings */}
                {activeSettingsTab === "account" && (
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-6">Account Settings</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                        <input
                          type="text"
                          defaultValue="Alex Johnson"
                          className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                        <input
                          type="email"
                          defaultValue="alex@example.com"
                          className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Company</label>
                        <input
                          type="text"
                          defaultValue="Acme Corporation"
                          className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Timezone</label>
                        <select className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                          <option value="UTC-8">Pacific Time (UTC-8)</option>
                          <option value="UTC-5">Eastern Time (UTC-5)</option>
                          <option value="UTC+0">UTC</option>
                          <option value="UTC+1">Central European Time (UTC+1)</option>
                        </select>
                      </div>
                      
                      <div className="pt-4 border-t border-border">
                        <h4 className="text-lg font-medium text-foreground mb-4">Security</h4>
                        <div className="space-y-3">
                          <button className="w-full flex items-center justify-between p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                            <div className="flex items-center space-x-3">
                              <Key className="w-5 h-5 text-muted-foreground" />
                              <span className="text-foreground">Change Password</span>
                            </div>
                            <Edit className="w-4 h-4 text-muted-foreground" />
                          </button>
                          
                          <button className="w-full flex items-center justify-between p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                            <div className="flex items-center space-x-3">
                              <Smartphone className="w-5 h-5 text-muted-foreground" />
                              <span className="text-foreground">Two-Factor Authentication</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-green-400">Enabled</span>
                              <SettingsIcon className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
                        <button className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors">
                          Cancel
                        </button>
                        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2">
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Team Settings */}
                {activeSettingsTab === "team" && (
                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-foreground">Team Management</h3>
                      <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2">
                        <PlusIcon className="w-4 h-4" />
                        <span>Invite Member</span>
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {teamMembers.map((member) => (
                        <div key={member.id} className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-foreground">{member.name}</h4>
                                <p className="text-sm text-muted-foreground">{member.email}</p>
                                <p className="text-xs text-muted-foreground">Last active: {member.lastActive}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(member.role)}`}>
                                {member.role}
                              </span>
                              <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(member.status)}`}>
                                {getStatusIcon(member.status)}
                                <span>{member.status}</span>
                              </span>
                              <div className="flex items-center space-x-1">
                                <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notifications Settings */}
                {activeSettingsTab === "notifications" && (
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-6">Notification Preferences</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-medium text-foreground mb-4">Email Notifications</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-foreground">Order Updates</p>
                              <p className="text-sm text-muted-foreground">Get notified when your orders are processed</p>
                            </div>
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-foreground">Billing Reminders</p>
                              <p className="text-sm text-muted-foreground">Receive billing notifications and reminders</p>
                            </div>
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-foreground">Security Alerts</p>
                              <p className="text-sm text-muted-foreground">Important security and account updates</p>
                            </div>
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-primary" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-medium text-foreground mb-4">In-App Notifications</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-foreground">Browser Notifications</p>
                              <p className="text-sm text-muted-foreground">Show browser notifications for important updates</p>
                            </div>
                            <input type="checkbox" className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-foreground">Sound Alerts</p>
                              <p className="text-sm text-muted-foreground">Play sound for new notifications</p>
                            </div>
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-primary" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
                        <button className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors">
                          Reset to Default
                        </button>
                        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2">
                          <Save className="w-4 h-4" />
                          <span>Save Preferences</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sending Accounts Settings */}
                {activeSettingsTab === "sending" && (
                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-foreground">Sending Accounts</h3>
                      <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2">
                        <PlusIcon className="w-4 h-4" />
                        <span>Add Account</span>
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {sendingAccounts.map((account) => (
                        <div key={account.id} className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <MailIcon className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-foreground">{account.name}</h4>
                                <p className="text-sm text-muted-foreground">{account.email}</p>
                              </div>
                            </div>
                            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(account.status)}`}>
                              {getStatusIcon(account.status)}
                              <span>{account.status}</span>
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-muted-foreground">Provider</p>
                              <p className="font-semibold text-foreground">{account.provider}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Daily Limit</p>
                              <p className="font-semibold text-foreground">{account.dailyLimit}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Used Today</p>
                              <p className="font-semibold text-foreground">{account.usedToday}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/80 transition-colors flex items-center space-x-1">
                              <SettingsIcon className="w-3 h-3" />
                              <span>Configure</span>
                            </button>
                            <button className="px-3 py-1 bg-destructive/10 text-destructive border border-destructive/20 rounded text-sm hover:bg-destructive/20 transition-colors">
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      </div>
    </ProtectedRoute>
  );
}
