import { PrismaClient } from '@prisma/client'

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
      ownerId: user.id,
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
        createdById: user.id,
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
        createdById: user.id,
      },
    }),
    prisma.client.upsert({
      where: { id: 'client_5c6d7e8f9g0h1i2j' },
      update: {},
      create: {
        id: 'client_5c6d7e8f9g0h1i2j',
        name: 'CloudScale Ventures',
        email: 'info@cloudscale-ventures.net',
        company: 'CloudScale Ventures LLC',
        workspaceId: workspace.id,
        createdById: user.id,
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
        status: 'ACTIVE',
        clientId: clients[0].id,
        workspaceId: workspace.id,
        createdById: user.id,
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
        createdById: user.id,
        dateOfPurchase: new Date('2024-01-12'),
      },
    }),
    prisma.domain.upsert({
      where: { id: 'dom_1a2b3c4d5e6f7g8h' },
      update: {},
      create: {
        id: 'dom_1a2b3c4d5e6f7g8h',
        name: 'cloudscale-ventures.net',
        redirectUrl: 'https://cloudscale-ventures.net/newsletter-signup',
        status: 'SUSPENDED',
        clientId: clients[2].id,
        workspaceId: workspace.id,
        createdById: user.id,
        dateOfPurchase: new Date('2024-01-10'),
      },
    }),
  ])

  // Create sample subscriptions
  const subscriptions = await Promise.all([
    prisma.subscription.upsert({
      where: { id: 'sub_8a9b2c3d4e5f6g7h' },
      update: {},
      create: {
        id: 'sub_8a9b2c3d4e5f6g7h',
        name: 'Professional Plan',
        status: 'ACTIVE',
        amount: 149.00,
        interval: 'MONTHLY',
        nextBilling: new Date('2024-02-15'),
        inboxesIncluded: 100,
        domainsIncluded: 15,
        workspaceId: workspace.id,
      },
    }),
    prisma.subscription.upsert({
      where: { id: 'sub_2b3c4d5e6f7g8h9i' },
      update: {},
      create: {
        id: 'sub_2b3c4d5e6f7g8h9i',
        name: 'Starter Plan',
        status: 'ACTIVE',
        amount: 49.00,
        interval: 'MONTHLY',
        nextBilling: new Date('2024-02-10'),
        inboxesIncluded: 25,
        domainsIncluded: 5,
        workspaceId: workspace.id,
      },
    }),
  ])

  // Create sample inboxes
  const inboxes = await Promise.all([
    prisma.inbox.upsert({
      where: { id: 'inb_7f8a9b2c1d3e4f5g' },
      update: {},
      create: {
        id: 'inb_7f8a9b2c1d3e4f5g',
        email: 'alex.johnson@techflow-solutions.com',
        status: 'ACTIVE',
        esp: 'GMAIL',
        domainId: domains[0].id,
        clientId: clients[0].id,
        workspaceId: workspace.id,
        createdById: user.id,
        subscriptionId: subscriptions[0].id,
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
        createdById: user.id,
        subscriptionId: subscriptions[1].id,
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
        name: 'Alex Johnson - CEO',
        role: 'Chief Executive Officer',
        bio: 'Leading TechFlow Solutions with 10+ years of experience in tech.',
        userId: user.id,
        inboxId: inboxes[0].id,
      },
    }),
    prisma.persona.upsert({
      where: { id: 'persona_2' },
      update: {},
      create: {
        id: 'persona_2',
        name: 'Support Team Lead',
        role: 'Customer Support',
        bio: 'Dedicated to providing excellent customer support.',
        userId: user.id,
        inboxId: inboxes[1].id,
      },
    }),
  ])

  // Create sample orders
  await Promise.all([
    prisma.order.upsert({
      where: { id: 'ord_7f8a9b2c1d3e4f5g' },
      update: {},
      create: {
        id: 'ord_7f8a9b2c1d3e4f5g',
        orderNumber: 'ORD-001',
        status: 'COMPLETED',
        inboxCount: 12,
        domainCount: 3,
        totalAmount: 149.00,
        clientId: clients[0].id,
        workspaceId: workspace.id,
        createdById: user.id,
        subscriptionId: subscriptions[0].id,
      },
    }),
  ])

  // Create sample sending accounts
  await Promise.all([
    prisma.sendingAccount.upsert({
      where: { id: 'sending_1' },
      update: {},
      create: {
        id: 'sending_1',
        name: 'Gmail Business',
        email: 'business@techflow-solutions.com',
        provider: 'Gmail',
        status: 'ACTIVE',
        dailyLimit: 500,
        usedToday: 127,
        userId: user.id,
      },
    }),
  ])

  // Create sample requests
  await Promise.all([
    prisma.request.upsert({
      where: { id: 'req_1' },
      update: {},
      create: {
        id: 'req_1',
        type: 'DOMAIN_SETUP',
        status: 'IN_PROGRESS',
        title: 'Domain Setup - techflow-solutions.com',
        description: 'Setting up new domain for lead capture',
        priority: 'HIGH',
        workspaceId: workspace.id,
        createdById: user.id,
        assignedToId: user.id,
      },
    }),
  ])

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
