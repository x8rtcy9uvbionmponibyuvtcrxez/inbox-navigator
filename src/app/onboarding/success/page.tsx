'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  CheckCircle, 
  ArrowRight, 
  Building2, 
  Globe, 
  Users, 
  Mail, 
  Settings,
  Tag,
  Upload,
  CreditCard,
  FileText,
  Shield,
  Plus,
  X,
  ChevronDown
} from 'lucide-react';
import { OnboardingProgress } from '@/components/onboarding/progress';
import { PersonaForm, type Persona } from '@/components/onboarding/persona-form';
import { TagInput } from '@/components/onboarding/tag-input';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  completed: boolean;
}

interface OnboardingData {
  // Step 1: Business Profile & Tagging
  businessType: string;
  teamSize: string;
  industry: string;
  businessName: string;
  customTags: string[];
  
  // Step 2: Domain Setup
  domainMethod: 'buy' | 'bring' | 'handle';
  domainCredits: number;
  domainCount: number;
  domainForwardingUrl: string;
  uploadedDomains: string;
  domainHost: string;
  hostingMethod: 'credentials' | 'delegate' | 'dns';
  hostingUsername: string;
  hostingPassword: string;
  hostingToken: string;
  domainNotes: string;
  
  // Step 3: Inbox & Persona Setup
  personasPerDomain: number;
  personaFormat: string;
  personas: Array<{
    firstName: string;
    lastName: string;
    role: string;
    tags: string[];
  }>;
  
  // Step 4: ESP Integration
  espPlatform: string;
  espLoginEmail: string;
  espPassword: string;
  espWorkspaceName: string;
  espApiKey: string;
  espNotes: string;
  
  // Step 5: Final Notes
  finalNotes: string;
  uploadedFiles: File[];
}

function OnboardingSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    businessType: '',
    teamSize: '',
    industry: '',
    businessName: '',
    customTags: [],
    domainMethod: 'buy',
    domainCredits: 0,
    domainCount: 1,
    domainForwardingUrl: '',
    uploadedDomains: '',
    domainHost: '',
    hostingMethod: 'credentials',
    hostingUsername: '',
    hostingPassword: '',
    hostingToken: '',
    domainNotes: '',
    personasPerDomain: 1,
    personaFormat: '',
    personas: [{ firstName: '', lastName: '', role: '', tags: [] }],
    espPlatform: '',
    espLoginEmail: '',
    espPassword: '',
    espWorkspaceName: '',
    espApiKey: '',
    espNotes: '',
    finalNotes: '',
    uploadedFiles: []
  });

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: 'Business Profile & Tagging',
      description: 'Tell us about your business and set up tagging',
      icon: Building2,
      completed: currentStep > 0,
    },
    {
      id: 2,
      title: 'Domain Setup',
      description: 'Configure your email domains',
      icon: Globe,
      completed: currentStep > 1,
    },
    {
      id: 3,
      title: 'Inbox & Persona Setup',
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
      title: 'Final Notes & Confirmation',
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

  const addTag = (tag: string) => {
    if (tag.trim() && !onboardingData.customTags.includes(tag.trim())) {
      setOnboardingData({
        ...onboardingData,
        customTags: [...onboardingData.customTags, tag.trim()]
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setOnboardingData({
      ...onboardingData,
      customTags: onboardingData.customTags.filter(tag => tag !== tagToRemove)
    });
  };

  const addPersona = () => {
    if (onboardingData.personas.length < 3) {
      setOnboardingData({
        ...onboardingData,
        personas: [...onboardingData.personas, { firstName: '', lastName: '', role: '', tags: [] }]
      });
    }
  };

  const removePersona = (index: number) => {
    if (onboardingData.personas.length > 1) {
      setOnboardingData({
        ...onboardingData,
        personas: onboardingData.personas.filter((_, i) => i !== index)
      });
    }
  };

  const updatePersona = (index: number, field: string, value: string) => {
    const updatedPersonas = [...onboardingData.personas];
    updatedPersonas[index] = { ...updatedPersonas[index], [field]: value };
    setOnboardingData({ ...onboardingData, personas: updatedPersonas });
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
                <li>• Configure your business profile and tagging system</li>
                <li>• Set up your email domains</li>
                <li>• Create email personas for your campaigns</li>
                <li>• Connect your email service provider</li>
                <li>• Review and finalize your setup</li>
              </ul>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Business Profile & Tagging</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What best describes your business? *
                </label>
                <select
                  value={onboardingData.businessType}
                  onChange={(e) => setOnboardingData({...onboardingData, businessType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select business type</option>
                  <option value="saas">SaaS</option>
                  <option value="cold-email-agency">Cold Email Agency</option>
                  <option value="lead-gen-service">Lead Gen Service</option>
                  <option value="ecom-brand">E-com Brand</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Size *
                </label>
                <select
                  value={onboardingData.teamSize}
                  onChange={(e) => setOnboardingData({...onboardingData, teamSize: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select team size</option>
                  <option value="1-10">1-10</option>
                  <option value="11-25">11-25</option>
                  <option value="26-100">26-100</option>
                  <option value="100+">100+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What industry are you in?
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
                Business Name (Primary Tag) *
                </label>
              <input
                type="text"
                value={onboardingData.businessName}
                onChange={(e) => setOnboardingData({...onboardingData, businessName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your company name"
              />
              <p className="text-sm text-gray-500 mt-1">This will be auto-applied as a tag across all assets</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Custom Tags
              </label>
              <TagInput
                value={onboardingData.customTags}
                onChange={(tags) => setOnboardingData({...onboardingData, customTags: tags})}
                placeholder="Add a tag"
              />
              <p className="text-sm text-gray-500 mt-1">These tags will propagate across inboxes and domains</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Domain Setup</h2>
            
            <div className="space-y-4">
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="domainMethod"
                    value="buy"
                    checked={onboardingData.domainMethod === 'buy'}
                    onChange={(e) => setOnboardingData({...onboardingData, domainMethod: e.target.value as 'buy'})}
                    className="mr-2"
                  />
                  <span className="font-medium">Buy Fresh Domains</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="domainMethod"
                    value="bring"
                    checked={onboardingData.domainMethod === 'bring'}
                    onChange={(e) => setOnboardingData({...onboardingData, domainMethod: e.target.value as 'bring'})}
                    className="mr-2"
                  />
                  <span className="font-medium">Bring Your Own Domains</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="domainMethod"
                    value="handle"
                    checked={onboardingData.domainMethod === 'handle'}
                    onChange={(e) => setOnboardingData({...onboardingData, domainMethod: e.target.value as 'handle'})}
                    className="mr-2"
                  />
                  <span className="font-medium">Let InboxNav Handle It</span>
                </label>
              </div>

              {onboardingData.domainMethod === 'buy' && (
                <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Purchase Domain Credits</span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Buy Credits
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How many domains for this order?
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={onboardingData.domainCount}
                      onChange={(e) => setOnboardingData({...onboardingData, domainCount: parseInt(e.target.value) || 1})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {onboardingData.domainMethod === 'bring' && (
                <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Your Domains
              </label>
              <textarea
                      value={onboardingData.uploadedDomains}
                      onChange={(e) => setOnboardingData({...onboardingData, uploadedDomains: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                      placeholder="Enter domains separated by commas or new lines"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Domain Host
                    </label>
                    <select
                      value={onboardingData.domainHost}
                      onChange={(e) => setOnboardingData({...onboardingData, domainHost: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select host</option>
                      <option value="godaddy">GoDaddy</option>
                      <option value="namecheap">Namecheap</option>
                      <option value="cloudflare">Cloudflare</option>
                      <option value="others">Others</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Domain Hosting Login Method
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="hostingMethod"
                          value="credentials"
                          checked={onboardingData.hostingMethod === 'credentials'}
                          onChange={(e) => setOnboardingData({...onboardingData, hostingMethod: e.target.value as 'credentials'})}
                          className="mr-2"
                        />
                        <span>Credentials</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="hostingMethod"
                          value="delegate"
                          checked={onboardingData.hostingMethod === 'delegate'}
                          onChange={(e) => setOnboardingData({...onboardingData, hostingMethod: e.target.value as 'delegate'})}
                          className="mr-2"
                        />
                        <span>Delegate Access</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="hostingMethod"
                          value="dns"
                          checked={onboardingData.hostingMethod === 'dns'}
                          onChange={(e) => setOnboardingData({...onboardingData, hostingMethod: e.target.value as 'dns'})}
                          className="mr-2"
                        />
                        <span>DNS Only</span>
                      </label>
                    </div>
                  </div>
                  {onboardingData.hostingMethod === 'credentials' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username/Email
                        </label>
                        <input
                          type="text"
                          value={onboardingData.hostingUsername}
                          onChange={(e) => setOnboardingData({...onboardingData, hostingUsername: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                        <input
                          type="password"
                          value={onboardingData.hostingPassword}
                          onChange={(e) => setOnboardingData({...onboardingData, hostingPassword: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
                    </div>
                  )}
                  {onboardingData.hostingMethod === 'delegate' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                        Provide Invite Email or Access Token
                      </label>
                      <input
                        type="text"
                        value={onboardingData.hostingToken}
                        onChange={(e) => setOnboardingData({...onboardingData, hostingToken: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              )}

              {onboardingData.domainMethod === 'handle' && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800">
                    We will purchase and set up domains on your behalf based on inbox configuration.
                  </p>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add notes or specific requests about domains
              </label>
              <textarea
                      value={onboardingData.domainNotes}
                      onChange={(e) => setOnboardingData({...onboardingData, domainNotes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                      placeholder="Any specific requirements or preferences..."
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domain Forwarding URL (Optional)
                </label>
                <input
                  type="url"
                  value={onboardingData.domainForwardingUrl}
                  onChange={(e) => setOnboardingData({...onboardingData, domainForwardingUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://your-landing-page.com"
                />
                <p className="text-sm text-yellow-600 mt-1">
                  ⚠️ Future versions will implement confirmation modal if URL is empty
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Inbox & Persona Setup</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How many personas per domain?
                </label>
                <select
                  value={onboardingData.personasPerDomain}
                  onChange={(e) => setOnboardingData({...onboardingData, personasPerDomain: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Persona Format
                </label>
                <input
                  type="text"
                  value={onboardingData.personaFormat}
                  onChange={(e) => setOnboardingData({...onboardingData, personaFormat: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., first.last"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Personas (Max 3)</h3>
                {onboardingData.personas.length < 3 && (
                  <button
                    type="button"
                    onClick={addPersona}
                    className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Persona
                  </button>
                )}
              </div>

              {onboardingData.personas.map((persona, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Persona {index + 1}</h4>
                    {onboardingData.personas.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePersona(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <PersonaForm
                    index={index}
                    value={persona as Persona}
                    onChange={(patch) => {
                      const updatedPersonas = [...onboardingData.personas];
                      updatedPersonas[index] = { ...updatedPersonas[index], ...patch };
                      setOnboardingData({...onboardingData, personas: updatedPersonas});
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">ESP Integration</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Which platform are you using to send cold emails? *
              </label>
              <select
                value={onboardingData.espPlatform}
                onChange={(e) => setOnboardingData({...onboardingData, espPlatform: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select platform</option>
                <option value="smartlead">Smartlead</option>
                <option value="instantly">Instantly</option>
                <option value="mailreach">Mailreach</option>
                <option value="lemwarm">Lemwarm</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Login Email *
                </label>
                <input
                  type="email"
                  value={onboardingData.espLoginEmail}
                  onChange={(e) => setOnboardingData({...onboardingData, espLoginEmail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your-email@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  value={onboardingData.espPassword}
                  onChange={(e) => setOnboardingData({...onboardingData, espPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your password"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workspace Name or Label
              </label>
              <input
                type="text"
                value={onboardingData.espWorkspaceName}
                onChange={(e) => setOnboardingData({...onboardingData, espWorkspaceName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="My Workspace"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <input
                type="password"
                value={onboardingData.espApiKey}
                onChange={(e) => setOnboardingData({...onboardingData, espApiKey: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your API key (if required)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={onboardingData.espNotes}
                onChange={(e) => setOnboardingData({...onboardingData, espNotes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Any additional notes or requirements..."
              />
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-1">Data Security</h3>
              <p className="text-sm text-yellow-800">
                    All credentials are securely saved and encrypted. Some ESPs require login + API, others just login.
              </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Final Notes & Confirmation</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Any final notes or custom requests?
              </label>
              <textarea
                value={onboardingData.finalNotes}
                onChange={(e) => setOnboardingData({...onboardingData, finalNotes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Any special requirements, custom requests, or additional information..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload brand assets, logos, or reference material
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Drag and drop files here, or click to select</p>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  id="file-upload"
                  onChange={(e) => {
                    if (e.target.files) {
                      setOnboardingData({
                        ...onboardingData,
                        uploadedFiles: Array.from(e.target.files)
                      });
                    }
                  }}
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </label>
              </div>
              {onboardingData.uploadedFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700 mb-1">Uploaded files:</p>
                  <ul className="text-sm text-gray-600">
                    {onboardingData.uploadedFiles.map((file, index) => (
                      <li key={index}>• {file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Review Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Setup</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Business Summary</h4>
                  <p className="text-sm text-gray-600">
                    {onboardingData.businessType} • {onboardingData.teamSize} • {onboardingData.industry}
                  </p>
                  <p className="text-sm text-gray-600">Primary Tag: {onboardingData.businessName}</p>
                  {onboardingData.customTags.length > 0 && (
                    <p className="text-sm text-gray-600">Custom Tags: {onboardingData.customTags.join(', ')}</p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Domain Setup</h4>
                  <p className="text-sm text-gray-600">
                    Method: {onboardingData.domainMethod === 'buy' ? 'Buy Fresh Domains' : 
                            onboardingData.domainMethod === 'bring' ? 'Bring Your Own Domains' : 
                            'Let InboxNav Handle It'}
                  </p>
                  {onboardingData.domainMethod === 'buy' && (
                    <p className="text-sm text-gray-600">Domains: {onboardingData.domainCount}</p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Persona Details</h4>
                  <p className="text-sm text-gray-600">
                    {onboardingData.personasPerDomain} persona(s) per domain
                  </p>
                  {onboardingData.personas.map((persona, index) => (
                    <p key={index} className="text-sm text-gray-600">
                      • {persona.firstName} {persona.lastName} {persona.role && `(${persona.role})`}
                    </p>
                  ))}
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">ESP Overview</h4>
                  <p className="text-sm text-gray-600">
                    Platform: {onboardingData.espPlatform} • Workspace: {onboardingData.espWorkspaceName}
                  </p>
                </div>
              </div>
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
                    isActive ? 'bg-blue-600 text-white' :
                    isCompleted ? 'bg-green-600 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-2 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-200'
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
            <div className="mt-4 flex justify-center">
              <OnboardingProgress step={currentStep + 1} total={steps.length} />
            </div>
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
              <span>{currentStep === steps.length - 1 ? 'Submit Onboarding Form' : 'Next'}</span>
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