'use client';

import { Zap, Crown, Mail, Globe, ShoppingCart, Users } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PaymentGate from '@/components/payment/PaymentGate';

export default function DashboardPage() {
  const isFreeTier = true; // Demo mode - always show demo badges
  
  const renderDemoBadge = () => (
    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
      <Zap className="w-3 h-3 mr-1" />
      DEMO DATA
    </div>
  );

  return (
    <DashboardLayout title="Dashboard" description="Overview of your workspace">
      <div className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Inboxes</p>
                  <p className="text-2xl font-bold text-gray-900">15</p>
                </div>
                <Mail className="w-8 h-8 text-blue-500" />
              </div>
              {isFreeTier && renderDemoBadge()}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Domains</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <Globe className="w-8 h-8 text-green-500" />
              </div>
              {isFreeTier && renderDemoBadge()}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-purple-500" />
              </div>
              {isFreeTier && renderDemoBadge()}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Clients</p>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                </div>
                <Users className="w-8 h-8 text-orange-500" />
              </div>
              {isFreeTier && renderDemoBadge()}
            </div>
          </div>

          {isFreeTier && (
            <PaymentGate
              feature="real inbox management"
              subscriptionStatus="free"
              workspaceId="demo_workspace_123"
              workspaceName="My Workspace"
            >
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
            </PaymentGate>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
