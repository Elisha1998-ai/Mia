CREATE TABLE "discount" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text,
	"code" text NOT NULL,
	"type" text NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"status" text NOT NULL,
	"usageCount" integer DEFAULT 0 NOT NULL,
	"startDate" timestamp NOT NULL,
	"endDate" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "productVariant" (
	"id" text PRIMARY KEY NOT NULL,
	"productId" text NOT NULL,
	"name" text NOT NULL,
	"sku" text NOT NULL,
	"price" numeric(10, 2),
	"stockQuantity" integer DEFAULT 0 NOT NULL,
	"imageUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "productVariant_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
ALTER TABLE "storeSettings" ALTER COLUMN "currency" SET DEFAULT 'Nigerian Naira (₦)';--> statement-breakpoint
ALTER TABLE "storeSettings" ALTER COLUMN "location" SET DEFAULT 'Nigeria';--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "userId" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "userId" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "shippingAddress" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "shippingMethod" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "paymentMethod" text;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "userId" text;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "userId" text;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "niche" text;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "storeAddress" text;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "storePhone" text;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "bankName" text;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "accountName" text;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "accountNumber" text;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "socialInstagram" text;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "socialTwitter" text;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "socialFacebook" text;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "socialTiktok" text;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "socialYoutube" text;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "socialSnapchat" text;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "senderName" text DEFAULT 'Pony Store';--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "senderEmail" text;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "storeLogo" text;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "primaryColor" text DEFAULT '#000000' NOT NULL;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "headingFont" text DEFAULT 'Instrument Serif' NOT NULL;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "bodyFont" text DEFAULT 'Inter' NOT NULL;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "buttonRadius" text DEFAULT '0.5rem';--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "heroTitle" text;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "heroDescription" text;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "footerDescription" text;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "paystackEnabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "flutterwaveEnabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "shippingEnabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD COLUMN "onboardingCompleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "userId" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "firstName" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "lastName" text;--> statement-breakpoint
ALTER TABLE "discount" ADD CONSTRAINT "discount_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productVariant" ADD CONSTRAINT "productVariant_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer" ADD CONSTRAINT "customer_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD CONSTRAINT "storeSettings_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store" ADD CONSTRAINT "store_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "storeSettings" ADD CONSTRAINT "storeSettings_storeDomain_unique" UNIQUE("storeDomain");