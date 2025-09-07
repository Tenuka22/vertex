'use server';

import { expenseCategories } from '@repo/db/schema/primary';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { getUserBusinessProfile } from './business';

const getBusinessProfileId = async () => {
  const business = await getUserBusinessProfile();
  return business.id;
};

export async function createUpdateExpenseCategory(input: {
  id?: string;
  name:
    | 'VEHICLE'
    | 'HOUSING'
    | 'SALES'
    | 'FOOD'
    | 'SHOPPING'
    | 'ENTERTAINMENT'
    | 'EDUCATION'
    | 'HEALTHCARE'
    | 'SUPPLIES'
    | 'OPTIONAL';
  status?: string;
}) {
  const businessProfileId = await getBusinessProfileId();
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
}

export async function getUserExpenseCategories() {
  const businessProfileId = await getBusinessProfileId();
  if (!businessProfileId) {
    return [];
  }

  return await db
    .select()
    .from(expenseCategories)
    .where(eq(expenseCategories.businessProfileId, businessProfileId));
}

export async function deleteExpenseCategory(id: string) {
  return await db
    .delete(expenseCategories)
    .where(eq(expenseCategories.id, id))
    .returning();
}
