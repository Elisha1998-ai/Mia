import {
  pgTable,
  text,
  timestamp,
  integer,
  numeric,
  boolean,
  primaryKey,
  decimal,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";

// Auth Tables
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  firstName: text("firstName"),
  lastName: text("lastName"),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export const productVariants = pgTable("productVariant", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  productId: text("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // e.g. "Red / Large"
  sku: text("sku").unique().notNull(),
  price: decimal("price", { precision: 10, scale: 2 }),
  stockQuantity: integer("stockQuantity").default(0).notNull(),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compoundKey: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

// Business Tables
export const products = pgTable("product", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
  externalId: text("externalId").unique(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  costOfGoods: decimal("costOfGoods", { precision: 10, scale: 2 }),
  sku: text("sku").unique().notNull(),
  stockQuantity: integer("stockQuantity").default(0).notNull(),
  imageUrl: text("imageUrl"),
  platform: text("platform"),
  aiNotes: text("aiNotes"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export const productsRelations = relations(products, ({ many }) => ({
  variants: many(productVariants),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}));

export const customers = pgTable("customer", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
  email: text("email").unique().notNull(),
  fullName: text("fullName"),
  phone: text("phone"),
  lifetimeValue: decimal("lifetimeValue", { precision: 10, scale: 2 })
    .default("0")
    .notNull(),
  aiNotes: text("aiNotes"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
}));

export const stores = pgTable("store", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  platform: text("platform").notNull(),
  storeUrl: text("storeUrl").unique().notNull(),
  accessToken: text("accessToken"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export const orders = pgTable("order", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
  orderNumber: text("orderNumber").unique().notNull(),
  externalId: text("externalId").unique(),
  status: text("status").notNull(),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  profitMargin: decimal("profitMargin", { precision: 10, scale: 2 }),
  shippingAddress: text("shippingAddress"),
  shippingMethod: text("shippingMethod"),
  paymentMethod: text("paymentMethod"),
  customerId: text("customerId").references(() => customers.id),
  storeId: text("storeId").references(() => stores.id),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  items: many(orderItems),
}));

export const orderItems = pgTable("orderItem", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderId: text("orderId")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("productId")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const inventoryLogs = pgTable("inventoryLog", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  productId: text("productId")
    .notNull()
    .references(() => products.id),
  change: integer("change").notNull(),
  reason: text("reason").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export const storeSettings = pgTable("storeSettings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
  storeName: text("storeName").default("Mia Electronics").notNull(),
  storeDomain: text("storeDomain").default("mia-electronics").notNull().unique(),
  niche: text("niche"),
  storeAddress: text("storeAddress"),
  storePhone: text("storePhone"),
  bankName: text("bankName"),
  accountName: text("accountName"),
  accountNumber: text("accountNumber"),
  socialInstagram: text("socialInstagram"),
  socialTwitter: text("socialTwitter"),
  socialFacebook: text("socialFacebook"),
  socialTiktok: text("socialTiktok"),
  socialYoutube: text("socialYoutube"),
  socialSnapchat: text("socialSnapchat"),
  currency: text("currency").default("Nigerian Naira (₦)").notNull(),
  location: text("location").default("Nigeria").notNull(),
  aiTone: text("aiTone").default("Professional & Helpful").notNull(),
  adminName: text("adminName").default("Jonathan Frazzelle").notNull(),
  adminEmail: text("adminEmail").default("jon@mia-agents.ai").notNull(),
  adminRole: text("adminRole").default("Store Owner").notNull(),
  primaryColor: text("primaryColor").default("#000000").notNull(),
  headingFont: text("headingFont").default("Instrument Serif").notNull(),
  bodyFont: text("bodyFont").default("Inter").notNull(),
  heroTitle: text("heroTitle"),
  heroDescription: text("heroDescription"),
  footerDescription: text("footerDescription"),
  onboardingCompleted: boolean("onboardingCompleted").default(false).notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export const discounts = pgTable("discount", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
  code: text("code").notNull(),
  type: text("type").notNull(), // 'percentage', 'fixed'
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull(), // 'Active', 'Scheduled', 'Expired'
  usageCount: integer("usageCount").default(0).notNull(),
  startDate: timestamp("startDate", { mode: "date" }).notNull(),
  endDate: timestamp("endDate", { mode: "date" }),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});
