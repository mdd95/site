CREATE TABLE "direct_chat" (
	"id" text PRIMARY KEY NOT NULL,
	"user1_id" text NOT NULL,
	"user2_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "direct_chat_no_self" CHECK ("direct_chat"."user1_id" <> "direct_chat"."user2_id")
);
--> statement-breakpoint
CREATE TABLE "direct_chat_message" (
	"id" text PRIMARY KEY NOT NULL,
	"chat_id" text NOT NULL,
	"sender_id" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "direct_chat" ADD CONSTRAINT "direct_chat_user1_id_user_id_fk" FOREIGN KEY ("user1_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "direct_chat" ADD CONSTRAINT "direct_chat_user2_id_user_id_fk" FOREIGN KEY ("user2_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "direct_chat_message" ADD CONSTRAINT "direct_chat_message_chat_id_direct_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."direct_chat"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "direct_chat_message" ADD CONSTRAINT "direct_chat_message_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "direct_chat_unique_pair" ON "direct_chat" USING btree ("user1_id","user2_id");--> statement-breakpoint
CREATE INDEX "direct_chat_user1_idx" ON "direct_chat" USING btree ("user1_id");--> statement-breakpoint
CREATE INDEX "direct_chat_user2_idx" ON "direct_chat" USING btree ("user2_id");--> statement-breakpoint
CREATE INDEX "direct_chat_updated_at_idx" ON "direct_chat" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "direct_chat_message_chat_idx" ON "direct_chat_message" USING btree ("chat_id");--> statement-breakpoint
CREATE INDEX "direct_chat_message_created_at_idx" ON "direct_chat_message" USING btree ("chat_id","created_at");--> statement-breakpoint
CREATE INDEX "direct_chat_message_sender_idx" ON "direct_chat_message" USING btree ("sender_id");