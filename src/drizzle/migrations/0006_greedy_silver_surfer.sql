ALTER TABLE "segment" ADD COLUMN "chat_id" integer;--> statement-breakpoint
ALTER TABLE "segment" ADD CONSTRAINT "segment_chat_id_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chat"("id") ON DELETE no action ON UPDATE no action;