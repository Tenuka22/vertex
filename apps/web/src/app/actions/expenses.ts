'use server';

import { expenseCategories, expenses } from '@repo/db/schema/primary';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';

export async function createUpdateExpense(input: {
  id?: string;
  expenseCategoryId: string;
  name: string;
  frequency: string;
  status?: string;
}) {
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
}

export async function getUserExpenses() {
  return await db
    .select()
    .from(expenses)
    .innerJoin(
      expenseCategories,
      eq(expenses.expenseCategoryId, expenseCategories.id)
    );
}

export async function deleteExpense(id: string) {
  return await db.delete(expenses).where(eq(expenses.id, id)).returning();
}
