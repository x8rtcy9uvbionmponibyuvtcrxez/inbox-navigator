# Database Setup Guide

This guide will help you set up the database for the Inbox Navigator project using Supabase and Prisma.

## Prerequisites

1. **Supabase Account**: Create an account at [supabase.com](https://supabase.com)
2. **Node.js**: Version 18 or higher
3. **npm**: Latest version

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `inbox-navigator`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be created (2-3 minutes)

## Step 2: Get Database Connection Details

1. In your Supabase dashboard, go to **Settings** → **Database**
2. Find the **Connection string** section
3. Copy the **URI** connection string
4. Replace `[YOUR-PASSWORD]` with your database password
5. The connection string should look like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```env
   # Database
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key_here"
   SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"
   ```

3. Get your Supabase keys:
   - Go to **Settings** → **API**
   - Copy the **Project URL** for `NEXT_PUBLIC_SUPABASE_URL`
   - Copy the **anon public** key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy the **service_role** key for `SUPABASE_SERVICE_ROLE_KEY`

## Step 4: Set Up Database Schema

1. **Generate Prisma Client**:
   ```bash
   npm run db:generate
   ```

2. **Push Schema to Database**:
   ```bash
   npm run db:push
   ```

3. **Seed Database with Sample Data**:
   ```bash
   npm run db:seed
   ```

## Step 5: Verify Setup

1. **Open Prisma Studio** to view your data:
   ```bash
   npm run db:studio
   ```

2. **Check Supabase Dashboard**:
   - Go to **Table Editor** in your Supabase dashboard
   - You should see all the tables created
   - Sample data should be populated

## Database Schema Overview

The database includes the following main entities:

### Core Tables
- **Users**: User accounts and authentication
- **Workspaces**: Multi-tenant workspace management
- **WorkspaceMembers**: User-workspace relationships with roles

### Business Tables
- **Clients**: Customer/client management
- **Domains**: Domain registration and management
- **Inboxes**: Email inbox management
- **Orders**: Order tracking and management
- **Subscriptions**: Subscription and billing management

### Supporting Tables
- **Personas**: User personas for inboxes
- **SendingAccounts**: Email sending account management
- **Requests**: Support and feature requests

## Available Scripts

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset database (⚠️ destructive)

## Database Relationships

```
Users (1) ←→ (M) WorkspaceMembers (M) ←→ (1) Workspaces
Workspaces (1) ←→ (M) Clients
Clients (1) ←→ (M) Domains
Clients (1) ←→ (M) Inboxes
Domains (1) ←→ (M) Inboxes
Workspaces (1) ←→ (M) Subscriptions
Subscriptions (1) ←→ (M) Inboxes
Subscriptions (1) ←→ (M) Orders
Users (1) ←→ (M) Personas
Inboxes (1) ←→ (1) Personas
Users (1) ←→ (M) SendingAccounts
Workspaces (1) ←→ (M) Requests
Users (1) ←→ (M) Requests (as creator)
Users (1) ←→ (M) Requests (as assignee)
```

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ |
| `NEXT_PUBLIC_APP_NAME` | Application name | ❌ |
| `STRIPE_PUBLISHABLE_KEY` | Stripe public key | ❌ |
| `STRIPE_SECRET_KEY` | Stripe secret key | ❌ |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | ❌ |

## Troubleshooting

### Common Issues

1. **Connection Refused**:
   - Check your `DATABASE_URL` format
   - Ensure your IP is whitelisted in Supabase
   - Verify your database password

2. **Schema Push Fails**:
   - Check for syntax errors in `prisma/schema.prisma`
   - Ensure all required fields have proper types
   - Verify foreign key relationships

3. **Seeding Fails**:
   - Ensure database schema is pushed first
   - Check for duplicate unique constraints
   - Verify all required fields are provided

### Getting Help

1. Check the [Prisma Documentation](https://www.prisma.io/docs)
2. Check the [Supabase Documentation](https://supabase.com/docs)
3. Review the schema file: `prisma/schema.prisma`
4. Check the database utilities: `lib/db.ts`

## Next Steps

After setting up the database:

1. **Configure Authentication**: Set up Supabase Auth
2. **Set up Stripe**: Configure billing integration
3. **Configure Email**: Set up SMTP for sending emails
4. **Deploy**: Deploy to production with proper environment variables

## Security Notes

- Never commit `.env.local` to version control
- Use strong database passwords
- Regularly rotate API keys
- Enable Row Level Security (RLS) in Supabase for production
- Use connection pooling for production workloads
