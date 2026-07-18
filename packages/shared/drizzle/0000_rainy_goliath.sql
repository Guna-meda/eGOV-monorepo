CREATE TABLE "complaint_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"complaint_id" uuid NOT NULL,
	"file_url" text NOT NULL,
	"file_type" varchar(50) NOT NULL,
	"provider_file_id" varchar(255),
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "complaints" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"original_title" varchar(255) NOT NULL,
	"translated_title" varchar(255),
	"description" text NOT NULL,
	"original_language" varchar(50),
	"translated_text" text,
	"frequency" integer DEFAULT 1 NOT NULL,
	"incident_occurred_at" timestamp,
	"user_id" uuid NOT NULL,
	"latitude" double precision,
	"longitude" double precision,
	"location" geometry(Point,4326),
	"ward_id" uuid,
	"category" varchar(100),
	"subcategory" varchar(100),
	"sentiment" varchar(50),
	"severity_score" real,
	"severity_label" varchar(50),
	"risk_score" real,
	"risk_label" varchar(50),
	"ml_status" varchar(50) DEFAULT 'PENDING' NOT NULL,
	"status" varchar(50) DEFAULT 'Submitted' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "boundary_layers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"city" text,
	"layer_type" text,
	"level" integer,
	"properties" jsonb,
	"geom" geometry
);
--> statement-breakpoint
ALTER TABLE "complaint_media" ADD CONSTRAINT "complaint_media_complaint_id_complaints_id_fk" FOREIGN KEY ("complaint_id") REFERENCES "public"."complaints"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "boundary_layers_geom_idx" ON "boundary_layers" USING gist ("geom");