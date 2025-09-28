import { PrismaClient, InboxType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create a sample user
  const user = await prisma.user.upsert({
    where: { email: 'alex@example.com' },
    update: {},
    create: {
      email: 'alex@example.com',
      fullName: 'Alex Johnson',
      timezone: 'UTC',
    },
  })

  // Create a sample workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'techflow-solutions' },
    update: {},
    create: {
      name: 'TechFlow Solutions',
      slug: 'techflow-solutions',
      description: 'Main workspace for TechFlow Solutions',
      primaryUserId: user.id,
    },
  })

  // Add user to workspace
  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: user.id,
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: user.id,
      role: 'OWNER',
    },
  })

  // Create sample clients
  const clients = await Promise.all([
    prisma.client.upsert({
      where: { id: 'client_8a9b2c3d4e5f6g7h' },
      update: {},
      create: {
        id: 'client_8a9b2c3d4e5f6g7h',
        name: 'TechFlow Solutions',
        email: 'contact@techflow-solutions.com',
        company: 'TechFlow Solutions Inc.',
        workspaceId: workspace.id,
        productsBought: "[]",
      },
    }),
    prisma.client.upsert({
      where: { id: 'client_2b3c4d5e6f7g8h9i' },
      update: {},
      create: {
        id: 'client_2b3c4d5e6f7g8h9i',
        name: 'Innovate Digital',
        email: 'hello@innovate-digital.co',
        company: 'Innovate Digital Agency',
        workspaceId: workspace.id,
        productsBought: "[]",
      },
    }),
  ])

  // Create sample domains
  const domains = await Promise.all([
    prisma.domain.upsert({
      where: { id: 'dom_7f8a9b2c1d3e4f5g' },
      update: {},
      create: {
        id: 'dom_7f8a9b2c1d3e4f5g',
        name: 'techflow-solutions.com',
        redirectUrl: 'https://techflow-solutions.com/lead-capture',
        status: 'LIVE',
        clientId: clients[0].id,
        workspaceId: workspace.id,
        dateOfPurchase: new Date('2024-01-15'),
      },
    }),
    prisma.domain.upsert({
      where: { id: 'dom_9e8d7c6b5a4f3g2h' },
      update: {},
      create: {
        id: 'dom_9e8d7c6b5a4f3g2h',
        name: 'innovate-digital.co',
        redirectUrl: 'https://innovate-digital.co/contact-form',
        status: 'PENDING',
        clientId: clients[1].id,
        workspaceId: workspace.id,
        dateOfPurchase: new Date('2024-01-12'),
      },
    }),
  ])

  // Create sample orders
  const order = await prisma.order.upsert({
    where: { id: 'ord_7f8a9b2c1d3e4f5g' },
    update: {},
    create: {
      id: 'ord_7f8a9b2c1d3e4f5g',
      orderNumber: 'ORD-001',
      status: 'DELIVERED',
      inboxCount: 12,
      domainCount: 3,
      totalAmount: 14900, // $149.00 in cents
      quantity: 12,
      clientId: clients[0].id,
      workspaceId: workspace.id,
      productId: 'inbox_basic',
      priceId: 'price_inbox_basic',
      productsBought: '["inbox_basic"]',
      typesOfInboxes: '["GSUITE"]',
    },
  })

  // Create sample subscription
  const subscription = await prisma.subscription.upsert({
    where: { id: 'sub_8a9b2c3d4e5f6g7h' },
    update: {},
    create: {
      id: 'sub_8a9b2c3d4e5f6g7h',
      orderId: order.id,
      clientId: clients[0].id,
      workspaceId: workspace.id,
      stripeSubscriptionId: 'sub_stripe_123',
      status: 'ACTIVE',
      plan: 'PRO',
      billingPeriod: 'MONTHLY',
      amount: 149.00,
      startedAt: new Date('2024-01-15'),
    },
  })

  // Create sample inboxes
  const inboxes = await Promise.all([
    prisma.inbox.upsert({
      where: { id: 'inb_7f8a9b2c1d3e4f5g' },
      update: {},
      create: {
        id: 'inb_7f8a9b2c1d3e4f5g',
        email: 'alex.johnson@techflow-solutions.com',
        status: 'ACTIVE',
        esp: 'GSUITE',
        domainId: domains[0].id,
        clientId: clients[0].id,
        workspaceId: workspace.id,
        subscriptionId: subscription.id,
        stripeSubscriptionId: 'sub_stripe_123',
        tags: "[]",
      },
    }),
    prisma.inbox.upsert({
      where: { id: 'inb_9e8d7c6b5a4f3g2h' },
      update: {},
      create: {
        id: 'inb_9e8d7c6b5a4f3g2h',
        email: 'support@innovate-digital.co',
        status: 'PENDING',
        esp: 'OUTLOOK',
        domainId: domains[1].id,
        clientId: clients[1].id,
        workspaceId: workspace.id,
        tags: "[]",
      },
    }),
  ])

  // Create sample personas
  await Promise.all([
    prisma.persona.upsert({
      where: { id: 'persona_1' },
      update: {},
      create: {
        id: 'persona_1',
        fullName: 'Alex Johnson - CEO',
        firstName: 'Alex',
        lastName: 'Johnson',
        role: 'Chief Executive Officer',
        workspaceId: workspace.id,
        clientId: clients[0].id,
        inboxId: inboxes[0].id,
        userId: user.id,
        tags: "[]",
      },
    }),
    prisma.persona.upsert({
      where: { id: 'persona_2' },
      update: {},
      create: {
        id: 'persona_2',
        fullName: 'Support Team Lead',
        firstName: 'Support',
        lastName: 'Team',
        role: 'Customer Support',
        workspaceId: workspace.id,
        clientId: clients[1].id,
        inboxId: inboxes[1].id,
        userId: user.id,
        tags: "[]",
      },
    }),
  ])

  // Create sample sending accounts
  await prisma.sendingAccount.upsert({
    where: { id: 'sending_1' },
    update: {},
    create: {
      id: 'sending_1',
      label: 'Gmail Business',
      username: 'business@techflow-solutions.com',
      workspaceId: workspace.id,
      clientId: clients[0].id,
      userId: user.id,
      software: 'SMARTLEAD',
      status: 'CONNECTED',
    },
  })

  // Create sample requests
  await prisma.request.upsert({
    where: { id: 'req_1' },
    update: {},
    create: {
      id: 'req_1',
      type: 'DOMAIN_ISSUE',
      status: 'IN_PROGRESS',
      title: 'Domain Setup - techflow-solutions.com',
      description: 'Setting up new domain for lead capture',
      priority: 'HIGH',
      workspaceId: workspace.id,
      submittedBy: user.id,
      assigneeId: user.id,
    },
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })