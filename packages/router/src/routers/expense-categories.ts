import { expenseCategories } from '@repo/db/schema/primary';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { protectedProcedure } from '../domain/orpc';
import { getBusinessProfileId } from './business-information';

export const createUpdateExpenseCategory = protectedProcedure
  .input(
    z.object({
      id: z.string().optional(),
      name: z.enum([
        'VEHICLE',
        'HOUSING',
        'SALES',
        'FOOD',
        'SHOPPING',
        'ENTERTAINMENT',
        'EDUCATION',
        'HEALTHCARE',
        'SUPPLIES',
        'OPTIONAL',
      ]),
      status: z.string().default('active'),
    })
  )
  .handler(async ({ input, context }) => {
    const businessProfileId = await getBusinessProfileId(context);
    if (!businessProfileId) {
      throw new Error('Business profile not found');
    }

    if (input.id) {
      return await db
        .update(expenseCategories)
        .set({
          name: input.name,
          status: input.status,
          lastUpdated: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(expenseCategories.id, input.id))
        .returning();
    }

    return await db
      .insert(expenseCategories)
      .values({
        businessProfileId,
        name: input.name,
        status: input.status,
      })
      .returning();
  });

export const getUserExpenseCategories = protectedProcedure.handler(
  async ({ context }) => {
    const businessProfileId = await getBusinessProfileId(context);
    if (!businessProfileId) {
      return [];
    }

    return await db
      .select()
      .from(expenseCategories)
      .where(eq(expenseCategories.businessProfileId, businessProfileId));
  }
);

export const deleteExpenseCategory = protectedProcedure
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    return await db
      .delete(expenseCategories)
      .where(eq(expenseCategories.id, input.id))
      .returning();
  });
