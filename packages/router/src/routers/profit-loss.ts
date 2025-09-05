import { expenseCategories, transactions } from '@repo/db/schema/primary';
import { and, eq, gte, lte, sum } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { protectedProcedure } from '../domain/orpc';
import { getBusinessProfileId } from './business-information';

export const getProfitLossData = protectedProcedure
  .input(
    z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
  )
  .handler(async ({ input, context }) => {
    const businessProfileId = await getBusinessProfileId(context);

    const startDate = input.startDate
      ? new Date(input.startDate)
      : new Date(new Date().getFullYear(), 0, 1);
    const endDate = input.endDate ? new Date(input.endDate) : new Date();

    const revenueData = await db
      .select({
        category: expenseCategories.name,
        revenue: sum(transactions.amount),
      })
      .from(transactions)
      .leftJoin(
        expenseCategories,
        eq(transactions.expenseCategoryId, expenseCategories.id)
      )
      .where(
        and(
          eq(transactions.businessProfileId, businessProfileId),
          eq(transactions.type, 'PAYMENT'),
          gte(transactions.transactionDate, startDate),
          lte(transactions.transactionDate, endDate)
        )
      )
      .groupBy(expenseCategories.name);

    const expenseData = await db
      .select({
        category: expenseCategories.name,
        expenses: sum(transactions.amount),
      })
      .from(transactions)
      .leftJoin(
        expenseCategories,
        eq(transactions.expenseCategoryId, expenseCategories.id)
      )
      .where(
        and(
          eq(transactions.businessProfileId, businessProfileId),
          eq(transactions.type, 'PAYOUT'),
          gte(transactions.transactionDate, startDate),
          lte(transactions.transactionDate, endDate)
        )
      )
      .groupBy(expenseCategories.name);

    const categories = new Set([
      ...revenueData.map((r) => r.category),
      ...expenseData.map((e) => e.category),
    ]);

    const profitLossData = Array.from(categories).map((category) => {
      const revenue =
        revenueData.find((r) => r.category === category)?.revenue || '0';
      const expenses =
        expenseData.find((e) => e.category === category)?.expenses || '0';

      return {
        id: category || 'uncategorized',
        category: category || 'Uncategorized',
        revenue: Number.parseFloat(revenue),
        expenses: Number.parseFloat(expenses),
      };
    });

    return profitLossData;
  });

export const getProfitLossSummary = protectedProcedure
  .input(
    z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
  )
  .handler(async ({ input, context }) => {
    const businessProfileId = await getBusinessProfileId(context);

    const startDate = input.startDate
      ? new Date(input.startDate)
      : new Date(new Date().getFullYear(), 0, 1);
    const endDate = input.endDate ? new Date(input.endDate) : new Date();

    const totalRevenueResult = await db
      .select({
        total: sum(transactions.amount),
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.businessProfileId, businessProfileId),
          eq(transactions.type, 'PAYMENT'),
          gte(transactions.transactionDate, startDate),
          lte(transactions.transactionDate, endDate)
        )
      );

    const totalExpensesResult = await db
      .select({
        total: sum(transactions.amount),
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.businessProfileId, businessProfileId),
          eq(transactions.type, 'PAYOUT'),
          gte(transactions.transactionDate, startDate),
          lte(transactions.transactionDate, endDate)
        )
      );

    const totalRevenue = Number.parseFloat(totalRevenueResult[0]?.total || '0');
    const totalExpenses = Number.parseFloat(
      totalExpensesResult[0]?.total || '0'
    );
    const netProfit = totalRevenue - totalExpenses;

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
    };
  });
