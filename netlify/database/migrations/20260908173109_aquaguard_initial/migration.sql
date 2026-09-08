CREATE TABLE "chat_messages" (
	"id" serial PRIMARY KEY,
	"user_id" text NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" serial PRIMARY KEY,
	"user_id" text NOT NULL,
	"invoice_number" text NOT NULL UNIQUE,
	"period_start" timestamp with time zone NOT NULL,
	"period_end" timestamp with time zone NOT NULL,
	"amount" integer NOT NULL,
	"status" text NOT NULL,
	"payment_method" text,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY,
	"user_id" text NOT NULL UNIQUE,
	"plan_name" text NOT NULL,
	"pond_count" integer NOT NULL,
	"monthly_amount" integer NOT NULL,
	"status" text NOT NULL,
	"next_due" timestamp with time zone NOT NULL,
	"installed_units" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
