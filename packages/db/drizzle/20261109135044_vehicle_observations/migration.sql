CREATE TYPE "data_source" AS ENUM('LIVE', 'SIMULATED');--> statement-breakpoint
CREATE TYPE "provider" AS ENUM('MBTA', 'SIMULATOR');--> statement-breakpoint
CREATE TABLE "vehicle_current_state" (
	"vehicle_id" uuid,
	"source" "data_source",
	"provider" "provider" NOT NULL,
	"route_id" text,
	"trip_id" text,
	"lat" double precision NOT NULL,
	"lon" double precision NOT NULL,
	"bearing" double precision,
	"speed_mps" double precision,
	"observed_at" timestamp with time zone NOT NULL,
	"received_at" timestamp with time zone NOT NULL,
	"has_provider_timestamp" boolean NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vehicle_current_state_pkey" PRIMARY KEY("vehicle_id","source")
);
--> statement-breakpoint
CREATE TABLE "vehicle_positions" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vehicle_positions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"vehicle_id" uuid NOT NULL,
	"source" "data_source" NOT NULL,
	"provider" "provider" NOT NULL,
	"event_id" text NOT NULL,
	"route_id" text,
	"trip_id" text,
	"lat" double precision NOT NULL,
	"lon" double precision NOT NULL,
	"bearing" double precision,
	"speed_mps" double precision,
	"observed_at" timestamp with time zone NOT NULL,
	"received_at" timestamp with time zone NOT NULL,
	"has_provider_timestamp" boolean NOT NULL,
	CONSTRAINT "vehicle_positions_source_provider_event_id_unique" UNIQUE("source","provider","event_id"),
	CONSTRAINT "vehicle_positions_source_provider_check" CHECK (("source" = 'LIVE' AND "provider" = 'MBTA') OR ("source" = 'SIMULATED' AND "provider" = 'SIMULATOR'))
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"provider" "provider" NOT NULL,
	"provider_vehicle_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vehicles_provider_provider_vehicle_id_unique" UNIQUE("provider","provider_vehicle_id")
);
--> statement-breakpoint
CREATE INDEX "vehicle_positions_vehicle_id_observed_at_index" ON "vehicle_positions" ("vehicle_id","observed_at" DESC NULLS LAST);--> statement-breakpoint
ALTER TABLE "vehicle_current_state" ADD CONSTRAINT "vehicle_current_state_vehicle_id_vehicles_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "vehicle_positions" ADD CONSTRAINT "vehicle_positions_vehicle_id_vehicles_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT;