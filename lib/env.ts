/**
 * Environment variable validation and configuration
 * Fails fast with readable errors on missing required environment variables
 */

interface EnvConfig {
  // Database
  DATABASE_URL: string;
  
  // Stripe
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
  
  // App Configuration
  NEXT_PUBLIC_APP_URL: string;
  NODE_ENV: 'development' | 'production' | 'test';
  
  // Optional
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  NEXTAUTH_SECRET?: string;
  NEXTAUTH_URL?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
}

function validateEnv(): EnvConfig {
  const requiredEnvVars = [
    'DATABASE_URL',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'NEXT_PUBLIC_APP_URL',
    'NODE_ENV',
  ];

  const missing: string[] = [];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(envVar => {
      console.error(`   - ${envVar}`);
    });
    console.error('\n📝 Please check your .env.local file and ensure all required variables are set.');
    console.error('💡 See .env.example for reference.');
    process.exit(1);
  }

  // Validate NODE_ENV
  const nodeEnv = process.env.NODE_ENV as EnvConfig['NODE_ENV'];
  if (!['development', 'production', 'test'].includes(nodeEnv)) {
    console.error(`❌ Invalid NODE_ENV: ${nodeEnv}. Must be one of: development, production, test`);
    process.exit(1);
  }

  console.log('✅ Environment variables validated successfully');

  return {
    DATABASE_URL: process.env.DATABASE_URL!,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL!,
    NODE_ENV: nodeEnv,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  };
}

export const env = validateEnv();
