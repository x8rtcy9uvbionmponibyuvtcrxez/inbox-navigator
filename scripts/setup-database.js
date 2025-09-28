const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('Setting up database tables...');
  
  try {
    // Create users table
    console.log('Creating users table...');
    await supabase.rpc('exec', {
      query: `
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          email TEXT UNIQUE NOT NULL,
          full_name TEXT,
          avatar_url TEXT,
          timezone TEXT DEFAULT 'UTC',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    // Create workspaces table
    console.log('Creating workspaces table...');
    await supabase.rpc('exec', {
      query: `
        CREATE TABLE IF NOT EXISTS workspaces (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          name TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          description TEXT,
          owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    // Create workspace_members table
    console.log('Creating workspace_members table...');
    await supabase.rpc('exec', {
      query: `
        CREATE TABLE IF NOT EXISTS workspace_members (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          role TEXT NOT NULL DEFAULT 'MEMBER' CHECK (role IN ('OWNER', 'ADMIN', 'MEMBER')),
          joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(workspace_id, user_id)
        );
      `
    });

    // Create clients table
    console.log('Creating clients table...');
    await supabase.rpc('exec', {
      query: `
        CREATE TABLE IF NOT EXISTS clients (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          name TEXT NOT NULL,
          email TEXT,
          company TEXT,
          phone TEXT,
          address TEXT,
          workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
          created_by_id TEXT NOT NULL REFERENCES users(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    // Create domains table
    console.log('Creating domains table...');
    await supabase.rpc('exec', {
      query: `
        CREATE TABLE IF NOT EXISTS domains (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          name TEXT UNIQUE NOT NULL,
          redirect_url TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('ACTIVE', 'PENDING', 'SUSPENDED', 'EXPIRED')),
          client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
          workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
          created_by_id TEXT NOT NULL REFERENCES users(id),
          date_of_purchase TIMESTAMP WITH TIME ZONE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    // Create inboxes table
    console.log('Creating inboxes table...');
    await supabase.rpc('exec', {
      query: `
        CREATE TABLE IF NOT EXISTS inboxes (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          email TEXT UNIQUE NOT NULL,
          status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('ACTIVE', 'PENDING', 'SUSPENDED', 'EXPIRED')),
          esp TEXT NOT NULL DEFAULT 'GMAIL' CHECK (esp IN ('GMAIL', 'OUTLOOK', 'YAHOO', 'APPLE_MAIL', 'CUSTOM_SMTP')),
          domain_id TEXT NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
          client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
          workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
          created_by_id TEXT NOT NULL REFERENCES users(id),
          subscription_id TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    // Create orders table
    console.log('Creating orders table...');
    await supabase.rpc('exec', {
      query: `
        CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          order_number TEXT UNIQUE NOT NULL,
          status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'FAILED')),
          inbox_count INTEGER NOT NULL,
          domain_count INTEGER NOT NULL,
          total_amount DECIMAL NOT NULL,
          client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
          workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
          created_by_id TEXT NOT NULL REFERENCES users(id),
          subscription_id TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    // Create subscriptions table
    console.log('Creating subscriptions table...');
    await supabase.rpc('exec', {
      query: `
        CREATE TABLE IF NOT EXISTS subscriptions (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          name TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CANCELLED', 'PAUSED', 'EXPIRED')),
          amount DECIMAL NOT NULL,
          interval TEXT NOT NULL DEFAULT 'MONTHLY' CHECK (interval IN ('MONTHLY', 'YEARLY')),
          next_billing TIMESTAMP WITH TIME ZONE NOT NULL,
          inboxes_included INTEGER NOT NULL,
          domains_included INTEGER NOT NULL,
          workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    // Create personas table
    console.log('Creating personas table...');
    await supabase.rpc('exec', {
      query: `
        CREATE TABLE IF NOT EXISTS personas (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          name TEXT NOT NULL,
          role TEXT,
          bio TEXT,
          avatar_url TEXT,
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          inbox_id TEXT UNIQUE REFERENCES inboxes(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    // Create sending_accounts table
    console.log('Creating sending_accounts table...');
    await supabase.rpc('exec', {
      query: `
        CREATE TABLE IF NOT EXISTS sending_accounts (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          provider TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
          daily_limit INTEGER NOT NULL,
          used_today INTEGER NOT NULL DEFAULT 0,
          credentials JSONB,
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    // Create requests table
    console.log('Creating requests table...');
    await supabase.rpc('exec', {
      query: `
        CREATE TABLE IF NOT EXISTS requests (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          type TEXT NOT NULL CHECK (type IN ('DOMAIN_SETUP', 'INBOX_CREATION', 'BILLING_QUERY', 'TECHNICAL_SUPPORT', 'FEATURE_REQUEST', 'BUG_REPORT')),
          status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
          title TEXT NOT NULL,
          description TEXT,
          priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
          workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
          created_by_id TEXT NOT NULL REFERENCES users(id),
          assigned_to_id TEXT REFERENCES users(id),
          submitted_on TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          resolved_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    // Add foreign key constraints for subscriptions
    console.log('Adding subscription foreign keys...');
    await supabase.rpc('exec', {
      query: `
        ALTER TABLE inboxes ADD CONSTRAINT fk_inboxes_subscription FOREIGN KEY (subscription_id) REFERENCES subscriptions(id);
        ALTER TABLE orders ADD CONSTRAINT fk_orders_subscription FOREIGN KEY (subscription_id) REFERENCES subscriptions(id);
      `
    });

    // Add foreign key constraints for requests
    console.log('Adding request foreign keys...');
    await supabase.rpc('exec', {
      query: `
        ALTER TABLE requests ADD CONSTRAINT fk_requests_created_by FOREIGN KEY (created_by_id) REFERENCES users(id);
        ALTER TABLE requests ADD CONSTRAINT fk_requests_assigned_to FOREIGN KEY (assigned_to_id) REFERENCES users(id);
      `
    });

    // Create indexes for better performance
    console.log('Creating indexes...');
    await supabase.rpc('exec', {
      query: `
        CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_id ON workspace_members(workspace_id);
        CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON workspace_members(user_id);
        CREATE INDEX IF NOT EXISTS idx_clients_workspace_id ON clients(workspace_id);
        CREATE INDEX IF NOT EXISTS idx_domains_workspace_id ON domains(workspace_id);
        CREATE INDEX IF NOT EXISTS idx_domains_client_id ON domains(client_id);
        CREATE INDEX IF NOT EXISTS idx_inboxes_workspace_id ON inboxes(workspace_id);
        CREATE INDEX IF NOT EXISTS idx_inboxes_client_id ON inboxes(client_id);
        CREATE INDEX IF NOT EXISTS idx_inboxes_domain_id ON inboxes(domain_id);
        CREATE INDEX IF NOT EXISTS idx_orders_workspace_id ON orders(workspace_id);
        CREATE INDEX IF NOT EXISTS idx_orders_client_id ON orders(client_id);
        CREATE INDEX IF NOT EXISTS idx_subscriptions_workspace_id ON subscriptions(workspace_id);
        CREATE INDEX IF NOT EXISTS idx_personas_user_id ON personas(user_id);
        CREATE INDEX IF NOT EXISTS idx_sending_accounts_user_id ON sending_accounts(user_id);
        CREATE INDEX IF NOT EXISTS idx_requests_workspace_id ON requests(workspace_id);
        CREATE INDEX IF NOT EXISTS idx_requests_created_by_id ON requests(created_by_id);
        CREATE INDEX IF NOT EXISTS idx_requests_assigned_to_id ON requests(assigned_to_id);
      `
    });

    // Enable Row Level Security (RLS) for all tables
    console.log('Enabling Row Level Security...');
    await supabase.rpc('exec', {
      query: `
        ALTER TABLE users ENABLE ROW LEVEL SECURITY;
        ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
        ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
        ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
        ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
        ALTER TABLE inboxes ENABLE ROW LEVEL SECURITY;
        ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
        ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
        ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
        ALTER TABLE sending_accounts ENABLE ROW LEVEL SECURITY;
        ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
      `
    });

    console.log('✅ Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
