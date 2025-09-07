'use server';

import { cashFlows } from '@repo/db/schema/primary';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { getUserBusinessProfile } from './business';

const getBusinessProfileId = async () => {
  const business = await getUserBusinessProfile();
  return business.id;
};

export async function createUpdateCashFlow(input: {
  id?: string;
  transactionId: string;
  cashFlowDirection: 'INCOMING' | 'OUTGOING';
  amount: number;
  flowDate?: Date;
}) {
  const businessProfileId = await getBusinessProfileId();
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
}

export async function getUserCashFlows() {
  const businessProfileId = await getBusinessProfileId();
  if (!businessProfileId) {
    return [];
  }

  return await db
    .select()
    .from(cashFlows)
    .where(eq(cashFlows.businessProfileId, businessProfileId))
    .orderBy(desc(cashFlows.flowDate));
}

export async function deleteCashFlow(id: string) {
  return await db.delete(cashFlows).where(eq(cashFlows.id, id)).returning();
}
