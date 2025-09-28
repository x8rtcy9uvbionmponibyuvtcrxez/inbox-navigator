'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Building2, Mail, Globe, CreditCard, Zap, Crown, LayoutDashboard, Bell, User, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export default function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  // Mock workspace data - no loading state needed for demo
  const workspace = {
    id: 'demo_workspace_123',
    name: 'My Workspace',
    subscriptionStatus: 'free' as const
  };

  const isFreeTier = workspace.subscriptionStatus === 'free';

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'inboxes', label: 'Inboxes', icon: Mail, href: '/dashboard/inboxes' },
    { id: 'domains', label: 'Domains', icon: Globe, href: '/dashboard/domains' },
    { id: 'billing', label: 'Billing', icon: CreditCard, href: '/dashboard/billing' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{workspace.name}</h2>
              <p className="text-xs text-gray-500">
                {workspace.subscriptionStatus === 'free' ? 'Free Plan' : 'Pro Plan'}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 font-medium truncate">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-gray-500 text-xs truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
            <button
              onClick={signOut}
              className="p-1 hover:bg-gray-100 rounded"
              title="Sign Out"
            >
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
            <div className="flex items-center space-x-4">
              {isFreeTier && (
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center space-x-2">
                  <Crown className="w-5 h-5" />
                  <span>Upgrade to Pro</span>
                </button>
              )}
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
