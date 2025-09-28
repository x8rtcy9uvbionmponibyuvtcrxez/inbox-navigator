import { prisma } from './prisma'
import { 
  User, 
  Workspace, 
  Client, 
  Domain, 
  Inbox, 
  Order, 
  Subscription, 
  Persona, 
  SendingAccount, 
  Request,
  DomainStatus,
  InboxStatus,
  OrderStatus,
  SubscriptionStatus,
  RequestStatus,
  ESP,
  Role
} from '@prisma/client'

// User queries
export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      workspaces: {
        include: {
          workspace: true
        }
      }
    }
  })
}

export const createUser = async (data: {
  email: string
  fullName?: string
  avatarUrl?: string
  timezone?: string
}) => {
  return await prisma.user.create({
    data
  })
}

// Workspace queries
export const getWorkspaceBySlug = async (slug: string) => {
  return await prisma.workspace.findUnique({
    where: { slug },
    include: {
      owner: true,
      members: {
        include: {
          user: true
        }
      }
    }
  })
}

export const getUserWorkspaces = async (userId: string) => {
  return await prisma.workspaceMember.findMany({
    where: { userId },
    include: {
      workspace: {
        include: {
          owner: true,
          _count: {
            select: {
              members: true,
              clients: true,
              domains: true,
              inboxes: true
            }
          }
        }
      }
    }
  })
}

