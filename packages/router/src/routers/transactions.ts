import { ORPCError } from '@orpc/client';
import { call } from '@orpc/server';
import { TransactionInsert, transactions } from '@repo/db/schema/primary';
import { and, eq, gte, lte } from 'drizzle-orm';
import z from 'zod';
import type { Context } from '../../../../apps/server/src/lib/context';
import { db } from '../db';
import { protectedProcedure } from '../domain/orpc';
import { getUserBusinessProfile } from './business';

const getBusinessProfileId = async (context: Context) => {
  const business = await call(getUserBusinessProfile, {}, { context });
  return business.id;
};

export const createUpdateTransaction = protectedProcedure
  .input(
    z.object({
      transactionData: TransactionInsert.omit({ businessProfileId: true }),
    })
  )
  .handler(async ({ input, context }) => {
    const { transactionData } = input;
    const businessProfileId = await getBusinessProfileId(context);

    // Check if updating and validate ownership
    const existingTransaction = transactionData.id
      ? await db
          .select()
          .from(transactions)
          .where(eq(transactions.id, transactionData.id))
          .then((v) => v[0])
      : null;

    if (
      transactionData.id &&
      existingTransaction &&
      existingTransaction.businessProfileId !== businessProfileId
    ) {
      throw new ORPCError(
        'Transaction ID does not match your business profile'
      );
    }

    // Upsert
    const insertedUpdatedTransaction = await db
      .insert(transactions)
      .values({ ...transactionData, businessProfileId })
      .onConflictDoUpdate({
        target: transactions.id,
        set: {
          ...transactionData,
          businessProfileId,
          updatedAt: new Date(),
        },
      })
      .returning()
      .then((v) => v[0]);

    return insertedUpdatedTransaction;
  });

export const getUserTransactions = protectedProcedure
  .input(
    z
      .object({
        fromDate: z.date().optional(),
        toDate: z.date().optional(),
        type: z.enum(['PAYMENT', 'PAYOUT']).optional(),
      })
      .optional()
  )
  .handler(async ({ input, context }) => {
    const businessProfileId = await getBusinessProfileId(context);

    const conditions = [eq(transactions.businessProfileId, businessProfileId)];

    if (input?.fromDate) {
      conditions.push(gte(transactions.transactionDate, input.fromDate));
    }

    if (input?.toDate) {
      conditions.push(lte(transactions.transactionDate, input.toDate));
    }

    if (input?.type) {
      conditions.push(eq(transactions.type, input.type));
    }

    const whereClause =
      conditions.length > 1 ? and(...conditions) : conditions[0];

    const results = await db.select().from(transactions).where(whereClause);

    return results;
  });

export const deleteTransaction = protectedProcedure
  .input(z.object({ id: z.string() }))
  .handler(async ({ input, context }) => {
    const businessProfileId = await getBusinessProfileId(context);

    const existingTransaction = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, input.id))
      .then((v) => v[0]);

    if (
      !existingTransaction ||
      existingTransaction.businessProfileId !== businessProfileId
    ) {
      throw new ORPCError('No transaction found or unauthorized to delete');
    }

    const deletedTransaction = await db
      .delete(transactions)
      .where(eq(transactions.id, input.id))
      .returning()
      .then((v) => v[0]);

    return {
      success: true,
      message: 'Transaction deleted successfully',
      deletedTransaction,
    };
  });
