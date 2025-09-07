'use server';

import { balanceSheetItems } from '@repo/db/schema/primary';
import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { getUserBusinessProfile } from './business';

const getBusinessProfileId = async () => {
  const business = await getUserBusinessProfile();
  return business.id;
};

export async function createUpdateBalanceSheetItem(input: {
  id?: string;
  title: string;
  description?: string;
  amount: number;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY';
}) {
  const businessProfileId = await getBusinessProfileId();

  if (input.id) {
    return await db
      .update(balanceSheetItems)
      .set({
        title: input.title,
        description: input.description,
        amount: input.amount.toString(),
        type: input.type,
        updatedAt: new Date(),
      })
      .where(eq(balanceSheetItems.id, input.id))
      .returning()
      .then((result) => result[0]);
  }

  return await db
    .insert(balanceSheetItems)
    .values({
      businessProfileId,
      title: input.title,
      description: input.description,
      amount: input.amount.toString(),
      type: input.type,
    })
    .returning()
    .then((result) => result[0]);
}

export async function getUserBalanceSheetItems() {
  const businessProfileId = await getBusinessProfileId();

  return await db
    .select({
      id: balanceSheetItems.id,
      title: balanceSheetItems.title,
      description: balanceSheetItems.description,
      amount: balanceSheetItems.amount,
      type: balanceSheetItems.type,
      createdAt: balanceSheetItems.createdAt,
      updatedAt: balanceSheetItems.updatedAt,
    })
    .from(balanceSheetItems)
    .where(eq(balanceSheetItems.businessProfileId, businessProfileId));
}

export async function deleteBalanceSheetItem(id: string) {
  await getBusinessProfileId();

  return await db
    .delete(balanceSheetItems)
    .where(eq(balanceSheetItems.id, id))
    .returning()
    .then((result) => result[0]);
}
