import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  planName: text("plan_name").notNull(),
  pondCount: integer("pond_count").notNull(),
  monthlyAmount: integer("monthly_amount").notNull(),
  status: text("status").notNull(),
  nextDue: timestamp("next_due", { withTimezone: true }).notNull(),
  installedUnits: text("installed_units").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  periodStart: timestamp("period_start", { withTimezone: true }).notNull(),
  periodEnd: timestamp("period_end", { withTimezone: true }).notNull(),
  amount: integer("amount").notNull(),
  status: text("status").notNull(),
  paymentMethod: text("payment_method"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})
