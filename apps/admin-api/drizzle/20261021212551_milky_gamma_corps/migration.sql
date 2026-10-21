CREATE TYPE "admin_role_name" AS ENUM('superadmin', 'finance', 'support', 'auditor', 'operator');--> statement-breakpoint
CREATE TYPE "database_provider" AS ENUM('neon', 'aws');--> statement-breakpoint
CREATE TYPE "workspace_status" AS ENUM('provisioning', 'active', 'suspended', 'failed');--> statement-breakpoint
CREATE TABLE "admin_invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" text NOT NULL,
	"admin_role_id" uuid NOT NULL,
	"token_hash" text NOT NULL UNIQUE,
	"expires_at" timestamp with time zone NOT NULL,
	"accepted_at" timestamp with time zone,
	"invited_by" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_role_permissions" (
	"admin_role_id" uuid,
	"action" text,
	"subject" text,
	CONSTRAINT "admin_role_permissions_pkey" PRIMARY KEY("admin_role_id","action","subject")
);
--> statement-breakpoint
CREATE TABLE "admin_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" "admin_role_name" NOT NULL UNIQUE,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "admin_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"admin_user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"ip" inet,
	"user_agent" text
);
--> statement-breakpoint
CREATE TABLE "admin_user_roles" (
	"admin_user_id" uuid,
	"admin_role_id" uuid,
	CONSTRAINT "admin_user_roles_pkey" PRIMARY KEY("admin_user_id","admin_role_id")
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"password_hash" text NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"admin_user_id" uuid NOT NULL,
	"workspace_id" uuid,
	"action" text NOT NULL,
	"metadata" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"workspace_id" uuid NOT NULL,
	"amount_cents" integer NOT NULL,
	"status" text NOT NULL,
	"due_at" timestamp with time zone NOT NULL,
	"paid_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL UNIQUE,
	"price_cents" integer NOT NULL,
	"limits" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "provisioning_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"workspace_id" uuid NOT NULL,
	"step" text NOT NULL,
	"status" text NOT NULL,
	"error" text,
	"attempts" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"workspace_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"status" text NOT NULL,
	"current_period_end" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace_domains" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"workspace_id" uuid NOT NULL,
	"domain" text NOT NULL UNIQUE,
	"verified_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"status" "workspace_status" DEFAULT 'provisioning'::"workspace_status" NOT NULL,
	"plan_id" uuid NOT NULL,
	"db_provider" "database_provider" NOT NULL,
	"db_connection_enc" text,
	"schema_version" integer DEFAULT 0 NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "admin_sessions_admin_user_id_idx" ON "admin_sessions" ("admin_user_id");--> statement-breakpoint
CREATE INDEX "audit_logs_admin_user_id_idx" ON "audit_logs" ("admin_user_id");--> statement-breakpoint
CREATE INDEX "audit_logs_workspace_id_idx" ON "audit_logs" ("workspace_id");--> statement-breakpoint
CREATE INDEX "invoices_workspace_id_idx" ON "invoices" ("workspace_id");--> statement-breakpoint
CREATE INDEX "provisioning_jobs_workspace_id_idx" ON "provisioning_jobs" ("workspace_id");--> statement-breakpoint
CREATE INDEX "subscriptions_workspace_id_idx" ON "subscriptions" ("workspace_id");--> statement-breakpoint
CREATE INDEX "workspace_domains_workspace_id_idx" ON "workspace_domains" ("workspace_id");--> statement-breakpoint
ALTER TABLE "admin_invites" ADD CONSTRAINT "admin_invites_admin_role_id_admin_roles_id_fkey" FOREIGN KEY ("admin_role_id") REFERENCES "admin_roles"("id");--> statement-breakpoint
ALTER TABLE "admin_invites" ADD CONSTRAINT "admin_invites_invited_by_admin_users_id_fkey" FOREIGN KEY ("invited_by") REFERENCES "admin_users"("id");--> statement-breakpoint
ALTER TABLE "admin_role_permissions" ADD CONSTRAINT "admin_role_permissions_admin_role_id_admin_roles_id_fkey" FOREIGN KEY ("admin_role_id") REFERENCES "admin_roles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "admin_sessions" ADD CONSTRAINT "admin_sessions_admin_user_id_admin_users_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "admin_users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "admin_user_roles" ADD CONSTRAINT "admin_user_roles_admin_user_id_admin_users_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "admin_users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "admin_user_roles" ADD CONSTRAINT "admin_user_roles_admin_role_id_admin_roles_id_fkey" FOREIGN KEY ("admin_role_id") REFERENCES "admin_roles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_admin_user_id_admin_users_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "admin_users"("id");--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id");--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "provisioning_jobs" ADD CONSTRAINT "provisioning_jobs_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_plans_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id");--> statement-breakpoint
ALTER TABLE "workspace_domains" ADD CONSTRAINT "workspace_domains_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_plan_id_plans_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id");--> statement-breakpoint
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_created_by_admin_users_id_fkey" FOREIGN KEY ("created_by") REFERENCES "admin_users"("id");