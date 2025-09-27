# Authentication Setup Guide

This guide will help you set up Supabase authentication for the Inbox Navigator project.

## Prerequisites

1. **Supabase Project**: You should have already created a Supabase project following the `DATABASE_SETUP.md` guide
2. **Environment Variables**: Ensure your `.env.local` file is properly configured

## Step 1: Configure Supabase Authentication

### Enable Email Authentication

1. Go to your Supabase dashboard
2. Navigate to **Authentication** → **Settings**
3. Under **Auth Providers**, ensure **Email** is enabled
4. Configure the following settings:

**Email Settings:**
- ✅ Enable email confirmations
- ✅ Enable email change confirmations
- ✅ Enable secure email change

**Site URL:**
- Set to `http://localhost:3000` for development
- Set to your production domain for production

**Redirect URLs:**
- Add `http://localhost:3000/auth/callback` for development
- Add your production callback URL for production

### Configure Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize the email templates for:
   - Confirm signup
   - Reset password
   - Magic link
   - Email change

## Step 2: Environment Variables

Ensure your `.env.local` file contains:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key_here"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"

# Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

## Step 3: Database Setup

Run the database setup commands:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

## Step 4: Test Authentication

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the application:**
   - Go to `http://localhost:3000`
   - You should be redirected to `/auth` if not authenticated

3. **Test the signup flow:**
   - Click "Sign up" on the auth page
   - Fill in the form with a valid email
   - Check your email for the confirmation link
   - Click the confirmation link
   - You should be redirected to workspace setup

4. **Test the login flow:**
   - Sign out and try logging in with your credentials
   - You should be redirected to the dashboard

## Authentication Features

### 🔐 **Complete Authentication System**

**User Registration:**
- Email/password signup with email confirmation
- Full name collection during registration
- Automatic user record creation in database

**User Login:**
- Email/password authentication
- Session management with automatic refresh
- Secure token handling

**Workspace Management:**
- Automatic workspace creation after signup
- Multi-tenant architecture support
- Workspace member management with roles

### 🛡️ **Security Features**

**Protected Routes:**
- All dashboard pages require authentication
- Automatic redirect to auth page for unauthenticated users
- Server-side session validation

**Session Management:**
- Automatic session refresh
- Secure cookie handling
- Server-side authentication middleware

**Data Protection:**
- All API routes protected with authentication
- User data scoped to workspaces
- Proper authorization checks

### 🎨 **User Experience**

**Seamless Flow:**
- Signup → Email confirmation → Workspace setup → Dashboard
- Login → Dashboard (if workspace exists)
- Automatic redirects based on authentication state

**Modern UI:**
- Clean, professional authentication forms
- Loading states and error handling
- Responsive design

## Authentication Flow

### 1. **Signup Process**
```
User fills signup form
    ↓
Supabase creates user account
    ↓
Email confirmation sent
    ↓
User clicks confirmation link
    ↓
User record created in database
    ↓
Redirected to workspace setup
    ↓
Workspace created
    ↓
Redirected to dashboard
```

### 2. **Login Process**
```
User fills login form
    ↓
Supabase validates credentials
    ↓
Session created
    ↓
User workspaces loaded
    ↓
Redirected to dashboard
```

### 3. **Protected Route Access**
```
User accesses protected route
    ↓
Middleware checks authentication
    ↓
If not authenticated → redirect to /auth
    ↓
If authenticated → allow access
```

## API Endpoints

### Authentication Endpoints

**POST `/api/auth/create-user`**
- Creates user record in database after Supabase signup
- Called automatically during signup process

**GET `/api/workspaces`**
- Returns user's workspaces
- Requires authentication

**POST `/api/workspaces`**
- Creates new workspace
- Requires authentication
- Automatically adds user as workspace owner

## Components

### Authentication Components

**`LoginForm`**
- Email/password login form
- Form validation and error handling
- Loading states

**`SignupForm`**
- Registration form with email confirmation
- Password strength validation
- Success state with email confirmation message

**`WorkspaceSetup`**
- Workspace creation form
- Name and description fields
- Automatic workspace creation

**`ProtectedRoute`**
- Wrapper component for protected pages
- Handles authentication checks
- Automatic redirects

### Context and Hooks

**`AuthContext`**
- Global authentication state management
- User session handling
- Workspace management
- Authentication methods (signup, login, logout)

**`useAuth` Hook**
- Access authentication state and methods
- User information
- Current workspace
- Authentication actions

## Middleware

**`middleware.ts`**
- Server-side authentication checks
- Automatic route protection
- Session validation
- Redirect handling

## Database Integration

### User Management
- Users table with Supabase integration
- Automatic user creation on signup
- Profile information storage

### Workspace Management
- Multi-tenant workspace support
- User-workspace relationships
- Role-based access control

### Data Scoping
- All business data scoped to workspaces
- Proper foreign key relationships
- Cascade deletion for data integrity

## Troubleshooting

### Common Issues

1. **"Invalid login credentials"**
   - Check if email is confirmed
   - Verify password is correct
   - Ensure Supabase email auth is enabled

2. **"User already exists"**
   - User may have signed up but not confirmed email
   - Check Supabase Auth dashboard for user status

3. **"Unauthorized" errors**
   - Check environment variables
   - Verify Supabase keys are correct
   - Ensure database is properly set up

4. **Redirect loops**
   - Check middleware configuration
   - Verify protected route patterns
   - Ensure auth page is not protected

### Debug Steps

1. **Check Supabase Dashboard:**
   - Go to Authentication → Users
   - Verify user accounts are created
   - Check email confirmation status

2. **Check Database:**
   - Use Prisma Studio: `npm run db:studio`
   - Verify user records exist
   - Check workspace relationships

3. **Check Environment Variables:**
   - Verify all Supabase keys are correct
   - Ensure database URL is properly formatted
   - Check for typos in variable names

## Production Deployment

### Environment Variables
- Update `NEXT_PUBLIC_SUPABASE_URL` to production URL
- Update `DATABASE_URL` to production database
- Set proper redirect URLs in Supabase dashboard

### Security Considerations
- Enable Row Level Security (RLS) in Supabase
- Use strong database passwords
- Regularly rotate API keys
- Enable rate limiting
- Use HTTPS in production

### Email Configuration
- Configure custom SMTP for email sending
- Set up proper email templates
- Test email delivery in production

## Next Steps

After setting up authentication:

1. **Configure Email Templates** in Supabase dashboard
2. **Set up Custom SMTP** for production email sending
3. **Enable Row Level Security** for database protection
4. **Configure Rate Limiting** for API endpoints
5. **Set up Monitoring** for authentication events
6. **Test Email Flows** thoroughly before production

The authentication system is now fully functional and ready for production use!
