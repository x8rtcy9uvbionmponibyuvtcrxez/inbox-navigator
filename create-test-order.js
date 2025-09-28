const { PrismaClient } = require('@prisma/client');

async function createTestOrder() {
  console.log('🔧 Creating test order for API testing...');
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });

  try {
    // Create a test user
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        name: 'Test User',
        fullName: 'Test User'
      }
    });
    console.log('✅ User created/found:', user.id);

    // Create a test workspace
    const workspace = await prisma.workspace.upsert({
      where: { slug: 'test-workspace' },
      update: {},
      create: {
        name: 'Test Workspace',
        slug: 'test-workspace',
        primaryUserId: user.id
      }
    });
    console.log('✅ Workspace created/found:', workspace.id);

    // Create a test client
    const client = await prisma.client.upsert({
      where: { 
        workspaceId_name: {
          workspaceId: workspace.id,
          name: 'Test Client'
        }
      },
      update: {},
      create: {
        workspaceId: workspace.id,
        name: 'Test Client',
        email: 'client@example.com'
      }
    });
    console.log('✅ Client created/found:', client.id);

    // Create a test order
    const order = await prisma.order.upsert({
      where: { stripeSessionId: 'test123' },
      update: {},
      create: {
        workspaceId: workspace.id,
        clientId: client.id,
        orderNumber: 'ORD-001',
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
    console.log('✅ Order created/found:', order.id);

    console.log('🎉 Test data created successfully!');
    console.log('📝 You can now test the onboarding API with sessionId: test123');

  } catch (error) {
    console.error('❌ Error creating test data:', error.message);
    console.error('Error details:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestOrder();
