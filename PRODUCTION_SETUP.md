# Production Setup Guide

## 1. Vercel Environment Variables

Add these environment variables to your Vercel project:

### Database
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
```

### NextAuth
```
NEXTAUTH_SECRET=[GENERATE-A-SECURE-SECRET]
NEXTAUTH_URL=https://your-app.vercel.app
```

### Supabase
```
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-SUPABASE-ANON-KEY]
```

### Stripe
```
STRIPE_PUBLIC_KEY=pk_live_[YOUR-LIVE-PUBLIC-KEY]
STRIPE_SECRET_KEY=sk_live_[YOUR-LIVE-SECRET-KEY]
STRIPE_WEBHOOK_SECRET=whsec_[YOUR-WEBHOOK-SECRET]
```

### Encryption
```
JWT_SECRET=[GENERATE-A-SECURE-JWT-SECRET]
ENCRYPTION_KEY=[GENERATE-A-32-CHAR-ENCRYPTION-KEY]
```

## 2. Supabase Setup

1. Create a new Supabase project
2. Get your database URL and anon key
3. Run the following to set up the database:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to Supabase
npx prisma db push

# Seed with initial data (optional)
npx prisma db seed
```

## 3. Stripe Setup

1. Create a Stripe account and get your live keys
2. Set up webhook endpoint: `https://your-app.vercel.app/api/webhooks/stripe`
3. Configure webhook events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.failed`

## 4. Deployment

1. Connect your GitHub repository to Vercel
2. Set all environment variables in Vercel dashboard
3. Deploy the application
4. Test the complete flow:
   - Payment → Onboarding → Database save

## 5. Testing Production Flow

1. Visit your live URL
2. Go through the payment flow
3. Complete onboarding
4. Verify data is saved in Supabase
5. Check admin interface for new orders