// Client queries
export const getClientsByWorkspace = async (workspaceId: string) => {
  return await prisma.client.findMany({
    where: { workspaceId },
    include: {
      createdBy: true,
      _count: {
        select: {
          domains: true,
          inboxes: true,
          orders: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export const createClient = async (data: {
  name: string
  email?: string
  company?: string
  phone?: string
  address?: string
  workspaceId: string
  createdById: string
}) => {
  return await prisma.client.create({
    data,
    include: {
      createdBy: true
    }
  })
}

// Domain queries
export const getDomainsByWorkspace = async (workspaceId: string, filters?: {
  status?: DomainStatus
  clientId?: string
  search?: string
}) => {
  const where: Record<string, unknown> = { workspaceId }
  
  if (filters?.status) {
    where.status = filters.status
  }
  
  if (filters?.clientId) {
    where.clientId = filters.clientId
  }
  
  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { redirectUrl: { contains: filters.search, mode: 'insensitive' } },
      { client: { name: { contains: filters.search, mode: 'insensitive' } } }
    ]
  }

  return await prisma.domain.findMany({
    where,
    include: {
      client: true,
      createdBy: true,
      _count: {
        select: {
          inboxes: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export const createDomain = async (data: {
  name: string
  redirectUrl: string
  status?: DomainStatus
  clientId: string
  workspaceId: string
  createdById: string
  dateOfPurchase: Date
}) => {
  return await prisma.domain.create({
    data,
    include: {
      client: true,
      createdBy: true
    }
  })
}

// Inbox queries
export const getInboxesByWorkspace = async (workspaceId: string, filters?: {
  status?: InboxStatus
  esp?: ESP
  domainId?: string
  clientId?: string
  search?: string
}) => {
  const where: Record<string, unknown> = { workspaceId }
  
  if (filters?.status) {
    where.status = filters.status
  }
  
  if (filters?.esp) {
    where.esp = filters.esp
  }
  
  if (filters?.domainId) {
    where.domainId = filters.domainId
  }
  
  if (filters?.clientId) {
    where.clientId = filters.clientId
  }
  
  if (filters?.search) {
    where.OR = [
      { email: { contains: filters.search, mode: 'insensitive' } },
      { persona: { name: { contains: filters.search, mode: 'insensitive' } } },
      { domain: { name: { contains: filters.search, mode: 'insensitive' } } },
      { client: { name: { contains: filters.search, mode: 'insensitive' } } }
    ]
  }

  return await prisma.inbox.findMany({
    where,
    include: {
      domain: true,
      client: true,
      createdBy: true,
      subscription: true,
      persona: true
    },
    orderBy: { createdAt: 'desc' }
  })
}

export const createInbox = async (data: {
  email: string
  status?: InboxStatus
  esp?: ESP
  domainId: string
  clientId: string
  workspaceId: string
  createdById: string
  subscriptionId?: string
}) => {
  return await prisma.inbox.create({
    data,
    include: {
      domain: true,
      client: true,
      createdBy: true,
      subscription: true
    }
  })
}

// Order queries
export const getOrdersByWorkspace = async (workspaceId: string, filters?: {
  status?: OrderStatus
  clientId?: string
  search?: string
}) => {
  const where: Record<string, unknown> = { workspaceId }
  
  if (filters?.status) {
    where.status = filters.status
  }
  
  if (filters?.clientId) {
    where.clientId = filters.clientId
  }
  
  if (filters?.search) {
    where.OR = [
      { orderNumber: { contains: filters.search, mode: 'insensitive' } },
      { client: { name: { contains: filters.search, mode: 'insensitive' } } }
    ]
  }

  return await prisma.order.findMany({
    where,
    include: {
      client: true,
      createdBy: true,
      subscription: true
    },
    orderBy: { createdAt: 'desc' }
  })
}

// Subscription queries
export const getSubscriptionsByWorkspace = async (workspaceId: string, filters?: {
  status?: SubscriptionStatus
}) => {
  const where: Record<string, unknown> = { workspaceId }
  
  if (filters?.status) {
    where.status = filters.status
  }

  return await prisma.subscription.findMany({
    where,
    include: {
      _count: {
        select: {
          inboxes: true,
          orders: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

// Request queries
export const getRequestsByWorkspace = async (workspaceId: string, filters?: {
  status?: RequestStatus
  assignedToId?: string
  type?: string
}) => {
  const where: Record<string, unknown> = { workspaceId }
  
  if (filters?.status) {
    where.status = filters.status
  }
  
  if (filters?.assignedToId) {
    where.assignedToId = filters.assignedToId
  }
  
  if (filters?.type) {
    where.type = filters.type
  }

  return await prisma.request.findMany({
    where,
    include: {
      createdBy: true,
      assignedTo: true
    },
    orderBy: { submittedOn: 'desc' }
  })
}

// Dashboard statistics
export const getDashboardStats = async (workspaceId: string) => {
  const [domainsCount, inboxesCount, activeSubscriptions, recentOrders] = await Promise.all([
    prisma.domain.count({
      where: { 
        workspaceId,
        status: 'ACTIVE'
      }
    }),
    prisma.inbox.count({
      where: { 
        workspaceId,
        status: 'ACTIVE'
      }
    }),
    prisma.subscription.count({
      where: { 
        workspaceId,
        status: 'ACTIVE'
      }
    }),
    prisma.order.findMany({
      where: { workspaceId },
      take: 5,
      include: {
        client: true,
        subscription: true
      },
      orderBy: { createdAt: 'desc' }
    })
  ])

  return {
    domainsCount,
    inboxesCount,
    activeSubscriptions,
    recentOrders
  }
}

// Bulk operations
export const bulkUpdateDomains = async (domainIds: string[], updates: Partial<Domain>) => {
  return await prisma.domain.updateMany({
    where: { id: { in: domainIds } },
    data: updates
  })
}

export const bulkUpdateInboxes = async (inboxIds: string[], updates: Partial<Inbox>) => {
  return await prisma.inbox.updateMany({
    where: { id: { in: inboxIds } },
    data: updates
  })
}

export const bulkDeleteDomains = async (domainIds: string[]) => {
  return await prisma.domain.deleteMany({
    where: { id: { in: domainIds } }
  })
}

export const bulkDeleteInboxes = async (inboxIds: string[]) => {
  return await prisma.inbox.deleteMany({
    where: { id: { in: inboxIds } }
  })
}
