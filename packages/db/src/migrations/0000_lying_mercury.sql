CREATE TYPE "public"."budget_category" AS ENUM('MARKETING', 'OPERATIONS', 'PAYROLL', 'UTILITIES', 'MISCELLANEOUS');--> statement-breakpoint
CREATE TYPE "public"."cash_flow_direction" AS ENUM('INCOMING', 'OUTGOING');--> statement-breakpoint
CREATE TYPE "public"."expenseCategoryEnum" AS ENUM('VEHICLE', 'HOUSING', 'SALES', 'FOOD', 'SHOPPING', 'ENTERTAINMENT', 'EDUCATION', 'HEALTHCARE', 'SUPPLIES', 'OPTIONAL');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('BANK', 'CASH', 'CARD_CREDIT', 'DIGITAL_WALLET', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('PAYMENT', 'PAYOUT');--> statement-breakpoint
CREATE TABLE "budgets" (
	"id" text PRIMARY KEY NOT NULL,
	"business_profile_id" text NOT NULL,
	"category" "budget_category" NOT NULL,
	"allocated_amount" numeric(12, 2) NOT NULL,
	"spent_amount" numeric(12, 2) NOT NULL,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_contacts" (
	"id" text PRIMARY KEY NOT NULL,
	"business_profile_id" text NOT NULL,
	"contact_type" varchar(50) NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"title" varchar(100),
	"department" varchar(100),
	"email" varchar(255),
	"phone" varchar(50),
	"mobile" varchar(50),
	"is_primary" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_information" (
	"id" text PRIMARY KEY NOT NULL,
	"business_profile_id" text NOT NULL,
	"tax_id" varchar(50),
	"registration_number" varchar(100),
	"business_license" varchar(100),
	"base_currency" varchar(3) DEFAULT 'USD',
	"fiscal_year_end" varchar(5),
	"default_bank_account" varchar(100),
	"timezone" varchar(50) DEFAULT 'UTC',
	"date_format" varchar(20) DEFAULT 'MM/dd/yyyy',
	"number_format" varchar(20) DEFAULT 'en-US',
	"business_hours_start" varchar(8),
	"business_hours_end" varchar(8),
	"operating_days" varchar(50),
	"certifications" text,
	"compliance_notes" text,
	"social_media_links" text,
	"internal_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_locations" (
	"id" text PRIMARY KEY NOT NULL,
	"business_profile_id" text NOT NULL,
	"location_name" varchar(255) NOT NULL,
	"location_type" varchar(50),
	"address_line_1" varchar(255) NOT NULL,
	"address_line_2" varchar(255),
	"city" varchar(100) NOT NULL,
	"state" varchar(100),
	"postal_code" varchar(20),
	"country" varchar(100) NOT NULL,
	"phone" varchar(50),
	"email" varchar(255),
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"is_headquarters" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_profile" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"legal_name" varchar(255),
	"trading_name" varchar(255),
	"email" varchar(255) NOT NULL,
	"twitter" varchar(255) NOT NULL,
	"linkedin" varchar(255) NOT NULL,
	"phone" varchar(50),
	"website" varchar(255),
	"address_line_1" varchar(255),
	"address_line_2" varchar(255),
	"city" varchar(100),
	"state" varchar(100),
	"postal_code" varchar(20),
	"country" varchar(100),
	"industry" varchar(100),
	"business_type" varchar(50),
	"employee_count" integer,
	"founded_year" integer,
	"logo_url" text,
	"brand_color" varchar(7),
	"description" text,
	"mission" text,
	"vision" text,
	"is_active" boolean DEFAULT true,
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cash_flows" (
	"id" text PRIMARY KEY NOT NULL,
	"business_profile_id" text NOT NULL,
	"transaction_id" text NOT NULL,
	"cash_flow_direction" "cash_flow_direction" NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"flow_date" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expense_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"business_profile_id" text NOT NULL,
	"name" "expenseCategoryEnum" NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" text PRIMARY KEY NOT NULL,
	"expense_category_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"frequency" varchar(50) NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_methods" (
	"id" text PRIMARY KEY NOT NULL,
	"business_profile_id" text NOT NULL,
	"payment_method_type" "payment_method" NOT NULL,
	"details" jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"business_profile_id" text NOT NULL,
	"payment_method_id" text,
	"expense_category_id" text,
	"type" "transaction_type" NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"description" text,
	"transaction_date" timestamp DEFAULT now() NOT NULL,
	"reference" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_business_profile_id_business_profile_id_fk" FOREIGN KEY ("business_profile_id") REFERENCES "public"."business_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_contacts" ADD CONSTRAINT "business_contacts_business_profile_id_business_profile_id_fk" FOREIGN KEY ("business_profile_id") REFERENCES "public"."business_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_information" ADD CONSTRAINT "business_information_business_profile_id_business_profile_id_fk" FOREIGN KEY ("business_profile_id") REFERENCES "public"."business_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_locations" ADD CONSTRAINT "business_locations_business_profile_id_business_profile_id_fk" FOREIGN KEY ("business_profile_id") REFERENCES "public"."business_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_profile" ADD CONSTRAINT "business_profile_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cash_flows" ADD CONSTRAINT "cash_flows_business_profile_id_business_profile_id_fk" FOREIGN KEY ("business_profile_id") REFERENCES "public"."business_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cash_flows" ADD CONSTRAINT "cash_flows_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_categories" ADD CONSTRAINT "expense_categories_business_profile_id_business_profile_id_fk" FOREIGN KEY ("business_profile_id") REFERENCES "public"."business_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_expense_category_id_expense_categories_id_fk" FOREIGN KEY ("expense_category_id") REFERENCES "public"."expense_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_business_profile_id_business_profile_id_fk" FOREIGN KEY ("business_profile_id") REFERENCES "public"."business_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_business_profile_id_business_profile_id_fk" FOREIGN KEY ("business_profile_id") REFERENCES "public"."business_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_payment_method_id_payment_methods_id_fk" FOREIGN KEY ("payment_method_id") REFERENCES "public"."payment_methods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_expense_category_id_expense_categories_id_fk" FOREIGN KEY ("expense_category_id") REFERENCES "public"."expense_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;