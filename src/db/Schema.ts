import { pgTable, text, timestamp, boolean, varchar, integer } from "drizzle-orm/pg-core";

// Table: users (Better Auth compatible)
export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  plan: text("plan").$type<"FREE" | "PREMIUM">().default("FREE").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

// Table: sessions (Better Auth compatible)
export const sessions = pgTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// Table: accounts (Better Auth compatible)
export const accounts = pgTable("accounts", {
  id: varchar("id", { length: 255 }).primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

// Table: verifications (Better Auth compatible)
export const verifications = pgTable("verifications", {
  id: varchar("id", { length: 255 }).primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

// Table: meetings
export const meetings = pgTable("meetings", {
  id: varchar("id", { length: 255 }).primaryKey(),
  hostId: varchar("host_id", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  roomName: text("room_name").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// Table: transactions
export const transactions = pgTable("transactions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  orderId: text("order_id").notNull(),
  status: text("status").$type<"settlement" | "pending" | "deny" | "expire">().notNull(),
  amount: integer("amount").notNull(),
});
