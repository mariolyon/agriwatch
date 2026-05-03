CREATE TABLE "locations" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"country" text NOT NULL,
	"admin1" text,
	"timezone" text NOT NULL
);
