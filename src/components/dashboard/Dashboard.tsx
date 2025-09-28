'use client';

import { useState } from 'react';
import { getSampleDataForWorkspace } from '@/lib/sample-data';
import PaymentGate from '@/components/payment/PaymentGate';
import { Building2, Mail, Globe, ShoppingCart, Users, Zap, Crown, CreditCard } from 'lucide-react';

interface DashboardProps {
  workspaceId: string;
  workspaceName: string;
  subscriptionStatus: 'free' | 'paid' | 'trial';
}

export default function Dashboard({ workspaceId, workspaceName, subscriptionStatus }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const sampleData = getSampleDataForWorkspace(workspaceId);

  const isFreeTier = subscriptionStatus === 'free';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'inboxes', label: 'Inboxes', icon: Mail },
    { id: 'domains', label: 'Domains', icon: Globe },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'clients', label: 'Clients', icon: Users },
  ];

  const renderUpgradePrompt = (feature: string) => (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Crown className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-medium text-blue-900">
            Upgrade to access {feature}
          </span>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          Upgrade Now
        </button>
      </div>
    </div>
  );

  const renderDemoBadge = () => (
    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
      <Zap className="w-3 h-3 mr-1" />
      DEMO DATA
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Inboxes</p>
              <p className="text-2xl font-bold text-gray-900">{sampleData.inboxes.length}</p>
            </div>
            <Mail className="w-8 h-8 text-blue-500" />
          </div>
          {isFreeTier && renderDemoBadge()}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Domains</p>
              <p className="text-2xl font-bold text-gray-900">
                {sampleData.domains.filter(d => d.status === 'active').length}
              </p>
            </div>
            <Globe className="w-8 h-8 text-green-500" />
          </div>
          {isFreeTier && renderDemoBadge()}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{sampleData.orders.length}</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-purple-500" />
          </div>
          {isFreeTier && renderDemoBadge()}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Clients</p>
              <p className="text-2xl font-bold text-gray-900">
                {sampleData.clients.filter(c => c.status === 'active').length}
              </p>
            </div>
            <Users className="w-8 h-8 text-orange-500" />
          </div>
          {isFreeTier && renderDemoBadge()}
        </div>
      </div>

      {isFreeTier && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-purple-900">Ready to go live?</h3>
              <p className="text-purple-700 mt-1">
                Upgrade to start managing real inboxes and domains
              </p>
            </div>
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center space-x-2">
              <Crown className="w-5 h-5" />
              <span>Upgrade Now</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderInboxes = () => (
    <div className="space-y-4">
      {isFreeTier && renderUpgradePrompt('real inbox management')}
      
        <PaymentGate feature="inbox management" subscriptionStatus={subscriptionStatus}>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Inboxes</h3>
                {isFreeTier && renderDemoBadge()}
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {sampleData.inboxes.slice(0, 5).map((inbox) => (
                <div key={inbox.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{inbox.name}</p>
                        <p className="text-sm text-gray-500">{inbox.persona} • {inbox.domain}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{inbox.emailCount} emails</p>
                      <p className="text-xs text-gray-500">
                        {inbox.lastActivity ? inbox.lastActivity.toLocaleDateString() : 'No activity'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View all inboxes →
              </button>
            </div>
          </div>
        </PaymentGate>
    </div>
  );

  const renderDomains = () => (
    <div className="space-y-4">
      {isFreeTier && renderUpgradePrompt('domain management')}
      
        <PaymentGate feature="domain management" subscriptionStatus={subscriptionStatus}>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Domains</h3>
                {isFreeTier && renderDemoBadge()}
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {sampleData.domains.map((domain) => (
                <div key={domain.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Globe className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{domain.name}</p>
                        <p className="text-sm text-gray-500">{domain.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        domain.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : domain.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {domain.status}
                      </span>
                      {domain.dnsVerified && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PaymentGate>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-4">
      {isFreeTier && renderUpgradePrompt('order management')}
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            {isFreeTier && renderDemoBadge()}
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {sampleData.orders.map((order) => (
            <div key={order.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{order.description}</p>
                  <p className="text-sm text-gray-500">
                    {order.createdAt.toLocaleDateString()} • {order.currency} {order.totalAmount}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : order.status === 'processing'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="space-y-4">
      {isFreeTier && renderUpgradePrompt('client management')}
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Clients</h3>
            {isFreeTier && renderDemoBadge()}
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {sampleData.clients.map((client) => (
            <div key={client.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-500">{client.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  client.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {client.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{workspaceName}</h1>
              <p className="text-sm text-gray-500">
                {subscriptionStatus === 'free' ? 'Free Plan' : 'Pro Plan'} • 
                {isFreeTier ? ' Demo Mode' : ' Live Mode'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {isFreeTier && (
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center space-x-2">
                  <Crown className="w-5 h-5" />
                  <span>Upgrade to Pro</span>
                </button>
              )}
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>Billing</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'inboxes' && renderInboxes()}
        {activeTab === 'domains' && renderDomains()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'clients' && renderClients()}
      </div>
    </div>
  );
}
