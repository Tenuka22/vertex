import { balanceSheetItems } from '@repo/db/schema/primary';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { protectedProcedure } from '../domain/orpc';
import { getBusinessProfileId } from './business-information';

export const createUpdateBalanceSheetItem = protectedProcedure
  .input(
    z.object({
      id: z.string().optional(),
      title: z.string().min(1),
      description: z.string().optional(),
      amount: z.number(),
      type: z.enum(['ASSET', 'LIABILITY', 'EQUITY']),
    })
  )
  .handler(async ({ input, context }) => {
    const businessProfileId = await getBusinessProfileId(context);

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
  });

export const getUserBalanceSheetItems = protectedProcedure.handler(
  async ({ context }) => {
    const businessProfileId = await getBusinessProfileId(context);

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
);

export const deleteBalanceSheetItem = protectedProcedure
  .input(z.object({ id: z.string() }))
  .handler(async ({ input, context }) => {
    await getBusinessProfileId(context);

    return await db
      .delete(balanceSheetItems)
      .where(eq(balanceSheetItems.id, input.id))
      .returning()
      .then((result) => result[0]);
  });
