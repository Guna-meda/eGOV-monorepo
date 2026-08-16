ALTER TABLE "complaints" ADD COLUMN "sla_hours" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "escalation_level" integer DEFAULT 0 NOT NULL;