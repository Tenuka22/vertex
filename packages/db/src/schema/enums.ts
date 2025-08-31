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
