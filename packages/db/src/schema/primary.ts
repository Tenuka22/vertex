import {
  boolean,
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { user } from './auth';
import {
  budgetCategoryEnum,
  cashFlowDirectionEnum,
  expenseCategoryEnum,
  transactionTypeEnum,
} from './enums';

// biome-ignore lint/performance/noBarrelFile: Needs the Schema
export * from './auth';
export * from './enums';

export const businessProfile = pgTable('business_profile', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('userId')
    .notNull()
    .references(() => user.id),

  companyName: varchar('company_name', { length: 255 }).notNull(),
  legalName: varchar('legal_name', { length: 255 }),
  tradingName: varchar('trading_name', { length: 255 }),

  email: varchar('email', { length: 255 }).notNull(),
  twitter: varchar('twitter', { length: 255 }).notNull(),
  linkedin: varchar('linkedin', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  website: varchar('website', { length: 255 }),

  addressLine1: varchar('address_line_1', { length: 255 }),
  addressLine2: varchar('address_line_2', { length: 255 }),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  postalCode: varchar('postal_code', { length: 20 }),
  country: varchar('country', { length: 100 }),

  industry: varchar('industry', { length: 100 }),
  businessType: varchar('business_type', { length: 50 }),
  employeeCount: integer('employee_count'),
  foundedYear: integer('founded_year'),

  logoUrl: text('logo_url'),
  brandColor: varchar('brand_color', { length: 7 }),

  description: text('description'),
  mission: text('mission'),
  vision: text('vision'),

  isActive: boolean('is_active').default(true),
  isVerified: boolean('is_verified').default(false),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const businessInformation = pgTable('business_information', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessProfileId: uuid('business_profile_id')
    .references(() => businessProfile.id, { onDelete: 'cascade' })
    .notNull(),

  taxId: varchar('tax_id', { length: 50 }),
  registrationNumber: varchar('registration_number', { length: 100 }),
  businessLicense: varchar('business_license', { length: 100 }),

  baseCurrency: varchar('base_currency', { length: 3 }).default('USD'),
  fiscalYearEnd: varchar('fiscal_year_end', { length: 5 }),

  defaultBankAccount: varchar('default_bank_account', { length: 100 }),

  timezone: varchar('timezone', { length: 50 }).default('UTC'),
  dateFormat: varchar('date_format', { length: 20 }).default('MM/dd/yyyy'),
  numberFormat: varchar('number_format', { length: 20 }).default('en-US'),

  businessHoursStart: varchar('business_hours_start', { length: 8 }),
  businessHoursEnd: varchar('business_hours_end', { length: 8 }),
  operatingDays: varchar('operating_days', { length: 50 }),

  certifications: text('certifications'),
  complianceNotes: text('compliance_notes'),

  socialMediaLinks: text('social_media_links'),
  internalNotes: text('internal_notes'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const businessContacts = pgTable('business_contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessProfileId: uuid('business_profile_id')
    .references(() => businessProfile.id, { onDelete: 'cascade' })
    .notNull(),

  contactType: varchar('contact_type', { length: 50 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  title: varchar('title', { length: 100 }),
  department: varchar('department', { length: 100 }),

  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  mobile: varchar('mobile', { length: 50 }),

  isPrimary: boolean('is_primary').default(false),
  isActive: boolean('is_active').default(true),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const businessLocations = pgTable('business_locations', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessProfileId: uuid('business_profile_id')
    .references(() => businessProfile.id, { onDelete: 'cascade' })
    .notNull(),

  locationName: varchar('location_name', { length: 255 }).notNull(),
  locationType: varchar('location_type', { length: 50 }),

  addressLine1: varchar('address_line_1', { length: 255 }).notNull(),
  addressLine2: varchar('address_line_2', { length: 255 }),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }),
  postalCode: varchar('postal_code', { length: 20 }),
  country: varchar('country', { length: 100 }).notNull(),

  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),

  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),

  isHeadquarters: boolean('is_headquarters').default(false),
  isActive: boolean('is_active').default(true),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const expenseCategories = pgTable('expense_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessProfileId: uuid('business_profile_id')
    .references(() => businessProfile.id, { onDelete: 'cascade' })
    .notNull(),
  name: expenseCategoryEnum('name').notNull(),
  status: varchar('status', { length: 20 }).default('active').notNull(),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const expenses = pgTable('expenses', {
  id: uuid('id').primaryKey().defaultRandom(),
  expenseCategoryId: uuid('expense_category_id')
    .references(() => expenseCategories.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  frequency: varchar('frequency', { length: 50 }).notNull(),
  status: varchar('status', { length: 20 }).default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessProfileId: uuid('business_profile_id')
    .references(() => businessProfile.id, { onDelete: 'cascade' })
    .notNull(),

  expenseCategoryId: uuid('expense_category_id').references(
    () => expenseCategories.id
  ),

  type: transactionTypeEnum('type').notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  description: text('description'),
  transactionDate: timestamp('transaction_date').defaultNow().notNull(),
  reference: varchar('reference', { length: 255 }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const cashFlows = pgTable('cash_flows', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessProfileId: uuid('business_profile_id')
    .references(() => businessProfile.id, { onDelete: 'cascade' })
    .notNull(),

  transactionId: uuid('transaction_id')
    .references(() => transactions.id, { onDelete: 'cascade' })
    .notNull(),

  direction: cashFlowDirectionEnum('cash_flow_direction').notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  flowDate: timestamp('flow_date').defaultNow().notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const budgets = pgTable('budgets', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessProfileId: uuid('business_profile_id')
    .references(() => businessProfile.id, { onDelete: 'cascade' })
    .notNull(),

  category: budgetCategoryEnum('category').notNull(),
  allocatedAmount: decimal('allocated_amount', {
    precision: 12,
    scale: 2,
  }).notNull(),
  spentAmount: decimal('spent_amount', { precision: 12, scale: 2 }).notNull(),

  periodStart: timestamp('period_start').notNull(),
  periodEnd: timestamp('period_end').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
export const TransactionSelect = createSelectSchema(transactions);
export const TransactionInsert = createInsertSchema(transactions);

export type CashFlow = typeof cashFlows.$inferSelect;
export type NewCashFlow = typeof cashFlows.$inferInsert;
export const CashFlowSelect = createSelectSchema(cashFlows);
export const CashFlowInsert = createInsertSchema(cashFlows);

export type Budget = typeof budgets.$inferSelect;
export type NewBudget = typeof budgets.$inferInsert;
export const BudgetSelect = createSelectSchema(budgets);
export const BudgetInsert = createInsertSchema(budgets);

export type ExpenseCategory = typeof expenseCategories.$inferSelect;
export type NewExpenseCategory = typeof expenseCategories.$inferInsert;
export const ExpenseCategorySelect = createSelectSchema(expenseCategories);
export const ExpenseCategoryInsert = createInsertSchema(expenseCategories);

export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
export const ExpenseSelect = createSelectSchema(expenses);
export const ExpenseInsert = createInsertSchema(expenses);

export type BusinessProfile = typeof businessProfile.$inferSelect;
export const BusinessProfileSelect = createSelectSchema(businessProfile);
export const BusinessProfileInsert = createInsertSchema(businessProfile);
export type NewBusinessProfile = typeof businessProfile.$inferInsert;

export type BusinessInformation = typeof businessInformation.$inferSelect;
export type NewBusinessInformation = typeof businessInformation.$inferInsert;
export const BusinessInformationSelect =
  createSelectSchema(businessInformation);
export const BusinessInformationInsert =
  createInsertSchema(businessInformation);

export type BusinessContact = typeof businessContacts.$inferSelect;
export type NewBusinessContact = typeof businessContacts.$inferInsert;

export type BusinessLocation = typeof businessLocations.$inferSelect;
export type NewBusinessLocation = typeof businessLocations.$inferInsert;
export const BusinessLocationSelect = createSelectSchema(businessLocations);
export const BusinessLocationInsert = createInsertSchema(businessLocations);

export const businessProfileInsertSchema = createInsertSchema(businessProfile);
export const businessProfileSelectSchema = createSelectSchema(businessProfile);
