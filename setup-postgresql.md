# PostgreSQL Setup for Local Development

## Option 1: Using Docker (Recommended)

1. **Install Docker Desktop** if you haven't already
2. **Run PostgreSQL container:**
   ```bash
   docker run --name inbox-navigator-postgres \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=inbox_navigator_dev \
     -p 5432:5432 \
     -d postgres:15
   ```

3. **Create .env.local file:**
   ```bash
   echo 'DATABASE_URL="postgresql://postgres:password@localhost:5432/inbox_navigator_dev"' > .env.local
   echo 'STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key_here"' >> .env.local
   echo 'STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"' >> .env.local
   echo 'NEXTAUTH_SECRET="your_nextauth_secret_here"' >> .env.local
   echo 'NEXTAUTH_URL="http://localhost:3000"' >> .env.local
   echo 'NEXT_PUBLIC_APP_URL="http://localhost:3000"' >> .env.local
   ```

## Option 2: Using Homebrew (macOS)

1. **Install PostgreSQL:**
   ```bash
   brew install postgresql@15
   brew services start postgresql@15
   ```

2. **Create database:**
   ```bash
   createdb inbox_navigator_dev
   ```

3. **Create .env.local file** (same as above)

## Option 3: Using Supabase Local Development

1. **Install Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

2. **Initialize Supabase:**
   ```bash
   supabase init
   supabase start
   ```

3. **Get connection string from Supabase dashboard**

## After Setup

1. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

2. **Push schema to database:**
   ```bash
   npx prisma db push
   ```

3. **Seed database:**
   ```bash
   npm run db:seed
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
