import { expenseCategories, expenses } from '@repo/db/schema/primary';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { protectedProcedure } from '../domain/orpc';

export const createUpdateExpense = protectedProcedure
  .input(
    z.object({
      id: z.string().optional(),
      expenseCategoryId: z.string(),
      name: z.string(),
      frequency: z.string(),
      status: z.string().default('active'),
    })
  )
  .handler(async ({ input }) => {
    if (input.id) {
      return await db
        .update(expenses)
        .set({
          expenseCategoryId: input.expenseCategoryId,
          name: input.name,
          frequency: input.frequency,
          status: input.status,
          updatedAt: new Date(),
        })
        .where(eq(expenses.id, input.id))
        .returning();
    }

    return await db
      .insert(expenses)
      .values({
        expenseCategoryId: input.expenseCategoryId,
        name: input.name,
        frequency: input.frequency,
        status: input.status,
      })
      .returning();
  });

export const getUserExpenses = protectedProcedure.handler(async () => {
  return await db
    .select()
    .from(expenses)
    .innerJoin(
      expenseCategories,
      eq(expenses.expenseCategoryId, expenseCategories.id)
    );
});

export const deleteExpense = protectedProcedure
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    return await db
      .delete(expenses)
      .where(eq(expenses.id, input.id))
      .returning();
  });
