ALTER TABLE "complaints" ADD COLUMN "category" varchar(100);--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "subcategory" varchar(100);--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "severity_score" real;--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "severity_label" varchar(50);--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "risk_score" real;--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "risk_label" varchar(50);--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "ml_status" varchar(50) DEFAULT 'PENDING' NOT NULL;--> statement-breakpoint
ALTER TABLE "complaints" DROP COLUMN "category_id";--> statement-breakpoint
ALTER TABLE "complaints" DROP COLUMN "subcategory_id";--> statement-breakpoint
ALTER TABLE "complaints" DROP COLUMN "custom_category";--> statement-breakpoint
ALTER TABLE "complaints" DROP COLUMN "custom_subcategory";--> statement-breakpoint
ALTER TABLE "complaints" DROP COLUMN "classification_category";--> statement-breakpoint
ALTER TABLE "complaints" DROP COLUMN "severity";