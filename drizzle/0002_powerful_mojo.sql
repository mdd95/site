CREATE TABLE "public_chat_message" (
	"id" text PRIMARY KEY NOT NULL,
	"sender_id" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
