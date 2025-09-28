'use client';

import { useState } from 'react';
import { Crown, CreditCard, Zap } from 'lucide-react';
import QuantitySelector from './QuantitySelector';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';

interface PaymentGateProps {
  feature: string;
  children: React.ReactNode;
  subscriptionStatus: 'free' | 'paid' | 'trial';
  onUpgrade?: () => void;
  workspaceId?: string;
  workspaceName?: string;
}

export default function PaymentGate({ 
  feature, 
  children, 
  subscriptionStatus, 
  onUpgrade,
  workspaceId,
  workspaceName
}: PaymentGateProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const { redirectToCheckout, isLoading } = useStripeCheckout();

  const isFreeTier = subscriptionStatus === 'free';

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      setShowQuantitySelector(true);
    }
  };

  const handleQuantityCheckout = async (quantity: number) => {
    try {
      await redirectToCheckout(quantity, workspaceId, workspaceName);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    }
  };

  if (!isFreeTier) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="relative">
        {/* Blurred content */}
        <div className="filter blur-sm pointer-events-none opacity-50">
          {children}
        </div>
        
        {/* Overlay with upgrade prompt */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 text-center shadow-xl">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-6 h-6 text-white" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upgrade to Pro
            </h3>
            
            <p className="text-gray-600 mb-4">
              Unlock {feature} and access all premium features
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Upgrade Now</span>
              </button>
              
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="w-full text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                View Pricing Plans
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quantity Selector Modal */}
      {showQuantitySelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Order Inboxes</h2>
                <button
                  onClick={() => setShowQuantitySelector(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <QuantitySelector
                onCheckout={handleQuantityCheckout}
                isLoading={isLoading}
                maxQuantity={100}
              />
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Free Plan */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Free</h3>
                    <div className="text-3xl font-bold text-gray-900 mb-4">$0<span className="text-lg text-gray-500">/month</span></div>
                    <p className="text-gray-600 mb-6">Perfect for getting started</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center text-sm text-gray-600">
                      <Zap className="w-4 h-4 text-green-500 mr-2" />
                      Demo data only
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <Zap className="w-4 h-4 text-green-500 mr-2" />
                      Basic dashboard
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <Zap className="w-4 h-4 text-green-500 mr-2" />
                      Community support
                    </li>
                  </ul>
                  
                  <button
                    disabled
                    className="w-full bg-gray-100 text-gray-400 px-4 py-2 rounded-lg font-medium cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                </div>

                {/* Pro Plan */}
                <div className="border-2 border-purple-500 rounded-lg p-6 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Recommended
                    </span>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Pro</h3>
                    <div className="text-3xl font-bold text-gray-900 mb-4">$29<span className="text-lg text-gray-500">/month</span></div>
                    <p className="text-gray-600 mb-6">Everything you need to scale</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center text-sm text-gray-600">
                      <Zap className="w-4 h-4 text-green-500 mr-2" />
                      Unlimited real inboxes
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <Zap className="w-4 h-4 text-green-500 mr-2" />
                      Domain management
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <Zap className="w-4 h-4 text-green-500 mr-2" />
                      Advanced analytics
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <Zap className="w-4 h-4 text-green-500 mr-2" />
                      Priority support
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <Zap className="w-4 h-4 text-green-500 mr-2" />
                      API access
                    </li>
                  </ul>
                  
                  <button
                    onClick={handleUpgrade}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center space-x-2"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Upgrade to Pro</span>
                  </button>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  All plans include a 14-day free trial. Cancel anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
