import type { Config } from "@netlify/functions"
import { desc, eq } from "drizzle-orm"
import { db } from "../../db/client"
import { invoices, subscriptions } from "../../db/schema"

const demoUserId = "AG-USER-4412"

async function ensureDemoSubscription() {
  const existing = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, demoUserId),
  })

  if (existing) return existing

  const [created] = await db
    .insert(subscriptions)
    .values({
      userId: demoUserId,
      planName: "HaaS Pro 3 Kolam",
      pondCount: 3,
      monthlyAmount: 1_050_000,
      status: "active",
      nextDue: new Date("2026-09-25T00:00:00+07:00"),
      installedUnits: "3 Unit Multi-Sensor + 1 IoT Gateway 4G",
    })
    .returning()

  await db
    .insert(invoices)
    .values({
      userId: demoUserId,
      invoiceNumber: "INV-AG-2026-0925",
      periodStart: new Date("2026-09-25T00:00:00+07:00"),
      periodEnd: new Date("2026-10-25T00:00:00+07:00"),
      amount: 1_050_000,
      status: "pending",
    })
    .onConflictDoNothing()

  return created
}

async function getPayload() {
  const subscription = await ensureDemoSubscription()
  const invoice = await db.query.invoices.findFirst({
    where: eq(invoices.userId, demoUserId),
    orderBy: [desc(invoices.createdAt)],
  })
  return { subscription, invoice }
}

export default async (request: Request) => {
  if (request.method === "GET") {
    return Response.json(await getPayload())
  }

  if (request.method !== "POST") {
    return Response.json({ error: "Metode tidak didukung." }, { status: 405 })
  }

  const body = (await request.json()) as { action?: string; paymentMethod?: string }
  await ensureDemoSubscription()

  if (body.action === "simulate-overdue") {
    await db
      .update(subscriptions)
      .set({ status: "overdue", nextDue: new Date("2026-09-05T00:00:00+07:00"), updatedAt: new Date() })
      .where(eq(subscriptions.userId, demoUserId))
  } else if (body.action === "pay") {
    await db
      .update(subscriptions)
      .set({ status: "active", nextDue: new Date("2026-10-25T00:00:00+07:00"), updatedAt: new Date() })
      .where(eq(subscriptions.userId, demoUserId))
    await db
      .update(invoices)
      .set({ status: "paid", paymentMethod: body.paymentMethod || "QRIS", paidAt: new Date() })
      .where(eq(invoices.invoiceNumber, "INV-AG-2026-0925"))
  } else {
    return Response.json({ error: "Aksi tidak dikenali." }, { status: 400 })
  }

  return Response.json(await getPayload())
}

export const config: Config = {
  path: "/api/subscription",
}
