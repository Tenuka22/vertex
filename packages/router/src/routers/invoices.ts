import { invoices } from '@repo/db/schema/primary';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { protectedProcedure } from '../domain/orpc';
import { getBusinessProfileId } from './business-information';

export const createUpdateInvoice = protectedProcedure
  .input(
    z.object({
      id: z.string().optional(),
      invoiceNumber: z.string(),
      customer: z.string(),
      amount: z.number(),
      status: z.string().default('pending'),
      issueDate: z.string(),
      dueDate: z.string(),
    })
  )
  .handler(async ({ input, context }) => {
    const businessProfileId = await getBusinessProfileId(context);

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
  });

export const getUserInvoices = protectedProcedure.handler(
  async ({ context }) => {
    const businessProfileId = await getBusinessProfileId(context);

    return await db
      .select()
      .from(invoices)
      .where(eq(invoices.businessProfileId, businessProfileId));
  }
);

export const deleteInvoice = protectedProcedure
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    return await db
      .delete(invoices)
      .where(eq(invoices.id, input.id))
      .returning();
  });
