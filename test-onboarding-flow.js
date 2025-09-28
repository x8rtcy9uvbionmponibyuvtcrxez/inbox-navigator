// Test script to verify the complete onboarding flow
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testOnboardingFlow() {
  console.log('🧪 Testing Onboarding Flow...\n');

  try {
    // Step 1: Create a test order first
    console.log('1. Creating test order...');
    const orderResponse = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workspaceId: 'test-workspace',
        clientId: 'test-client',
        orderNumber: 'TEST-ORD-001',
        stripeSessionId: 'test-session-123',
        stripeCustomerId: 'test-customer-123',
        status: 'PENDING',
        totalAmount: 99.99,
        currency: 'USD',
        quantity: 1,
        inboxCount: 5,
        domainCount: 2,
        productId: 'inbox_basic',
        priceId: 'price_inbox_basic',
        productsBought: '["inbox_basic"]',
        typesOfInboxes: '["GSUITE"]',
      }),
    });

    if (!orderResponse.ok) {
      console.log('❌ Failed to create test order');
      return;
    }

    const order = await orderResponse.json();
    console.log('✅ Test order created:', order.id);

    // Step 2: Test onboarding data submission
    console.log('\n2. Testing onboarding data submission...');
    const onboardingData = {
      sessionId: order.id,
      stepCompleted: 4,
      isCompleted: true,
      businessType: 'SaaS',
      industry: 'Technology',
      companySize: '11-25',
      website: 'test-company.com',
      preferredDomains: ['test1.com', 'test2.com'],
      domainRequirements: 'Need professional domains for email marketing',
      personas: [
        {
          firstName: 'John',
          lastName: 'Doe',
          role: 'CEO',
          tags: ['executive', 'decision-maker']
        },
        {
          firstName: 'Jane',
          lastName: 'Smith',
          role: 'Marketing Manager',
          tags: ['marketing', 'operations']
        }
      ],
      personaCount: 2,
      espProvider: 'Smartlead',
      espCredentials: {
        loginEmail: 'test@company.com',
        password: 'test-password',
        workspace: 'Test Workspace',
        apiKey: 'test-api-key',
        notes: 'Test integration'
      },
      specialRequirements: 'Need custom email templates',
      customTags: ['urgent', 'priority']
    };

    const onboardingResponse = await fetch(`${BASE_URL}/api/onboarding/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(onboardingData),
    });

    if (!onboardingResponse.ok) {
      const error = await onboardingResponse.json();
      console.log('❌ Failed to save onboarding data:', error);
      return;
    }

    const result = await onboardingResponse.json();
    console.log('✅ Onboarding data saved successfully');
    console.log('   - Order ID:', result.onboardingData?.orderId);
    console.log('   - Workspace ID:', result.onboardingData?.workspaceId);
    console.log('   - Step Completed:', result.onboardingData?.stepCompleted);
    console.log('   - Is Completed:', result.onboardingData?.isCompleted);

    // Step 3: Verify order status was updated
    console.log('\n3. Verifying order status update...');
    const orderCheckResponse = await fetch(`${BASE_URL}/api/orders/${order.id}`);
    
    if (orderCheckResponse.ok) {
      const updatedOrder = await orderCheckResponse.json();
      console.log('✅ Order status updated to:', updatedOrder.status);
      console.log('   - Fulfilled Date:', updatedOrder.fulfilledDate);
    } else {
      console.log('❌ Failed to verify order status');
    }

    console.log('\n🎉 Onboarding flow test completed successfully!');
    console.log('\nTo test the UI:');
    console.log(`1. Visit: ${BASE_URL}/onboarding?session_id=test-session-123`);
    console.log('2. Fill out the form and submit');
    console.log('3. Verify it redirects to success page');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testOnboardingFlow();
