CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"data" jsonb DEFAULT '[]' NOT NULL
);
