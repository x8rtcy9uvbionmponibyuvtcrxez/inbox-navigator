const { PrismaClient } = require('@prisma/client');

async function testSimple() {
  console.log('🔍 Testing simple database operations...');
  
  const prisma = new PrismaClient();

  try {
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test user creation
    console.log('👤 Testing user creation...');
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        fullName: 'Test User'
      }
    });
    console.log('✅ User created:', user.id);
    
    // Test workspace creation
    console.log('🏢 Testing workspace creation...');
    const workspace = await prisma.workspace.create({
      data: {
        name: 'Test Workspace',
        slug: 'test-workspace-' + Date.now(),
        primaryUserId: user.id
      }
    });
    console.log('✅ Workspace created:', workspace.id);
    
    // Test client creation
    console.log('👥 Testing client creation...');
    const client = await prisma.client.create({
      data: {
        workspaceId: workspace.id,
        name: 'Test Client',
        email: 'client@example.com'
      }
    });
    console.log('✅ Client created:', client.id);
    
    // Test order creation
    console.log('📦 Testing order creation...');
    const order = await prisma.order.create({
      data: {
        workspaceId: workspace.id,
        clientId: client.id,
        orderNumber: 'ORD-' + Date.now(),
        totalAmount: 10000,
        quantity: 1,
        inboxCount: 1,
        domainCount: 1,
        productId: 'prod_test',
        priceId: 'price_test',
        productsBought: ['inbox'],
        typesOfInboxes: ['GSUITE']
      }
    });
    console.log('✅ Order created:', order.id);
    
    // Test onboarding data creation
    console.log('🚀 Testing onboarding data creation...');
    const onboardingData = await prisma.onboardingData.create({
      data: {
        workspaceId: workspace.id,
        orderId: order.id,
        businessType: 'SaaS',
        industry: 'Software',
        companySize: '1-10',
        website: 'https://test.com',
        preferredDomains: ['test.com'],
        stepCompleted: 5,
        isCompleted: true
      }
    });
    console.log('✅ Onboarding data created:', onboardingData.id);
    
    console.log('🎉 All database operations successful!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Error details:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSimple();
