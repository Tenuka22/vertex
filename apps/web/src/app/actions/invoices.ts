'use server';

import { invoices } from '@repo/db/schema/primary';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { getUserBusinessProfile } from './business';

const getBusinessProfileId = async () => {
  const business = await getUserBusinessProfile();
  return business.id;
};

export async function createUpdateInvoice(input: {
  id?: string;
  invoiceNumber: string;
  customer: string;
  amount: number;
  status?: string;
  issueDate: string;
  dueDate: string;
}) {
  const businessProfileId = await getBusinessProfileId();

  if (input.id) {
    return await db
      .update(invoices)
      .set({
        invoiceNumber: input.invoiceNumber,
        customer: input.customer,
        amount: input.amount.toString(),
        status: input.status,
        issueDate: new Date(input.issueDate),
        dueDate: new Date(input.dueDate),
        updatedAt: new Date(),
      })
      .where(eq(invoices.id, input.id))
      .returning();
  }

  return await db
    .insert(invoices)
    .values({
      businessProfileId,
      invoiceNumber: input.invoiceNumber,
      customer: input.customer,
      amount: input.amount.toString(),
      status: input.status,
      issueDate: new Date(input.issueDate),
      dueDate: new Date(input.dueDate),
    })
    .returning();
}

export async function getUserInvoices() {
  const businessProfileId = await getBusinessProfileId();

  return await db
    .select()
    .from(invoices)
    .where(eq(invoices.businessProfileId, businessProfileId));
}

export async function deleteInvoice(id: string) {
  return await db.delete(invoices).where(eq(invoices.id, id)).returning();
}
