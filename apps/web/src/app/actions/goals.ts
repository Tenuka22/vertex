'use server';

import { goals } from '@repo/db/schema/primary';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { getUserBusinessProfile } from './business';

const getBusinessProfileId = async () => {
  const business = await getUserBusinessProfile();
  return business.id;
};

export async function createUpdateGoal(input: {
  id?: string;
  title: string;
  targetAmount: number;
  currentAmount?: number;
  deadline: string;
  status?: string;
  category: string;
}) {
  const businessProfileId = await getBusinessProfileId();

  if (input.id) {
    return await db
      .update(goals)
      .set({
        title: input.title,
        targetAmount: input.targetAmount.toString(),
        currentAmount: (input.currentAmount ?? 0).toString(),
        deadline: new Date(input.deadline),
        status: input.status,
        category: input.category,
        updatedAt: new Date(),
      })
      .where(eq(goals.id, input.id))
      .returning();
  }

  return await db
    .insert(goals)
    .values({
      businessProfileId,
      title: input.title,
      targetAmount: input.targetAmount.toString(),
      currentAmount: (input.currentAmount ?? 0).toString(),
      deadline: new Date(input.deadline),
      status: input.status,
      category: input.category,
    })
    .returning();
}

export async function getUserGoals() {
  const businessProfileId = await getBusinessProfileId();

  return await db
    .select()
    .from(goals)
    .where(eq(goals.businessProfileId, businessProfileId));
}

export async function deleteGoal(id: string) {
  return await db.delete(goals).where(eq(goals.id, id)).returning();
}
