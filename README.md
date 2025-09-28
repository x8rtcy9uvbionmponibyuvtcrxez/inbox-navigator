# Inbox Navigator

A SaaS dashboard for efficient cold email management. Manage your inboxes, domains, and email campaigns with a modern, intuitive interface.

## Features

- **Authentication**: Sign in with Google, Microsoft, or Email/Password
- **Workspace Management**: Create and manage multiple workspaces
- **Subscription Plans**: Free, Pro, and Enterprise tiers with Stripe integration
- **Email Analytics**: Track open rates, response rates, and other metrics
- **Domain Management**: Add and manage multiple domains
- **Dynamic Tables**: Filter, sort, and search through your data

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **Backend**: Next.js API Routes, SQLite with Prisma ORM
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Deployment**: Vercel

## Local Development

### Prerequisites

- Node.js 20+
- SQLite database (included)
- Stripe account for payments integration
- Supabase account for authentication

### Setup

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd inbox-navigator
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   # Database (SQLite - no setup needed)
   DATABASE_URL="file:./dev.db"

   # Supabase Authentication
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

   # NextAuth (if using)
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"

   # Stripe
   STRIPE_PUBLIC_KEY="your-stripe-public-key"
   STRIPE_SECRET_KEY="your-stripe-secret-key"
   STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

   # Encryption
   JWT_SECRET="your-jwt-secret-key-here"
   ENCRYPTION_KEY="your-encryption-key-32-chars"
   ```

4. Set up the database
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. Seed the database (optional)
   ```bash
   npx tsx scripts/setup-db.ts
   ```

6. Start the development server
   ```bash
   npm run dev
   ```

## Database Schema

The application uses SQLite with Prisma ORM. Key models include:

- **Users**: User accounts and authentication
- **Workspaces**: Multi-tenant workspace management
- **Clients**: Customer/client management
- **Domains**: Domain registration and management
- **Inboxes**: Email inbox management
- **Orders**: Order tracking and management
- **Subscriptions**: Subscription and billing management

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio
- `npx prisma db push` - Push schema changes to database
- `npx prisma generate` - Generate Prisma client

## Deployment

### Deploying to Vercel

1. Push your code to a Git repository (GitHub, GitLab, etc.)

2. Connect your repository to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Sign up or log in
   - Click "New Project"
   - Import your repository
   - Configure the project settings (Next.js framework preset)

3. Set up environment variables:
   - Add all the variables from your local `.env.local` file
   - For production, use a PostgreSQL database instead of SQLite

4. Deploy!

## Project Structure

```
inbox-navigator/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── ...
├── src/                   # Source code
│   ├── components/        # React components
│   ├── lib/              # Utility functions
│   └── contexts/         # React contexts
├── prisma/               # Database schema and migrations
├── scripts/              # Database setup scripts
└── public/               # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.