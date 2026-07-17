ALTER TABLE "complaints" ADD COLUMN "translated_title" varchar(255);--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "original_language" varchar(50);--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "translated_text" text;--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "frequency" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "incident_occurred_at" timestamp;--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "category_id" uuid;--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "subcategory_id" uuid;--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "custom_category" varchar(255);--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "custom_subcategory" varchar(255);--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "latitude" double precision;--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "longitude" double precision;--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "location" "geography(Point,4326)";--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "ward_id" uuid;--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "classification_category" varchar(100);--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "severity" varchar(50);--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "sentiment" varchar(50);--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "status" varchar(50) DEFAULT 'Submitted' NOT NULL;