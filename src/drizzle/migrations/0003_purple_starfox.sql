CREATE TABLE "section" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"page_number" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "embeddingIndex" ON "section" USING hnsw ("embedding" vector_cosine_ops);