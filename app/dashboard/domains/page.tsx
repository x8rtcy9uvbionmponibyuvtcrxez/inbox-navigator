'use client';

import { useState } from 'react';
import { Globe, Plus, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
// Removed old DashboardLayout import
// Removed old PaymentGate import

export default function DomainsPage() {
  const [domains] = useState([
    {
      id: 'demo_domain_1',
      name: 'example.com',
      status: 'active',
      dnsVerified: true,
      createdAt: new Date('2024-01-15'),
      description: 'Main company domain'
    },
    {
      id: 'demo_domain_2', 
      name: 'demo-corp.com',
      status: 'active',
      dnsVerified: true,
      createdAt: new Date('2024-01-20'),
      description: 'Demo corporation domain'
    },
    {
      id: 'demo_domain_3',
      name: 'test-company.org',
      status: 'pending',
      dnsVerified: false,
      createdAt: new Date('2024-01-25'),
      description: 'Test organization domain'
    },
    {
      id: 'demo_domain_4',
      name: 'startup-io.com',
      status: 'active',
      dnsVerified: true,
      createdAt: new Date('2024-02-01'),
      description: 'Startup domain for testing'
    },
    {
      id: 'demo_domain_5',
      name: 'enterprise.net',
      status: 'suspended',
      dnsVerified: false,
      createdAt: new Date('2024-02-05'),
      description: 'Enterprise domain (suspended)'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'suspended':
        return <XCircle className="w-4 h-4 text-red-500" />;
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
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Your Domains</h3>
              <div className="flex items-center space-x-4">
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                  <span>DEMO DATA</span>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add New Domain</span>
                </button>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {domains.map((domain) => (
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
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(domain.status)}`}>
                      {getStatusIcon(domain.status)}
                      <span className="ml-1">{domain.status}</span>
                    </span>
                    {domain.dnsVerified && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        DNS Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}
