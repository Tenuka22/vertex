import { budgets } from '@repo/db/schema/primary';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { protectedProcedure } from '../domain/orpc';
import { getBusinessProfileId } from './business-information';

export const createUpdateBudget = protectedProcedure
  .input(
    z.object({
      id: z.string().optional(),
      category: z.enum([
        'MARKETING',
        'OPERATIONS',
        'PAYROLL',
        'UTILITIES',
        'MISCELLANEOUS',
      ]),
      allocatedAmount: z.number(),
      spentAmount: z.number().default(0),
      periodStart: z.date(),
      periodEnd: z.date(),
    })
  )
  .handler(async ({ input, context }) => {
    const businessProfileId = await getBusinessProfileId(context);
    if (!businessProfileId) {
      throw new Error('Business profile not found');
    }

    if (input.id) {
      return await db
        .update(budgets)
        .set({
          category: input.category,
          allocatedAmount: input.allocatedAmount.toString(),
          spentAmount: input.spentAmount.toString(),
          periodStart: input.periodStart,
          periodEnd: input.periodEnd,
          updatedAt: new Date(),
        })
        .where(eq(budgets.id, input.id))
        .returning();
    }

    return await db
      .insert(budgets)
      .values({
        businessProfileId,
        category: input.category,
        allocatedAmount: input.allocatedAmount.toString(),
        spentAmount: input.spentAmount.toString(),
        periodStart: input.periodStart,
        periodEnd: input.periodEnd,
      })
      .returning();
  });

export const getUserBudgets = protectedProcedure.handler(
  async ({ context }) => {
    const businessProfileId = await getBusinessProfileId(context);
    if (!businessProfileId) {
      return [];
    }

    return await db
      .select()
      .from(budgets)
      .where(eq(budgets.businessProfileId, businessProfileId));
  }
);

export const deleteBudget = protectedProcedure
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    return await db.delete(budgets).where(eq(budgets.id, input.id)).returning();
  });
