import { pgEnum } from 'drizzle-orm/pg-core';

export const expenseCategoryEnum = pgEnum('expenseCategoryEnum', [
  'VEHICLE',
  'HOUSING',
  'FOOD',
  'SHOPPING',
  'ENTERTAINMENT',
  'EDUCATION',
  'HEALTHCARE',
  'OPTIONAL',
]);

export const transactionTypeEnum = pgEnum('transaction_type', [
  'PAYMENT',
  'PAYOUT',
]);

export const budgetCategoryEnum = pgEnum('budget_category', [
  'MARKETING',
  'OPERATIONS',
  'PAYROLL',
  'UTILITIES',
  'MISCELLANEOUS',
]);

export const cashFlowDirectionEnum = pgEnum('cash_flow_direction', [
  'INCOMING',
  'OUTGOING',
]);
