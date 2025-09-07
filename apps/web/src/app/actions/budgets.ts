'use server';

import { budgets } from '@repo/db/schema/primary';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { getUserBusinessProfile } from './business';

const getBusinessProfileId = async () => {
  const business = await getUserBusinessProfile();
  return business.id;
};

export async function createUpdateBudget(input: {
  id?: string;
  category:
    | 'MARKETING'
    | 'OPERATIONS'
    | 'PAYROLL'
    | 'UTILITIES'
    | 'MISCELLANEOUS';
  allocatedAmount: number;
  spentAmount?: number;
  periodStart: Date;
  periodEnd: Date;
}) {
  const businessProfileId = await getBusinessProfileId();
  if (!businessProfileId) {
    throw new Error('Business profile not found');
  }

  if (input.id) {
    return await db
      .update(budgets)
      .set({
        category: input.category,
        allocatedAmount: input.allocatedAmount.toString(),
        spentAmount: (input.spentAmount ?? 0).toString(),
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
      spentAmount: (input.spentAmount ?? 0).toString(),
      periodStart: input.periodStart,
      periodEnd: input.periodEnd,
    })
    .returning();
}

export async function getUserBudgets() {
  const businessProfileId = await getBusinessProfileId();
  if (!businessProfileId) {
    return [];
  }

  return await db
    .select()
    .from(budgets)
    .where(eq(budgets.businessProfileId, businessProfileId));
}

export async function deleteBudget(id: string) {
  return await db.delete(budgets).where(eq(budgets.id, id)).returning();
}
