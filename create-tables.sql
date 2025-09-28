-- ============================================================================
-- INBOX NAVIGATOR - COMPREHENSIVE DATABASE SCHEMA
-- ============================================================================

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS onboarding_data CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS requests CASCADE;
DROP TABLE IF EXISTS sending_accounts CASCADE;
DROP TABLE IF EXISTS personas CASCADE;
DROP TABLE IF EXISTS inboxes CASCADE;
DROP TABLE IF EXISTS domains CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS workspace_members CASCADE;
DROP TABLE IF EXISTS workspaces CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing enums if they exist
DROP TYPE IF EXISTS role CASCADE;
DROP TYPE IF EXISTS client_status CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS subscription_status CASCADE;
DROP TYPE IF EXISTS subscription_plan CASCADE;
DROP TYPE IF EXISTS billing_period CASCADE;
DROP TYPE IF EXISTS domain_status CASCADE;
DROP TYPE IF EXISTS inbox_status CASCADE;
DROP TYPE IF EXISTS inbox_esp CASCADE;
DROP TYPE IF EXISTS inbox_type CASCADE;
DROP TYPE IF EXISTS warmup_status CASCADE;
DROP TYPE IF EXISTS sending_software CASCADE;
DROP TYPE IF EXISTS sending_account_status CASCADE;
DROP TYPE IF EXISTS request_type CASCADE;
DROP TYPE IF EXISTS request_status CASCADE;
DROP TYPE IF EXISTS priority CASCADE;

-- ============================================================================
-- CREATE ENUMS
-- ============================================================================

CREATE TYPE role AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'VIEWER');
CREATE TYPE client_status AS ENUM ('ACTIVE', 'PAUSED', 'INACTIVE');
CREATE TYPE order_status AS ENUM ('PLACED', 'PROCESSING', 'DELIVERED', 'CANCELLED', 'REFUNDED');
CREATE TYPE subscription_status AS ENUM ('ACTIVE', 'CANCELLED', 'PAUSED', 'EXPIRED');
CREATE TYPE subscription_plan AS ENUM ('BASIC', 'PRO', 'ENTERPRISE');
CREATE TYPE billing_period AS ENUM ('MONTHLY', 'YEARLY');
CREATE TYPE domain_status AS ENUM ('PENDING', 'LIVE', 'FAILED', 'EXPIRED');
CREATE TYPE inbox_status AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED', 'DELETED');
CREATE TYPE inbox_esp AS ENUM ('GSUITE', 'OUTLOOK', 'OTHER');
CREATE TYPE inbox_type AS ENUM ('GSUITE', 'OUTLOOK', 'CUSTOM');
CREATE TYPE warmup_status AS ENUM ('ON', 'OFF', 'PAUSED');
CREATE TYPE sending_software AS ENUM ('SMARTLEAD', 'INSTANTLY', 'MAILREACH', 'LEMWARM', 'OTHER');
CREATE TYPE sending_account_status AS ENUM ('CONNECTED', 'FAILED', 'DISCONNECTED');
CREATE TYPE request_type AS ENUM ('REPLACE_INBOX', 'CHANGE_NAME', 'RECONNECT', 'DOMAIN_ISSUE', 'BILLING_ISSUE', 'OTHER');
CREATE TYPE request_status AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- ============================================================================
-- CREATE TABLES
-- ============================================================================

-- Users table
CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    full_name TEXT,
    password_hash TEXT,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'UTC',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Workspaces table
