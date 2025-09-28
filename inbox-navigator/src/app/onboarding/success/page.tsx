'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight, Building2, Globe, Users, Mail, Settings } from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  completed: boolean;
}

function OnboardingSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    businessName: '',
    businessType: '',
    industry: '',
    companySize: '',
    website: '',
    preferredDomains: [] as string[],
    domainRequirements: '',
    personas: [] as Record<string, unknown>[],
    espProvider: '',
    specialRequirements: '',
  });

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: 'Business Profile',
      description: 'Tell us about your business',
      icon: Building2,
      completed: currentStep > 0,
    },
    {
      id: 2,
      title: 'Domain Preferences',
      description: 'Configure your email domains',
      icon: Globe,
      completed: currentStep > 1,
    },
    {
      id: 3,
      title: 'Persona Setup',
      description: 'Create email personas',
      icon: Users,
      completed: currentStep > 2,
    },
    {
      id: 4,
      title: 'ESP Integration',
      description: 'Connect your email provider',
      icon: Mail,
      completed: currentStep > 3,
    },
    {
      id: 5,
      title: 'Final Review',
      description: 'Review and complete setup',
      icon: Settings,
      completed: currentStep > 4,
    },
  ];

  useEffect(() => {
    if (!sessionId) {
      router.push('/dashboard');
    }
  }, [sessionId, router]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    try {
      // Save onboarding data
      const response = await fetch('/api/onboarding/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          ...onboardingData,
          stepCompleted: steps.length,
          isCompleted: true,
        }),
      });

      if (response.ok) {
        router.push('/dashboard?onboarding=complete');
      } else {
        console.error('Failed to save onboarding data');
      }
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
              <p className="text-gray-600">
                Your order has been processed. Let&apos;s set up your inbox management system.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• We&apos;ll configure your email domains</li>
                <li>• Set up professional email personas</li>
                <li>• Connect your email service provider</li>
                <li>• Start managing your inboxes immediately</li>
              </ul>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Business Profile</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={onboardingData.businessName}
                  onChange={(e) => setOnboardingData({...onboardingData, businessName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your Company Name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type
                </label>
                <select
                  value={onboardingData.businessType}
                  onChange={(e) => setOnboardingData({...onboardingData, businessType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select type</option>
                  <option value="startup">Startup</option>
                  <option value="small-business">Small Business</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="agency">Agency</option>
                  <option value="freelancer">Freelancer</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <input
                  type="text"
                  value={onboardingData.industry}
                  onChange={(e) => setOnboardingData({...onboardingData, industry: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Technology, Healthcare, Finance"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Size
                </label>
                <select
                  value={onboardingData.companySize}
                  onChange={(e) => setOnboardingData({...onboardingData, companySize: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="200+">200+ employees</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                value={onboardingData.website}
                onChange={(e) => setOnboardingData({...onboardingData, website: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://yourcompany.com"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Domain Preferences</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Domains
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Enter the domains you&apos;d like to use for your email addresses (one per line)
              </p>
              <textarea
                value={onboardingData.preferredDomains.join('\n')}
                onChange={(e) => setOnboardingData({
                  ...onboardingData, 
                  preferredDomains: e.target.value.split('\n').filter(d => d.trim())
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="example.com&#10;yourcompany.org&#10;mydomain.net"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domain Requirements
              </label>
              <textarea
                value={onboardingData.domainRequirements}
                onChange={(e) => setOnboardingData({...onboardingData, domainRequirements: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Any specific requirements for your domains..."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Persona Setup</h2>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Email Personas</h3>
              <p className="text-sm text-blue-800">
                We&apos;ll create professional email personas for your business. You can add more later.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Default Personas</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Support Agent - Handles customer inquiries</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Sales Executive - Manages sales leads</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Marketing Specialist - Runs campaigns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">ESP Integration</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Service Provider
              </label>
              <select
                value={onboardingData.espProvider}
                onChange={(e) => setOnboardingData({...onboardingData, espProvider: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select provider</option>
                <option value="gmail">Gmail</option>
                <option value="outlook">Outlook</option>
                <option value="yahoo">Yahoo Mail</option>
                <option value="custom-smtp">Custom SMTP</option>
              </select>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">Note</h3>
              <p className="text-sm text-yellow-800">
                You can configure your ESP credentials later in the dashboard. 
                For now, we&apos;ll set up the basic configuration.
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Final Review</h2>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Review Your Setup</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Business Name:</span>
                  <span className="font-medium">{onboardingData.businessName || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Business Type:</span>
                  <span className="font-medium">{onboardingData.businessType || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Domains:</span>
                  <span className="font-medium">{onboardingData.preferredDomains.length} configured</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ESP Provider:</span>
                  <span className="font-medium">{onboardingData.espProvider || 'Not specified'}</span>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requirements
              </label>
              <textarea
                value={onboardingData.specialRequirements}
                onChange={(e) => setOnboardingData({...onboardingData, specialRequirements: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Any special requirements or notes..."
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = step.completed;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isActive 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-2 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 text-center">
            <h1 className="text-lg font-semibold text-gray-900">
              {steps[currentStep].title}
            </h1>
            <p className="text-gray-600">
              {steps[currentStep].description}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {renderStepContent()}
          
          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <span>{currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <OnboardingSuccessContent />
    </Suspense>
  );
}
