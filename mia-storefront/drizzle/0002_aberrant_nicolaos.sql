CREATE TABLE "conversation" (
	"id" text PRIMARY KEY NOT NULL,
	"sessionId" text NOT NULL,
	"storeDomain" text NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "digitalDownload" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"orderId" text NOT NULL,
	"productId" text NOT NULL,
	"customerEmail" text NOT NULL,
	"token" text NOT NULL,
	"downloadCount" integer DEFAULT 0 NOT NULL,
	"maxDownloads" integer DEFAULT 5 NOT NULL,
	"expiresAt" timestamp,
	"lastDownloadedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "digitalDownload_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "digitalOrder" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"orderNumber" text NOT NULL,
	"productId" text NOT NULL,
	"customerName" text NOT NULL,
	"customerEmail" text NOT NULL,
	"amountPaid" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'NGN' NOT NULL,
	"paymentMethod" text DEFAULT 'Bank Transfer' NOT NULL,
	"paymentReference" text,
	"status" text DEFAULT 'completed' NOT NULL,
	"note" text,
	"source" text DEFAULT 'manual' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "digitalProduct" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"productType" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"compareAtPrice" numeric(10, 2),
	"currency" text DEFAULT 'NGN' NOT NULL,
	"coverImageUrl" text,
	"fileUrl" text,
	"fileName" text,
	"fileType" text,
	"fileSizeBytes" integer,
	"status" text DEFAULT 'draft' NOT NULL,
	"salesCount" integer DEFAULT 0 NOT NULL,
	"revenue" numeric(10, 2) DEFAULT '0' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "paymentStatus" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "sessionId" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "shippedAt" timestamp;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "isActive" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "heroImage" text;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "customerCount" text DEFAULT '1.2k';--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_storeDomain_storeSettings_storeDomain_fk" FOREIGN KEY ("storeDomain") REFERENCES "public"."storeSettings"("storeDomain") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "digitalDownload" ADD CONSTRAINT "digitalDownload_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "digitalDownload" ADD CONSTRAINT "digitalDownload_orderId_digitalOrder_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."digitalOrder"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "digitalDownload" ADD CONSTRAINT "digitalDownload_productId_digitalProduct_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."digitalProduct"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "digitalOrder" ADD CONSTRAINT "digitalOrder_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "digitalOrder" ADD CONSTRAINT "digitalOrder_productId_digitalProduct_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."digitalProduct"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "digitalProduct" ADD CONSTRAINT "digitalProduct_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;