'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';

interface QuantitySelectorProps {
  onCheckout: (quantity: number) => void;
  isLoading?: boolean;
  maxQuantity?: number;
}

export default function QuantitySelector({ 
  onCheckout, 
  isLoading = false, 
  maxQuantity = 100 
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleCheckout = () => {
    onCheckout(quantity);
  };

  const totalPrice = quantity * 3; // $3 per inbox

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Inboxes</h3>
        <p className="text-gray-600">Professional inbox management at $3 per inbox</p>
      </div>

      <div className="space-y-6">
        {/* Quantity Selector */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={handleDecrement}
            disabled={quantity <= 1}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{quantity}</div>
            <div className="text-sm text-gray-500">inbox{quantity !== 1 ? 'es' : ''}</div>
          </div>
          
          <button
            onClick={handleIncrement}
            disabled={quantity >= maxQuantity}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Pricing Breakdown */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Quantity:</span>
            <span className="font-medium">{quantity} inbox{quantity !== 1 ? 'es' : ''}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Price per inbox:</span>
            <span className="font-medium">$3.00</span>
          </div>
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900 mb-3">What&apos;s included:</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>Professional email management</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>Custom persona setup</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>Domain configuration</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>24/7 monitoring</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>Priority support</span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              <span>Proceed to Checkout</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
