'use client';

import { useState } from 'react';
import { CreditCard, Crown, CheckCircle, Clock, AlertTriangle, Zap } from 'lucide-react';
// Removed old DashboardLayout import
// Removed old PaymentGate import

export default function BillingPage() {
  const [currentPlan] = useState({
    name: 'Free Plan',
    price: 0,
    period: 'month',
    features: [
      'Demo data only',
      'Basic dashboard',
      'Community support'
    ],
    limits: {
      inboxes: 0,
      domains: 0,
      storage: '0 GB'
    }
  });

  const [proPlan] = useState({
    name: 'Pro Plan',
    price: 29,
    period: 'month',
    features: [
      'Unlimited real inboxes',
      'Domain management',
      'Advanced analytics',
      'Priority support',
      'API access'
    ],
    limits: {
      inboxes: 'Unlimited',
      domains: 'Unlimited',
      storage: '100 GB'
    }
  });

  const [orders] = useState([
    {
      id: 'ord_7f8a9b2c1d3e4f5g',
      date: '2024-01-15',
      amount: 299.99,
      status: 'completed',
      description: 'Premium Inbox Package - 5 inboxes'
    },
    {
      id: 'ord_9e8d7c6b5a4f3g2h', 
      date: '2024-01-10',
      amount: 149.99,
      status: 'processing',
      description: 'Standard Inbox Package - 3 inboxes'
    },
    {
      id: 'ord_1a2b3c4d5e6f7g8h',
      date: '2024-01-05',
      amount: 99.99,
      status: 'pending',
      description: 'Basic Inbox Package - 2 inboxes'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
        {/* Current Plan */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
              <Zap className="w-3 h-3 mr-1" />
              <span>DEMO DATA</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{currentPlan.name}</h4>
                <span className="text-2xl font-bold text-gray-900">
                  ${currentPlan.price}<span className="text-sm text-gray-500">/{currentPlan.period}</span>
                </span>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-2 border-purple-500 rounded-lg p-4 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Recommended
                </span>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{proPlan.name}</h4>
                <span className="text-2xl font-bold text-gray-900">
                  ${proPlan.price}<span className="text-sm text-gray-500">/{proPlan.period}</span>
                </span>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                {proPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                <Crown className="w-4 h-4" />
                <span>Upgrade to Pro</span>
              </button>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                <span>DEMO DATA</span>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{order.description}</p>
                    <p className="text-sm text-gray-500">
                      {order.date} • Order #{order.id}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-gray-900">
                      ${order.amount}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
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
