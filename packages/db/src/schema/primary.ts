import {
  boolean,
  decimal,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { user } from './auth';
import {
  balanceSheetItemTypeEnum,
  budgetCategoryEnum,
  cashFlowDirectionEnum,
  expenseCategoryEnum,
  paymentMethodEnum,
  transactionTypeEnum,
} from './enums';
import type { PaymentMethodDetails } from './types';

// biome-ignore lint/performance/noBarrelFile: Needs the Schema
export * from './auth';
export * from './enums';

export const businessProfile = pgTable('business_profile', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
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
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  businessProfileId: text('business_profile_id')
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
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  businessProfileId: text('business_profile_id')
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
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  businessProfileId: text('business_profile_id')
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
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  businessProfileId: text('business_profile_id')
    .references(() => businessProfile.id, { onDelete: 'cascade' })
    .notNull(),
  name: expenseCategoryEnum('name').notNull(),
  status: varchar('status', { length: 20 }).default('active').notNull(),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const expenses = pgTable('expenses', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  expenseCategoryId: text('expense_category_id')
    .references(() => expenseCategories.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  frequency: varchar('frequency', { length: 50 }).notNull(),
  status: varchar('status', { length: 20 }).default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const paymentMethods = pgTable('payment_methods', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  businessProfileId: text('business_profile_id')
    .references(() => businessProfile.id, { onDelete: 'cascade' })
    .notNull(),

  type: paymentMethodEnum('payment_method_type').notNull(),
  details: jsonb('details').$type<PaymentMethodDetails>(),
  isActive: boolean('is_active').default(true).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const transactions = pgTable('transactions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  businessProfileId: text('business_profile_id')
    .references(() => businessProfile.id, { onDelete: 'cascade' })
    .notNull(),
  paymentMethodId: text('payment_method_id').references(
    () => paymentMethods.id
  ),
  expenseCategoryId: text('expense_category_id').references(
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
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  businessProfileId: text('business_profile_id')
    .references(() => businessProfile.id, { onDelete: 'cascade' })
    .notNull(),

  transactionId: text('transaction_id')
    .references(() => transactions.id, { onDelete: 'cascade' })
    .notNull(),

  direction: cashFlowDirectionEnum('cash_flow_direction').notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  flowDate: timestamp('flow_date').defaultNow().notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const budgets = pgTable('budgets', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  businessProfileId: text('business_profile_id')
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

export const goals = pgTable('goals', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  businessProfileId: text('business_profile_id')
    .references(() => businessProfile.id, { onDelete: 'cascade' })
    .notNull(),

  title: varchar('title', { length: 255 }).notNull(),
  targetAmount: decimal('target_amount', { precision: 12, scale: 2 }).notNull(),
  currentAmount: decimal('current_amount', { precision: 12, scale: 2 })
    .default('0')
    .notNull(),
  deadline: timestamp('deadline').notNull(),
  status: varchar('status', { length: 20 }).default('active').notNull(),
  category: varchar('category', { length: 100 }).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const invoices = pgTable('invoices', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  businessProfileId: text('business_profile_id')
    .references(() => businessProfile.id, { onDelete: 'cascade' })
    .notNull(),

  invoiceNumber: varchar('invoice_number', { length: 100 }).notNull(),
  customer: varchar('customer', { length: 255 }).notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  issueDate: timestamp('issue_date').defaultNow().notNull(),
  dueDate: timestamp('due_date').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const products = pgTable('products', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  businessProfileId: text('business_profile_id')
    .references(() => businessProfile.id, { onDelete: 'cascade' })
    .notNull(),

  name: varchar('name', { length: 255 }).notNull(),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  type: varchar('type', { length: 50 }).default('Product').notNull(),
  status: varchar('status', { length: 20 }).default('active').notNull(),
  description: text('description'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const suppliers = pgTable('suppliers', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  businessProfileId: text('business_profile_id')
    .references(() => businessProfile.id, { onDelete: 'cascade' })
    .notNull(),

  name: varchar('name', { length: 255 }).notNull(),
  contactPerson: varchar('contact_person', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  status: varchar('status', { length: 20 }).default('active').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const inventory = pgTable('inventory', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  businessProfileId: text('business_profile_id')
    .references(() => businessProfile.id, { onDelete: 'cascade' })
    .notNull(),
  productId: text('product_id')
    .references(() => products.id, { onDelete: 'cascade' })
    .notNull(),

  quantity: integer('quantity').default(0).notNull(),
  minStockLevel: integer('min_stock_level').default(0).notNull(),
  maxStockLevel: integer('max_stock_level').default(0).notNull(),
  unitCost: decimal('unit_cost', { precision: 12, scale: 2 }),
  location: varchar('location', { length: 255 }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const purchaseOrders = pgTable('purchase_orders', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  businessProfileId: text('business_profile_id')
    .references(() => businessProfile.id, { onDelete: 'cascade' })
    .notNull(),
  supplierId: text('supplier_id')
    .references(() => suppliers.id, { onDelete: 'cascade' })
    .notNull(),

  orderNumber: varchar('order_number', { length: 100 }).notNull(),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  orderDate: timestamp('order_date').defaultNow().notNull(),
  expectedDelivery: timestamp('expected_delivery'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const balanceSheetItems = pgTable('balance_sheet_items', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  businessProfileId: text('business_profile_id')
    .references(() => businessProfile.id, { onDelete: 'cascade' })
    .notNull(),

  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  type: balanceSheetItemTypeEnum('type').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Goal = typeof goals.$inferSelect;
export type NewGoal = typeof goals.$inferInsert;
export const GoalSelect = createSelectSchema(goals);
export const GoalInsert = createInsertSchema(goals);

export type BalanceSheetItem = typeof balanceSheetItems.$inferSelect;
export type NewBalanceSheetItem = typeof balanceSheetItems.$inferInsert;
export const BalanceSheetItemSelect = createSelectSchema(balanceSheetItems);
export const BalanceSheetItemInsert = createInsertSchema(balanceSheetItems);

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export const InvoiceSelect = createSelectSchema(invoices);
export const InvoiceInsert = createInsertSchema(invoices);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export const ProductSelect = createSelectSchema(products);
export const ProductInsert = createInsertSchema(products);

export type Supplier = typeof suppliers.$inferSelect;
export type NewSupplier = typeof suppliers.$inferInsert;
export const SupplierSelect = createSelectSchema(suppliers);
export const SupplierInsert = createInsertSchema(suppliers);

export type Inventory = typeof inventory.$inferSelect;
export type NewInventory = typeof inventory.$inferInsert;
export const InventorySelect = createSelectSchema(inventory);
export const InventoryInsert = createInsertSchema(inventory);

export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type NewPurchaseOrder = typeof purchaseOrders.$inferInsert;
export const PurchaseOrderSelect = createSelectSchema(purchaseOrders);
export const PurchaseOrderInsert = createInsertSchema(purchaseOrders);

export const businessProfileInsertSchema = createInsertSchema(businessProfile);
export const businessProfileSelectSchema = createSelectSchema(businessProfile);

export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type NewPaymentMethod = typeof paymentMethods.$inferInsert;
export const PaymentMethodSelect = createSelectSchema(paymentMethods);
export const PaymentMethodInsert = createInsertSchema(paymentMethods);

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
