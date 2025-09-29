# Vercel Environment Variables Setup

This guide outlines the required environment variables for deploying the Inbox Navigator application to Vercel.

## Required Environment Variables

### Database Configuration
```
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.gihexurwnpexdnvhvxdv.supabase.co:5432/postgres
```
- **Purpose**: PostgreSQL connection string for Supabase database
- **Format**: `postgresql://username:password@host:port/database`
- **Note**: Replace `[YOUR_PASSWORD]` with your actual Supabase database password

### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=https://gihexurwnpexdnvhvxdv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_SUPABASE_ANON_KEY]
```
- **Purpose**: Supabase client configuration for frontend
- **Note**: Get these values from your Supabase project settings

### Stripe Configuration
```
STRIPE_SECRET_KEY=sk_live_[YOUR_STRIPE_SECRET_KEY]
STRIPE_WEBHOOK_SECRET=whsec_[YOUR_WEBHOOK_SECRET]
```
- **Purpose**: Stripe payment processing and webhook verification
- **Note**: Use live keys for production, test keys for development

### Application Configuration
```
NEXT_PUBLIC_APP_URL=https://inbox-navigator.vercel.app
```
- **Purpose**: Base URL for the application (used in Stripe redirects)
- **Note**: Should match your Vercel deployment URL

## How to Set Environment Variables in Vercel

1. **Go to Vercel Dashboard**
   - Navigate to your project: https://vercel.com/dashboard
   - Select the `inbox-navigator` project

2. **Access Settings**
   - Click on the "Settings" tab
   - Select "Environment Variables" from the sidebar

3. **Add Each Variable**
   - Click "Add New"
   - Enter the variable name (e.g., `DATABASE_URL`)
   - Enter the variable value
   - Select "Production" environment
   - Click "Save"

4. **Redeploy**
   - After adding all variables, trigger a new deployment
   - Go to "Deployments" tab
   - Click "Redeploy" on the latest deployment

## Verification Steps

After setting up the environment variables:

1. **Test Database Connection**
   ```bash
   curl -X POST https://inbox-navigator.vercel.app/api/test/create-dummy-order \
     -H "Content-Type: application/json" \
     -d '{"customerEmail": "test@example.com", "customerName": "Test User", "quantity": 1}'
   ```

2. **Test Stripe Integration**
   - Visit: https://inbox-navigator.vercel.app
   - Try to create a new inbox (this will trigger Stripe checkout)

3. **Test Complete Flow**
   - Sign up with a test email
   - Complete Stripe checkout
   - Go through onboarding process
   - Verify data appears in admin panel

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check if Supabase database is running
- Ensure password doesn't contain special characters that need URL encoding

### Stripe Issues
- Verify API keys are correct (live vs test)
- Check webhook endpoint is configured in Stripe dashboard
- Ensure `NEXT_PUBLIC_APP_URL` matches your domain

### Build Issues
- Check all required environment variables are set
- Verify no typos in variable names
- Ensure values don't contain extra spaces or quotes

## Security Notes

- Never commit environment variables to git
- Use different keys for development and production
- Regularly rotate API keys
- Monitor usage and set up alerts for unusual activity
