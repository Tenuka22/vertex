CREATE TYPE "public"."balance_sheet_item_type" AS ENUM('ASSET', 'LIABILITY', 'EQUITY');--> statement-breakpoint
CREATE TABLE "balance_sheet_items" (
	"id" text PRIMARY KEY NOT NULL,
	"business_profile_id" text NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"amount" numeric(12, 2) NOT NULL,
	"type" "balance_sheet_item_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goals" (
	"id" text PRIMARY KEY NOT NULL,
	"business_profile_id" text NOT NULL,
	"title" varchar(255) NOT NULL,
	"target_amount" numeric(12, 2) NOT NULL,
	"current_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"deadline" timestamp NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"category" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"id" text PRIMARY KEY NOT NULL,
	"business_profile_id" text NOT NULL,
	"product_id" text NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"min_stock_level" integer DEFAULT 0 NOT NULL,
	"max_stock_level" integer DEFAULT 0 NOT NULL,
	"unit_cost" numeric(12, 2),
	"location" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" text PRIMARY KEY NOT NULL,
	"business_profile_id" text NOT NULL,
	"invoice_number" varchar(100) NOT NULL,
	"customer" varchar(255) NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"issue_date" timestamp DEFAULT now() NOT NULL,
	"due_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"business_profile_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"category" varchar(100) NOT NULL,
	"type" varchar(50) DEFAULT 'Product' NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_orders" (
	"id" text PRIMARY KEY NOT NULL,
	"business_profile_id" text NOT NULL,
	"supplier_id" text NOT NULL,
	"order_number" varchar(100) NOT NULL,
	"total_amount" numeric(12, 2) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"order_date" timestamp DEFAULT now() NOT NULL,
	"expected_delivery" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "suppliers" (
	"id" text PRIMARY KEY NOT NULL,
	"business_profile_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"contact_person" varchar(255),
	"email" varchar(255),
	"phone" varchar(50),
	"address" text,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "balance_sheet_items" ADD CONSTRAINT "balance_sheet_items_business_profile_id_business_profile_id_fk" FOREIGN KEY ("business_profile_id") REFERENCES "public"."business_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_business_profile_id_business_profile_id_fk" FOREIGN KEY ("business_profile_id") REFERENCES "public"."business_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_business_profile_id_business_profile_id_fk" FOREIGN KEY ("business_profile_id") REFERENCES "public"."business_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_business_profile_id_business_profile_id_fk" FOREIGN KEY ("business_profile_id") REFERENCES "public"."business_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_business_profile_id_business_profile_id_fk" FOREIGN KEY ("business_profile_id") REFERENCES "public"."business_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_business_profile_id_business_profile_id_fk" FOREIGN KEY ("business_profile_id") REFERENCES "public"."business_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_business_profile_id_business_profile_id_fk" FOREIGN KEY ("business_profile_id") REFERENCES "public"."business_profile"("id") ON DELETE cascade ON UPDATE no action;