CREATE TABLE "eg_pgr_service_v2" (
	"id" varchar(64),
	"tenantid" varchar(256) NOT NULL,
	"servicecode" varchar(256) NOT NULL,
	"servicerequestid" varchar(256) NOT NULL,
	"description" varchar(4000),
	"accountid" varchar(256),
	"additionaldetails" jsonb,
	"applicationstatus" varchar(128),
	"rating" smallint,
	"source" varchar(256),
	"createdby" varchar(256) NOT NULL,
	"createdtime" bigint NOT NULL,
	"lastmodifiedby" varchar(256),
	"lastmodifiedtime" bigint,
	"active" boolean DEFAULT true,
	CONSTRAINT "eg_pgr_service_v2_tenantid_servicerequestid_pk" PRIMARY KEY("tenantid","servicerequestid"),
	CONSTRAINT "uk_eg_pgr_service_v2" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "eg_pgr_address_v2" (
	"tenantid" varchar(256) NOT NULL,
	"id" varchar(256) NOT NULL,
	"parentid" varchar(256) NOT NULL,
	"doorno" varchar(128),
	"plotno" varchar(256),
	"buildingname" varchar(1024),
	"street" varchar(1024),
	"landmark" varchar(1024),
	"city" varchar(512),
	"pincode" varchar(16),
	"locality" varchar(128) NOT NULL,
	"district" varchar(256),
	"region" varchar(256),
	"state" varchar(256),
	"country" varchar(512),
	"latitude" numeric(9, 6),
	"longitude" numeric(10, 7),
	"createdby" varchar(128) NOT NULL,
	"createdtime" bigint NOT NULL,
	"lastmodifiedby" varchar(128),
	"lastmodifiedtime" bigint,
	"additionaldetails" jsonb,
	CONSTRAINT "eg_pgr_address_v2_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "ai_enrichment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"complaint_id" varchar(64) NOT NULL,
	"predicted_category" varchar(256),
	"predicted_subcategory" varchar(256),
	"confidence" real,
	"urgency" varchar(20),
	"urgency_signals" jsonb,
	"recurrence_score" real,
	"is_hotspot" boolean,
	"model_version" varchar(100),
	"processed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "eg_pgr_address_v2" ADD CONSTRAINT "eg_pgr_address_v2_parentid_eg_pgr_service_v2_id_fk" FOREIGN KEY ("parentid") REFERENCES "public"."eg_pgr_service_v2"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_enrichment" ADD CONSTRAINT "ai_enrichment_complaint_id_eg_pgr_service_v2_id_fk" FOREIGN KEY ("complaint_id") REFERENCES "public"."eg_pgr_service_v2"("id") ON DELETE no action ON UPDATE no action;