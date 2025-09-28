'use client';

import { useState } from 'react';
import { Mail, Plus, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
// Removed old DashboardLayout import
// Removed old PaymentGate import

export default function InboxesPage() {
  const [inboxes] = useState([
    {
      id: 'demo_inbox_1',
      name: 'support@example.com',
      domain: 'example.com',
      persona: 'Customer Support',
      status: 'active',
      emailCount: 1247,
      lastActivity: new Date('2024-01-28'),
      description: 'Main support inbox'
    },
    {
      id: 'demo_inbox_2',
      name: 'sales@demo-corp.com',
      domain: 'demo-corp.com',
      persona: 'Sales Team',
      status: 'active',
      emailCount: 892,
      lastActivity: new Date('2024-01-27'),
      description: 'Sales inquiries'
    },
    {
      id: 'demo_inbox_3',
      name: 'info@test-company.org',
      domain: 'test-company.org',
      persona: 'General Info',
      status: 'pending',
      emailCount: 0,
      lastActivity: null,
      description: 'General information'
    },
    {
      id: 'demo_inbox_4',
      name: 'hello@startup-io.com',
      domain: 'startup-io.com',
      persona: 'Founder',
      status: 'active',
      emailCount: 456,
      lastActivity: new Date('2024-01-26'),
      description: 'Founder direct contact'
    },
    {
      id: 'demo_inbox_5',
      name: 'billing@example.com',
      domain: 'example.com',
      persona: 'Finance Team',
      status: 'active',
      emailCount: 234,
      lastActivity: new Date('2024-01-25'),
      description: 'Billing inquiries'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Your Inboxes</h3>
              <div className="flex items-center space-x-4">
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                  <span>DEMO DATA</span>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Create New Inbox</span>
                </button>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {inboxes.map((inbox) => (
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
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{inbox.emailCount} emails</p>
                      <p className="text-xs text-gray-500">
                        {inbox.lastActivity ? inbox.lastActivity.toLocaleDateString() : 'No activity'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inbox.status)}`}>
                      {getStatusIcon(inbox.status)}
                      <span className="ml-1">{inbox.status}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}
