const { PrismaClient } = require('@prisma/client');

async function createTestOrder() {
  const prisma = new PrismaClient();
  
  try {
    // Find or create a test user
    let user = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          fullName: 'Test User',
        },
      });
      console.log('Created user:', user);
    } else {
      console.log('Found existing user:', user);
    }

    // Find or create a test workspace
    let workspace = await prisma.workspace.findUnique({
      where: { slug: 'test-workspace' },
    });

    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: {
          name: 'Test Workspace',
          slug: 'test-workspace',
          ownerId: user.id,
        },
      });
      console.log('Created workspace:', workspace);
    } else {
      console.log('Found existing workspace:', workspace);
    }

    // Find or create a test order
    let order = await prisma.order.findUnique({
      where: { stripeSessionId: 'test123' },
    });

    if (!order) {
      order = await prisma.order.create({
        data: {
          workspaceId: workspace.id,
          stripeSessionId: 'test123',
          orderNumber: 'ORD-001',
          status: 'PENDING',
          totalAmount: 10000, // $100.00 in cents
          currency: 'usd',
          quantity: 1,
          inboxCount: 1,
          domainCount: 1,
          productId: 'prod_test',
          priceId: 'price_test',
        },
      });
      console.log('Created order:', order);
    } else {
      console.log('Found existing order:', order);
    }

    // Test the onboarding API
    const response = await fetch('http://localhost:3000/api/onboarding/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: 'test123',
        businessName: 'Test Company',
        businessType: 'saas',
        teamSize: '1-10',
        industry: 'Technology',
        customTags: ['startup', 'tech'],
        espPlatform: 'smartlead',
        stepCompleted: 5,
        isCompleted: true
      }),
    });

    const result = await response.json();
    console.log('Onboarding API response:', result);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestOrder();
