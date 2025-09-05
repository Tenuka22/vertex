import { pgEnum } from 'drizzle-orm/pg-core';

export const expenseCategoryEnum = pgEnum('expenseCategoryEnum', [
  'VEHICLE',
  'HOUSING',
  'SALES',
  'FOOD',
  'SHOPPING',
  'ENTERTAINMENT',
  'EDUCATION',
  'HEALTHCARE',
  'SUPPLIES',
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

export const paymentMethodEnum = pgEnum('payment_method', [
  'BANK',
  'CASH',
  'CARD_CREDIT',
  'DIGITAL_WALLET',
  'OTHER',
]);

export const balanceSheetItemTypeEnum = pgEnum('balance_sheet_item_type', [
  'ASSET',
  'LIABILITY',
  'EQUITY',
]);
