-- Create basic enums
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');
CREATE TYPE "OrderStatus" AS ENUM ('PLACED', 'PROCESSING', 'DELIVERED', 'CANCELLED', 'REFUNDED');
CREATE TYPE "InboxType" AS ENUM ('GSUITE', 'OUTLOOK', 'CUSTOM');

-- Create users table
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "full_name" TEXT,
    "password_hash" TEXT,
    "avatar_url" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "last_login" TIMESTAMP(3),
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- Create workspaces table
CREATE TABLE "workspaces" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "primary_user_id" TEXT NOT NULL,
    "subscription_status" TEXT NOT NULL DEFAULT 'free',
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "workspaces_slug_key" ON "workspaces"("slug");

-- Create clients table
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "products_bought" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- Create orders table
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "order_number" TEXT NOT NULL,
    "stripe_session_id" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'PLACED',
    "total_amount" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "products_bought" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "types_of_inboxes" "InboxType"[] DEFAULT ARRAY[]::"InboxType"[],
    "order_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number");
CREATE UNIQUE INDEX "orders_stripe_session_id_key" ON "orders"("stripe_session_id");

-- Create onboarding_data table
CREATE TABLE "onboarding_data" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "business_type" TEXT,
    "preferred_domains" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "step_completed" INTEGER NOT NULL DEFAULT 0,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "onboarding_data_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "onboarding_data_order_id_key" ON "onboarding_data"("order_id");

-- Add foreign key constraints
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_primary_user_id_fkey" FOREIGN KEY ("primary_user_id") REFERENCES "users"("id");
ALTER TABLE "clients" ADD CONSTRAINT "clients_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id");
ALTER TABLE "orders" ADD CONSTRAINT "orders_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id");
ALTER TABLE "orders" ADD CONSTRAINT "orders_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id");
ALTER TABLE "onboarding_data" ADD CONSTRAINT "onboarding_data_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id");
ALTER TABLE "onboarding_data" ADD CONSTRAINT "onboarding_data_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id");

