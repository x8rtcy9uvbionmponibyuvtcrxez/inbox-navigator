// Sample data for freemium demo experience
export const sampleDomains = [
  {
    id: 'demo_domain_1',
    name: 'example.com',
    status: 'active',
    dnsVerified: true,
    createdAt: new Date('2024-01-15'),
    description: 'Main company domain'
  },
  {
    id: 'demo_domain_2', 
    name: 'demo-corp.com',
    status: 'active',
    dnsVerified: true,
    createdAt: new Date('2024-01-20'),
    description: 'Demo corporation domain'
  },
  {
    id: 'demo_domain_3',
    name: 'test-company.org',
    status: 'pending',
    dnsVerified: false,
    createdAt: new Date('2024-01-25'),
    description: 'Test organization domain'
  },
  {
    id: 'demo_domain_4',
    name: 'startup-io.com',
    status: 'active',
    dnsVerified: true,
    createdAt: new Date('2024-02-01'),
    description: 'Startup domain for testing'
  },
  {
    id: 'demo_domain_5',
    name: 'enterprise.net',
    status: 'suspended',
    dnsVerified: false,
    createdAt: new Date('2024-02-05'),
    description: 'Enterprise domain (suspended)'
  }
];

export const sampleInboxes = [
  {
    id: 'demo_inbox_1',
    name: 'support@example.com',
    domain: 'example.com',
    persona: 'Customer Support',
    status: 'active',
    emailCount: 1247,
    lastActivity: new Date('2024-01-28'),
    description: 'Main support inbox'
  },
  {
    id: 'demo_inbox_2',
    name: 'sales@demo-corp.com',
    domain: 'demo-corp.com',
    persona: 'Sales Team',
    status: 'active',
    emailCount: 892,
    lastActivity: new Date('2024-01-27'),
    description: 'Sales inquiries'
  },
  {
    id: 'demo_inbox_3',
    name: 'info@test-company.org',
    domain: 'test-company.org',
    persona: 'General Info',
    status: 'pending',
    emailCount: 0,
    lastActivity: null,
    description: 'General information'
  },
  {
    id: 'demo_inbox_4',
    name: 'hello@startup-io.com',
    domain: 'startup-io.com',
    persona: 'Founder',
    status: 'active',
    emailCount: 456,
    lastActivity: new Date('2024-01-26'),
    description: 'Founder direct contact'
  },
  {
    id: 'demo_inbox_5',
    name: 'billing@example.com',
    domain: 'example.com',
    persona: 'Finance Team',
    status: 'active',
    emailCount: 234,
    lastActivity: new Date('2024-01-25'),
    description: 'Billing inquiries'
  },
  {
    id: 'demo_inbox_6',
    name: 'partnerships@demo-corp.com',
    domain: 'demo-corp.com',
    persona: 'Business Development',
    status: 'active',
    emailCount: 678,
    lastActivity: new Date('2024-01-24'),
    description: 'Partnership opportunities'
  },
  {
    id: 'demo_inbox_7',
    name: 'press@startup-io.com',
    domain: 'startup-io.com',
    persona: 'PR Team',
    status: 'active',
    emailCount: 123,
    lastActivity: new Date('2024-01-23'),
    description: 'Press inquiries'
  },
  {
    id: 'demo_inbox_8',
    name: 'careers@example.com',
    domain: 'example.com',
    persona: 'HR Team',
    status: 'active',
    emailCount: 345,
    lastActivity: new Date('2024-01-22'),
    description: 'Job applications'
  },
  {
    id: 'demo_inbox_9',
    name: 'dev@test-company.org',
    domain: 'test-company.org',
    persona: 'Development Team',
    status: 'pending',
    emailCount: 0,
    lastActivity: null,
    description: 'Development inquiries'
  },
  {
    id: 'demo_inbox_10',
    name: 'legal@demo-corp.com',
    domain: 'demo-corp.com',
    persona: 'Legal Team',
    status: 'active',
    emailCount: 89,
    lastActivity: new Date('2024-01-21'),
    description: 'Legal matters'
  },
  {
    id: 'demo_inbox_11',
    name: 'marketing@startup-io.com',
    domain: 'startup-io.com',
    persona: 'Marketing Team',
    status: 'active',
    emailCount: 567,
    lastActivity: new Date('2024-01-20'),
    description: 'Marketing campaigns'
  },
  {
    id: 'demo_inbox_12',
    name: 'admin@example.com',
    domain: 'example.com',
    persona: 'Administration',
    status: 'active',
    emailCount: 234,
    lastActivity: new Date('2024-01-19'),
    description: 'Administrative tasks'
  },
  {
    id: 'demo_inbox_13',
    name: 'feedback@demo-corp.com',
    domain: 'demo-corp.com',
    persona: 'Product Team',
    status: 'active',
    emailCount: 156,
    lastActivity: new Date('2024-01-18'),
    description: 'Product feedback'
  },
  {
    id: 'demo_inbox_14',
    name: 'investors@startup-io.com',
    domain: 'startup-io.com',
    persona: 'Executive Team',
    status: 'active',
    emailCount: 78,
    lastActivity: new Date('2024-01-17'),
    description: 'Investor relations'
  },
  {
    id: 'demo_inbox_15',
    name: 'api@test-company.org',
    domain: 'test-company.org',
    persona: 'API Support',
    status: 'pending',
    emailCount: 0,
    lastActivity: null,
    description: 'API support requests'
  }
];

