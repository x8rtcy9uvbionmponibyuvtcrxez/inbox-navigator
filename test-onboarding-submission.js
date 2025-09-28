// Test script to simulate complete onboarding form submission
const testOnboardingSubmission = async () => {
  const sessionId = 'cs_test_b1rv9LJzEcVgMEpnCzj86xkaiwzh2IkdL0VgL2fP9n0F34pDeZ63VHCRYY';
  
  const onboardingData = {
    // Step 1: Business Profile & Tagging
    businessType: 'SaaS',
    teamSize: '1-10',
    industry: 'Software',
    businessName: 'Test Company',
    customTags: ['startup', 'tech', 'saas'],
    
    // Step 2: Domain Setup
    domainMethod: 'buy',
    domainCredits: 0,
    domainCount: 2,
    domainForwardingUrl: 'https://test.com',
    uploadedDomains: '',
    domainHost: 'godaddy',
    hostingMethod: 'credentials',
    hostingUsername: 'testuser',
    hostingPassword: 'testpass',
    hostingToken: '',
    domainNotes: 'Need two domains for testing',
    
    // Step 3: Inbox & Persona Setup
    personasPerDomain: 2,
    personaFormat: 'first.last',
    personas: [
      { firstName: 'John', lastName: 'Doe', role: 'CEO', tags: ['executive', 'leadership'] },
      { firstName: 'Jane', lastName: 'Smith', role: 'Sales', tags: ['sales', 'outbound'] }
    ],
    
    // Step 4: ESP Integration
    espPlatform: 'smartlead',
    espLoginEmail: 'test@company.com',
    espPassword: 'testpass123',
    espWorkspaceName: 'Test Workspace',
    espApiKey: 'sk_test_123456789',
    espNotes: 'Using Smartlead for cold email campaigns',
    
    // Step 5: Final Notes
    finalNotes: 'This is a test submission for the onboarding flow',
    uploadedFiles: []
  };

  try {
    console.log('🚀 Testing complete onboarding form submission...');
    
    const response = await fetch('http://localhost:3000/api/onboarding/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        ...onboardingData,
        stepCompleted: 5,
        isCompleted: true,
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Onboarding form submission successful!');
      console.log('📊 Response:', JSON.stringify(data, null, 2));
    } else {
      console.error('❌ Onboarding form submission failed:', data);
    }
  } catch (error) {
    console.error('❌ Error during onboarding form submission:', error);
  }
};

// Run the test
testOnboardingSubmission();
