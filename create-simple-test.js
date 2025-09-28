const { PrismaClient } = require('@prisma/client');

async function createSimpleTest() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Creating simple test data...');

    // Create a test user
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        fullName: 'Test User',
        name: 'Test User',
      },
    });
    console.log('✅ User created/found:', user.email);

    // Create a test workspace
    const workspace = await prisma.workspace.upsert({
      where: { slug: 'test-workspace' },
      update: {},
      create: {
        name: 'Test Workspace',
        slug: 'test-workspace',
        primaryUserId: user.id,
      },
    });
    console.log('✅ Workspace created/found:', workspace.name);

    // Create a test order directly
    const order = await prisma.order.upsert({
      where: { stripeSessionId: 'cs_test_b1rv9LJzEcVgMEpnCzj86xkaiwzh2IkdL0VgL2fP9n0F34pDeZ63VHCRYY' },
      update: {},
      create: {
        workspaceId: workspace.id,
        clientId: 'test-client-id', // We'll create this separately
        orderNumber: 'ORD-001',
        stripeSessionId: 'cs_test_b1rv9LJzEcVgMEpnCzj86xkaiwzh2IkdL0VgL2fP9n0F34pDeZ63VHCRYY',
        status: 'PLACED',
        totalAmount: 10000, // $100.00 in cents
        currency: 'usd',
        quantity: 1,
        inboxCount: 1,
        domainCount: 1,
        productId: 'prod_test',
        priceId: 'price_test',
        productsBought: JSON.stringify(['inbox-basic']),
        typesOfInboxes: JSON.stringify(['GSUITE']),
      },
    });
    console.log('✅ Order created/found:', order.orderNumber);

    console.log('\n🎉 Test data created successfully!');
    console.log('You can now test the onboarding API with session ID: cs_test_b1rv9LJzEcVgMEpnCzj86xkaiwzh2IkdL0VgL2fP9n0F34pDeZ63VHCRYY');

  } catch (error) {
    console.error('❌ Error creating test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSimpleTest();