export const sampleOrders = [
  {
    id: 'demo_order_1',
    workspaceId: 'demo_workspace',
    clientId: 'demo_client_1',
    status: 'completed',
    totalAmount: 299.99,
    currency: 'USD',
    createdAt: new Date('2024-01-15'),
    completedAt: new Date('2024-01-16'),
    description: 'Premium Inbox Package - 5 inboxes',
    items: [
      { name: 'Premium Inbox', quantity: 5, price: 59.99 }
    ]
  },
  {
    id: 'demo_order_2',
    workspaceId: 'demo_workspace',
    clientId: 'demo_client_2',
    status: 'processing',
    totalAmount: 149.99,
    currency: 'USD',
    createdAt: new Date('2024-01-20'),
    completedAt: null,
    description: 'Standard Inbox Package - 3 inboxes',
    items: [
      { name: 'Standard Inbox', quantity: 3, price: 49.99 }
    ]
  },
  {
    id: 'demo_order_3',
    workspaceId: 'demo_workspace',
    clientId: 'demo_client_3',
    status: 'pending',
    totalAmount: 99.99,
    currency: 'USD',
    createdAt: new Date('2024-01-25'),
    completedAt: null,
    description: 'Basic Inbox Package - 2 inboxes',
    items: [
      { name: 'Basic Inbox', quantity: 2, price: 49.99 }
    ]
  }
];

export const sampleClients = [
  {
    id: 'demo_client_1',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    description: 'Enterprise client'
  },
  {
    id: 'demo_client_2',
    name: 'TechStart Inc',
    email: 'hello@techstart.com',
    status: 'active',
    createdAt: new Date('2024-01-12'),
    description: 'Startup client'
  },
  {
    id: 'demo_client_3',
    name: 'Global Solutions Ltd',
    email: 'info@globalsolutions.com',
    status: 'pending',
    createdAt: new Date('2024-01-18'),
    description: 'International client'
  }
];

export const samplePersonas = [
  {
    id: 'demo_persona_1',
    name: 'Customer Support',
    description: 'Friendly and helpful customer service representative',
    tone: 'Professional and empathetic',
    responseStyle: 'Detailed and solution-oriented'
  },
  {
    id: 'demo_persona_2',
    name: 'Sales Team',
    description: 'Enthusiastic sales professional focused on conversions',
    tone: 'Confident and persuasive',
    responseStyle: 'Direct and value-focused'
  },
  {
    id: 'demo_persona_3',
    name: 'Technical Support',
    description: 'Expert technical support specialist',
    tone: 'Knowledgeable and patient',
    responseStyle: 'Technical and step-by-step'
  },
  {
    id: 'demo_persona_4',
    name: 'Executive Team',
    description: 'Senior executive handling high-level communications',
    tone: 'Authoritative and strategic',
    responseStyle: 'Concise and decision-focused'
  }
];

// Helper function to get sample data for a workspace
export function getSampleDataForWorkspace(workspaceId: string) {
  return {
    domains: sampleDomains.map(domain => ({ ...domain, workspaceId })),
    inboxes: sampleInboxes.map(inbox => ({ ...inbox, workspaceId })),
    orders: sampleOrders.map(order => ({ ...order, workspaceId })),
    clients: sampleClients.map(client => ({ ...client, workspaceId })),
    personas: samplePersonas.map(persona => ({ ...persona, workspaceId }))
  };
}
