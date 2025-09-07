'use server';

import { TransactionInsert, transactions } from '@repo/db/schema/primary';
import { and, eq, gte, lte } from 'drizzle-orm';
import type z from 'zod';
import { db } from '@/lib/db';
import { getUserBusinessProfile } from './business';

const getBusinessProfileId = async () => {
  const business = await getUserBusinessProfile();
  return business.id;
};

export async function createUpdateTransaction(
  transactionData: z.infer<
    typeof TransactionInsert.omit<{ businessProfileId: true }>
  >
) {
  const businessProfileId = await getBusinessProfileId();

  const parsedTransactionData = TransactionInsert.omit({
    businessProfileId: true,
  }).parse(transactionData);

  const existingTransaction = parsedTransactionData.id
    ? await db
        .select()
        .from(transactions)
        .where(eq(transactions.id, parsedTransactionData.id))
        .then((v) => v[0])
    : null;

  if (
    parsedTransactionData.id &&
    existingTransaction &&
    existingTransaction.businessProfileId !== businessProfileId
  ) {
    throw new Error('Transaction ID does not match your business profile');
  }

  const insertedUpdatedTransaction = await db
    .insert(transactions)
    .values({ ...parsedTransactionData, businessProfileId })
    .onConflictDoUpdate({
      target: transactions.id,
      set: {
        ...parsedTransactionData,
        businessProfileId,
        updatedAt: new Date(),
      },
    })
    .returning()
    .then((v) => v[0]);

  return insertedUpdatedTransaction;
}

export async function getUserTransactions(input?: {
  fromDate?: Date;
  toDate?: Date;
  type?: 'PAYMENT' | 'PAYOUT';
}) {
  const businessProfileId = await getBusinessProfileId();

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
}

export async function deleteTransaction(id: string) {
  const businessProfileId = await getBusinessProfileId();

  const existingTransaction = await db
    .select()
    .from(transactions)
    .where(eq(transactions.id, id))
    .then((v) => v[0]);

  if (
    !existingTransaction ||
    existingTransaction.businessProfileId !== businessProfileId
  ) {
    throw new Error('No transaction found or unauthorized to delete');
  }

  const deletedTransaction = await db
    .delete(transactions)
    .where(eq(transactions.id, id))
    .returning()
    .then((v) => v[0]);

  return {
    success: true,
    message: 'Transaction deleted successfully',
    deletedTransaction,
  };
}
