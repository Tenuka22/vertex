import { cashFlows } from '@repo/db/schema/primary';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { protectedProcedure } from '../domain/orpc';
import { getBusinessProfileId } from './business-information';

export const createUpdateCashFlow = protectedProcedure
  .input(
    z.object({
      id: z.string().optional(),
      transactionId: z.string(),
      cashFlowDirection: z.enum(['INCOMING', 'OUTGOING']),
      amount: z.number(),
      flowDate: z.date().optional(),
    })
  )
  .handler(async ({ input, context }) => {
    const businessProfileId = await getBusinessProfileId(context);
    if (!businessProfileId) {
      throw new Error('Business profile not found');
    }

    if (input.id) {
      return await db
        .update(cashFlows)
        .set({
          transactionId: input.transactionId,
          direction: input.cashFlowDirection,
          amount: input.amount.toString(),
          flowDate: input.flowDate || new Date(),
          updatedAt: new Date(),
        })
        .where(eq(cashFlows.id, input.id))
        .returning();
    }

    return await db
      .insert(cashFlows)
      .values({
        businessProfileId,
        transactionId: input.transactionId,
        direction: input.cashFlowDirection,
        amount: input.amount.toString(),
        flowDate: input.flowDate || new Date(),
      })
      .returning();
  });

export const getUserCashFlows = protectedProcedure.handler(
  async ({ context }) => {
    const businessProfileId = await getBusinessProfileId(context);
    if (!businessProfileId) {
      return [];
    }

    return await db
      .select()
      .from(cashFlows)
      .where(eq(cashFlows.businessProfileId, businessProfileId))
      .orderBy(desc(cashFlows.flowDate));
  }
);

export const deleteCashFlow = protectedProcedure
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    return await db
      .delete(cashFlows)
      .where(eq(cashFlows.id, input.id))
      .returning();
  });
