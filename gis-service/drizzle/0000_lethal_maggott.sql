CREATE TABLE "boundary_layers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"city" text,
	"layer_type" text,
	"level" integer,
	"properties" jsonb,
	"geom" geometry(MULTIPOLYGON,4326)
);
--> statement-breakpoint
CREATE INDEX "boundary_layers_geom_idx" ON "boundary_layers" USING gist ("geom");