CREATE TABLE workspaces (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    primary_user_id TEXT NOT NULL REFERENCES users(id),
    slack_channel_id TEXT,
    primary_clickup_task_id TEXT,
    main_drive_folder_url TEXT,
    main_sheet_url TEXT,
    subscription_status TEXT DEFAULT 'free',
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Workspace members table
CREATE TABLE workspace_members (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role role DEFAULT 'MEMBER',
    joined_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(workspace_id, user_id)
);

-- Clients table
CREATE TABLE clients (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    workspace_id TEXT NOT NULL REFERENCES workspaces(id),
    name TEXT NOT NULL,
    email TEXT,
    company TEXT,
    website TEXT,
    address TEXT,
    status client_status DEFAULT 'ACTIVE',
    stripe_customer_id TEXT,
    onboarding_form_submission_id TEXT,
    active_inboxes_count INTEGER DEFAULT 0,
    lifetime_inboxes_count INTEGER DEFAULT 0,
    total_gsuite INTEGER DEFAULT 0,
    total_outlook INTEGER DEFAULT 0,
    products_bought TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    workspace_id TEXT NOT NULL REFERENCES workspaces(id),
    client_id TEXT NOT NULL REFERENCES clients(id),
    order_number TEXT UNIQUE NOT NULL,
    assignee TEXT,
    stripe_session_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    status order_status DEFAULT 'PLACED',
    total_amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'usd',
    quantity INTEGER NOT NULL,
    inbox_count INTEGER NOT NULL,
    domain_count INTEGER NOT NULL,
    product_id TEXT NOT NULL,
    price_id TEXT NOT NULL,
    products_bought TEXT[],
    types_of_inboxes inbox_type[],
    order_date TIMESTAMP DEFAULT NOW(),
    fulfilled_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    order_id TEXT UNIQUE NOT NULL REFERENCES orders(id),
    client_id TEXT NOT NULL REFERENCES clients(id),
    workspace_id TEXT NOT NULL REFERENCES workspaces(id),
    stripe_subscription_id TEXT NOT NULL,
    status subscription_status DEFAULT 'ACTIVE',
    plan subscription_plan DEFAULT 'BASIC',
    billing_period billing_period DEFAULT 'MONTHLY',
    amount DECIMAL(10,2) NOT NULL,
    started_at TIMESTAMP NOT NULL,
    cancels_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Domains table
CREATE TABLE domains (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    workspace_id TEXT NOT NULL REFERENCES workspaces(id),
    client_id TEXT REFERENCES clients(id),
    name TEXT UNIQUE NOT NULL,
    redirect_url TEXT,
    date_of_purchase TIMESTAMP,
    dns_record_id TEXT,
    bought_by_inbox_nav BOOLEAN DEFAULT false,
    stripe_customer_id TEXT,
    status domain_status DEFAULT 'PENDING',
    dns_records JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Inboxes table
CREATE TABLE inboxes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    workspace_id TEXT NOT NULL REFERENCES workspaces(id),
    client_id TEXT REFERENCES clients(id),
    domain_id TEXT NOT NULL REFERENCES domains(id),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    password TEXT,
    status inbox_status DEFAULT 'PENDING',
    esp inbox_esp DEFAULT 'GSUITE',
    warmup_status warmup_status DEFAULT 'OFF',
    warmup_activated_at TIMESTAMP,
    subscription_id TEXT,
    stripe_subscription_id TEXT,
    persona_id TEXT,
    inbox_record_id TEXT,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Personas table
CREATE TABLE personas (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    workspace_id TEXT NOT NULL REFERENCES workspaces(id),
    client_id TEXT REFERENCES clients(id),
    inbox_id TEXT REFERENCES inboxes(id),
    user_id TEXT REFERENCES users(id),
    full_name TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    profile_photo TEXT,
    role TEXT,
    tags TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sending accounts table
CREATE TABLE sending_accounts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    workspace_id TEXT NOT NULL REFERENCES workspaces(id),
    client_id TEXT REFERENCES clients(id),
    user_id TEXT REFERENCES users(id),
    label TEXT NOT NULL,
    software sending_software DEFAULT 'SMARTLEAD',
    api_key TEXT,
    username TEXT,
    password TEXT,
    status sending_account_status DEFAULT 'CONNECTED',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Requests table
CREATE TABLE requests (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    workspace_id TEXT NOT NULL REFERENCES workspaces(id),
    type request_type NOT NULL,
    target_id TEXT,
    submitted_by TEXT NOT NULL REFERENCES users(id),
    assignee_id TEXT REFERENCES users(id),
    status request_status DEFAULT 'PENDING',
    priority priority DEFAULT 'MEDIUM',
    title TEXT NOT NULL,
    description TEXT,
    comments TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Onboarding data table
CREATE TABLE onboarding_data (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    workspace_id TEXT NOT NULL REFERENCES workspaces(id),
    order_id TEXT UNIQUE NOT NULL REFERENCES orders(id),
    business_type TEXT,
    industry TEXT,
    company_size TEXT,
    website TEXT,
    preferred_domains TEXT[],
    domain_requirements TEXT,
    personas JSONB,
    persona_count INTEGER DEFAULT 0,
    esp_provider TEXT,
    esp_credentials JSONB,
    special_requirements TEXT,
    step_completed INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- CREATE INDEXES
-- ============================================================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Workspace indexes
CREATE INDEX idx_workspaces_slug ON workspaces(slug);
CREATE INDEX idx_workspaces_primary_user_id ON workspaces(primary_user_id);

-- Client indexes
CREATE INDEX idx_clients_workspace_id ON clients(workspace_id);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_status ON clients(status);

-- Order indexes
CREATE INDEX idx_orders_workspace_id ON orders(workspace_id);
CREATE INDEX idx_orders_client_id ON orders(client_id);
CREATE INDEX idx_orders_stripe_session_id ON orders(stripe_session_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Domain indexes
CREATE INDEX idx_domains_workspace_id ON domains(workspace_id);
CREATE INDEX idx_domains_client_id ON domains(client_id);
CREATE INDEX idx_domains_status ON domains(status);

-- Inbox indexes
CREATE INDEX idx_inboxes_workspace_id ON inboxes(workspace_id);
CREATE INDEX idx_inboxes_client_id ON inboxes(client_id);
CREATE INDEX idx_inboxes_domain_id ON inboxes(domain_id);
CREATE INDEX idx_inboxes_email ON inboxes(email);
CREATE INDEX idx_inboxes_status ON inboxes(status);

-- Persona indexes
CREATE INDEX idx_personas_workspace_id ON personas(workspace_id);
CREATE INDEX idx_personas_client_id ON personas(client_id);
CREATE INDEX idx_personas_inbox_id ON personas(inbox_id);

-- Request indexes
CREATE INDEX idx_requests_workspace_id ON requests(workspace_id);
CREATE INDEX idx_requests_submitted_by ON requests(submitted_by);
CREATE INDEX idx_requests_status ON requests(status);

-- Onboarding data indexes
CREATE INDEX idx_onboarding_data_workspace_id ON onboarding_data(workspace_id);
CREATE INDEX idx_onboarding_data_order_id ON onboarding_data(order_id);

-- ============================================================================
-- CREATE TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workspace_members_updated_at BEFORE UPDATE ON workspace_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_domains_updated_at BEFORE UPDATE ON domains FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inboxes_updated_at BEFORE UPDATE ON inboxes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_personas_updated_at BEFORE UPDATE ON personas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sending_accounts_updated_at BEFORE UPDATE ON sending_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_onboarding_data_updated_at BEFORE UPDATE ON onboarding_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INSERT SAMPLE DATA
-- ============================================================================

-- Insert a sample user
INSERT INTO users (id, email, name, full_name, password_hash) VALUES 
('user_1', 'admin@inboxnavigator.com', 'Admin User', 'Admin User', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/4QZ8K2');

-- Insert a sample workspace
INSERT INTO workspaces (id, name, slug, description, primary_user_id) VALUES 
('workspace_1', 'Inbox Navigator Demo', 'inbox-navigator-demo', 'Demo workspace for Inbox Navigator', 'user_1');

-- Insert workspace member
INSERT INTO workspace_members (workspace_id, user_id, role) VALUES 
('workspace_1', 'user_1', 'OWNER');

-- Insert a sample client
INSERT INTO clients (id, workspace_id, name, email, company, status) VALUES 
('client_1', 'workspace_1', 'Demo Client', 'client@example.com', 'Demo Company', 'ACTIVE');

-- Insert a sample order
INSERT INTO orders (id, workspace_id, client_id, order_number, status, total_amount, currency, quantity, inbox_count, domain_count, product_id, price_id, products_bought, types_of_inboxes) VALUES 
('order_1', 'workspace_1', 'client_1', 'ORD-001', 'PLACED', 10000, 'usd', 1, 1, 1, 'prod_test', 'price_test', ARRAY['inbox'], ARRAY['GSUITE']::inbox_type[]);

-- Insert a sample domain
INSERT INTO domains (id, workspace_id, client_id, name, status) VALUES 
('domain_1', 'workspace_1', 'client_1', 'demo.com', 'PENDING');

-- Insert a sample inbox
INSERT INTO inboxes (id, workspace_id, client_id, domain_id, email, name, status, esp) VALUES 
('inbox_1', 'workspace_1', 'client_1', 'domain_1', 'demo@demo.com', 'Demo Inbox', 'PENDING', 'GSUITE');

-- Insert a sample persona
INSERT INTO personas (id, workspace_id, client_id, inbox_id, full_name, first_name, last_name, role) VALUES 
('persona_1', 'workspace_1', 'client_1', 'inbox_1', 'John Doe', 'John', 'Doe', 'CEO');

-- Insert sample onboarding data
INSERT INTO onboarding_data (id, workspace_id, order_id, business_type, industry, company_size, website, preferred_domains, step_completed, is_completed) VALUES 
('onboarding_1', 'workspace_1', 'order_1', 'SaaS', 'Software', '1-10', 'https://demo.com', ARRAY['demo.com'], 5, true);

COMMIT;
