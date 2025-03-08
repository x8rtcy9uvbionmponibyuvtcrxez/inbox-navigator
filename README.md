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
- **Backend**: Next.js API Routes, PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Deployment**: Vercel

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Stripe account for payments integration

### Setup

1. Clone the repository
   ```
   git clone <repository-url>
   cd inbox-navigator
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="your-postgres-connection-string"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   STRIPE_PUBLIC_KEY="your-stripe-public-key"
   STRIPE_SECRET_KEY="your-stripe-secret-key"
   ```

4. Set up the database
   ```
   npx prisma db push
   ```

5. Start the development server
   ```
   npm run dev
   ```

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
   - Add all the variables from your local `.env` file
   - Make sure to update `NEXTAUTH_URL` to your production URL

4. Deploy:
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be available at the provided URL

### Manual Deployment

If you prefer to deploy manually:

1. Build the application
   ```
   npm run build
   ```

2. Start the production server
   ```
   npm run start
   ```

## Project Structure

- `/src/app` - Next.js App Router structure
- `/src/app/api` - API routes
- `/src/components` - React components
- `/prisma` - Database schema and migrations
- `/public` - Static assets

## License

[MIT](LICENSE)
