/** biome-ignore-all lint/suspicious/noConsole: Console Required */
import { faker } from '@faker-js/faker';
import { db as creatDB } from '@repo/db';
import {
  type BusinessProfile,
  balanceSheetItems,
  balanceSheetItemTypeEnum,
  budgetCategoryEnum,
  budgets,
  businessContacts,
  businessInformation,
  businessLocations,
  businessProfile,
  cashFlows,
  type ExpenseCategory,
  expenseCategories,
  expenseCategoryEnum,
  expenses,
  goals,
  inventory,
  invoices,
  type PaymentMethod,
  type Product,
  paymentMethods,
  products,
  purchaseOrders,
  type Supplier,
  suppliers,
  type Transaction,
  transactions,
  user,
} from '@repo/db/schema/primary';
import type { PaymentMethodDetails } from '@repo/db/schema/types';
import { eq } from 'drizzle-orm';

const db = creatDB(process.env);

const SEED_CONFIG = {
  users: 5,
  businessProfilesPerUser: 1,
  contactsPerBusiness: 3,
  locationsPerBusiness: 2,
  expenseCategoriesPerBusiness: 8,
  expensesPerCategory: 3,
  paymentMethodsPerBusiness: 4,
  transactionsPerBusiness: 50,
  budgetsPerBusiness: 5,
  goalsPerBusiness: 3,
  invoicesPerBusiness: 15,
  productsPerBusiness: 20,
  suppliersPerBusiness: 8,
  inventoryItemsPerBusiness: 15,
  purchaseOrdersPerBusiness: 10,
  balanceSheetItemsPerBusiness: 12,
};

// Constants for magic numbers
const TAX_ID_LENGTH = 9;
const REGISTRATION_NUMBER_LENGTH = 10;
const BUSINESS_LICENSE_LENGTH = 12;
const EMPLOYEE_COUNT_MIN = 1;
const EMPLOYEE_COUNT_MAX = 500;
const FOUNDED_YEAR_RANGE = 20;
const EXPENSE_CATEGORY_DAYS = 30;
const PAYMENT_METHOD_DAYS = 60;
const TRANSACTION_DAYS = 90;
const GOAL_DAYS = 60;
const INVOICE_DAYS = 60;
const INVOICE_DUE_DAYS_MIN = 15;
const INVOICE_DUE_DAYS_MAX = 60;
const PRODUCT_DAYS = 90;
const SUPPLIER_DAYS = 120;
const INVENTORY_DAYS = 60;
const PURCHASE_ORDER_DAYS = 30;
const PURCHASE_ORDER_DELIVERY_DAYS_MIN = 3;
const PURCHASE_ORDER_DELIVERY_DAYS_MAX = 21;
const BALANCE_SHEET_DAYS = 30;
const BUDGET_AMOUNT_MIN = 1000;
const BUDGET_AMOUNT_MAX = 50_000;
const BUDGET_AMOUNT_MULTIPLIER = 1.2;
const GOAL_AMOUNT_MIN = 5000;
const GOAL_AMOUNT_MAX = 100_000;
const GOAL_CURRENT_AMOUNT_MULTIPLIER = 0.8;
const INVOICE_AMOUNT_MIN = 100;
const INVOICE_AMOUNT_MAX = 10_000;
const PRODUCT_PRICE_MIN = 10;
const PRODUCT_PRICE_MAX = 1000;
const INVENTORY_QUANTITY_MAX = 1000;
const INVENTORY_MIN_STOCK_MIN = 5;
const INVENTORY_MIN_STOCK_MAX = 50;
const INVENTORY_MAX_STOCK_OFFSET = 50;
const INVENTORY_MAX_STOCK_MAX = 500;
const INVENTORY_UNIT_COST_MIN = 5;
const INVENTORY_UNIT_COST_MAX = 500;
const PURCHASE_ORDER_AMOUNT_MIN = 500;
const PURCHASE_ORDER_AMOUNT_MAX = 25_000;
const BALANCE_SHEET_AMOUNT_MIN = 1000;
const BALANCE_SHEET_AMOUNT_MAX = 100_000;

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Step 1: Create users
    console.log('👤 Creating users...');
    const users = await createUsers();
    const adminUser = await db
      .select()
      .from(user)
      .where(eq(user.email, 'tenukaomaljith2009@gmail.com'))
      .limit(1)
      .then((v) => v[0]);

    // Step 2: Create business profiles
    console.log('🏢 Creating business profiles...');
    const businesses = await createBusinessProfiles(
      adminUser ? adminUser : users[0]
    );

    // Step 3: Create business information
    console.log('📋 Creating business information...');
    await createBusinessInformation(businesses);

    // Step 4: Create business contacts
    console.log('📞 Creating business contacts...');
    await createBusinessContacts(businesses);

    // Step 5: Create business locations
    console.log('📍 Creating business locations...');
    await createBusinessLocations(businesses);

    // Step 6: Create expense categories
    console.log('📊 Creating expense categories...');
    const expenseCategoriesData = await createExpenseCategories(businesses);

    // Step 7: Create expenses
    console.log('💰 Creating expenses...');
    await createExpenses(expenseCategoriesData);

    // Step 8: Create payment methods
    console.log('💳 Creating payment methods...');
    const paymentMethodsData = await createPaymentMethods(businesses);

    // Step 9: Create transactions
    console.log('🔄 Creating transactions...');
    const transactionsData = await createTransactions(
      businesses,
      paymentMethodsData,
      expenseCategoriesData
    );

    // Step 10: Create cash flows
    console.log('💸 Creating cash flows...');
    await createCashFlows(transactionsData);

    // Step 11: Create budgets
    console.log('📈 Creating budgets...');
    await createBudgets(businesses);

    // Step 12: Create goals
    console.log('🎯 Creating goals...');
    await createGoals(businesses);

    // Step 13: Create invoices
    console.log('🧾 Creating invoices...');
    await createInvoices(businesses);

    // Step 14: Create products
    console.log('📦 Creating products...');
    const productsData = await createProducts(businesses);

    // Step 15: Create suppliers
    console.log('🚚 Creating suppliers...');
    const suppliersData = await createSuppliers(businesses);

    // Step 16: Create inventory
    console.log('📋 Creating inventory...');
    await createInventory(businesses, productsData);

    // Step 17: Create purchase orders
    console.log('🛒 Creating purchase orders...');
    await createPurchaseOrders(businesses, suppliersData);

    // Step 18: Create balance sheet items
    console.log('💼 Creating balance sheet items...');
    await createBalanceSheetItems(businesses);

    console.log('✅ Database seeding completed successfully!');
    console.log(
      `Created ${users.length} users with ${businesses.length} businesses`
    );
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

async function createUsers() {
  const usersData = Array.from({ length: SEED_CONFIG.users }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    emailVerified: faker.datatype.boolean({ probability: 0.8 }),
    image: faker.image.avatar(),
    createdAt: faker.date.past({ years: 2 }),
    updatedAt: faker.date.recent(),
  }));

  return await db.insert(user).values(usersData).returning();
}

async function createBusinessProfiles(businessUser: typeof user.$inferSelect) {
  const businessData = {
    id: faker.string.uuid(),
    userId: businessUser.id,
    companyName: faker.company.name(),
    legalName: faker.company.name(),
    tradingName: faker.company.name(),
    email: faker.internet.email(),
    twitter: `@${faker.internet.username()}`,
    linkedin: `https://linkedin.com/company/${faker.internet.username()}`,
    phone: faker.phone.number(),
    website: faker.internet.url(),
    addressLine1: faker.location.streetAddress(),
    addressLine2: faker.location.secondaryAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    postalCode: faker.location.zipCode(),
    country: faker.location.country(),
    industry: faker.helpers.arrayElement([
      'Technology',
      'Healthcare',
      'Finance',
      'Retail',
      'Manufacturing',
      'Education',
      'Real Estate',
      'Consulting',
    ]),
    businessType: faker.helpers.arrayElement([
      'LLC',
      'Corporation',
      'Partnership',
      'Sole Proprietorship',
    ]),
    employeeCount: faker.number.int({
      min: EMPLOYEE_COUNT_MIN,
      max: EMPLOYEE_COUNT_MAX,
    }),
    foundedYear: faker.date.past({ years: FOUNDED_YEAR_RANGE }).getFullYear(),
    logoUrl: faker.image.url(),
    brandColor: faker.color.rgb(),
    description: faker.company.catchPhrase(),
    mission: faker.lorem.paragraph(),
    vision: faker.lorem.paragraph(),
    isActive: faker.datatype.boolean({ probability: 0.9 }),
    isVerified: faker.datatype.boolean({ probability: 0.7 }),
    createdAt: faker.date.past({ years: 1 }),
    updatedAt: faker.date.recent(),
  };

  return await db
    .insert(businessProfile)
    .values(businessData)
    .onConflictDoUpdate({
      target: businessProfile.userId,
      set: { ...businessData, updatedAt: new Date() },
    })
    .returning();
}

async function createBusinessInformation(businesses: BusinessProfile[]) {
  const businessInfoData = businesses.map((business) => ({
    id: faker.string.uuid(),
    businessProfileId: business.id,
    taxId: faker.string.alphanumeric(TAX_ID_LENGTH),
    registrationNumber: faker.string.alphanumeric(REGISTRATION_NUMBER_LENGTH),
    businessLicense: faker.string.alphanumeric(BUSINESS_LICENSE_LENGTH),
    baseCurrency: faker.helpers.arrayElement(['USD', 'EUR', 'GBP', 'CAD']),
    fiscalYearEnd: faker.helpers.arrayElement([
      '12/31',
      '03/31',
      '06/30',
      '09/30',
    ]),
    defaultBankAccount: faker.finance.accountNumber(),
    timezone: faker.helpers.arrayElement([
      'UTC',
      'America/New_York',
      'America/Los_Angeles',
      'Europe/London',
    ]),
    dateFormat: faker.helpers.arrayElement([
      'MM/dd/yyyy',
      'dd/MM/yyyy',
      'yyyy-MM-dd',
    ]),
    numberFormat: faker.helpers.arrayElement(['en-US', 'en-GB', 'de-DE']),
    businessHoursStart: '09:00:00',
    businessHoursEnd: '17:00:00',
    operatingDays: 'Monday-Friday',
    certifications: faker.lorem.sentence(),
    complianceNotes: faker.lorem.paragraph(),
    socialMediaLinks: JSON.stringify({
      facebook: faker.internet.url(),
      twitter: faker.internet.url(),
      instagram: faker.internet.url(),
    }),
    internalNotes: faker.lorem.paragraph(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  }));

  return await db
    .insert(businessInformation)
    .values(businessInfoData)
    .returning();
}

async function createBusinessContacts(businesses: BusinessProfile[]) {
  const contactsData = businesses.flatMap((business) =>
    Array.from({ length: SEED_CONFIG.contactsPerBusiness }, (_, index) => ({
      id: faker.string.uuid(),
      businessProfileId: business.id,
      contactType: faker.helpers.arrayElement([
        'Owner',
        'Manager',
        'Accountant',
        'Assistant',
      ]),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      title: faker.person.jobTitle(),
      department: faker.helpers.arrayElement([
        'Administration',
        'Finance',
        'Operations',
        'Sales',
        'Marketing',
      ]),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      mobile: faker.phone.number(),
      isPrimary: index === 0,
      isActive: faker.datatype.boolean({ probability: 0.9 }),
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
    }))
  );

  return await db.insert(businessContacts).values(contactsData).returning();
}

async function createBusinessLocations(businesses: BusinessProfile[]) {
  const locationsData = businesses.flatMap((business) =>
    Array.from({ length: SEED_CONFIG.locationsPerBusiness }, (_, index) => ({
      id: faker.string.uuid(),
      businessProfileId: business.id,
      locationName: index === 0 ? 'Headquarters' : `Branch ${index}`,
      locationType: faker.helpers.arrayElement([
        'Office',
        'Warehouse',
        'Store',
        'Factory',
      ]),
      addressLine1: faker.location.streetAddress(),
      addressLine2: faker.location.secondaryAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      postalCode: faker.location.zipCode(),
      country: faker.location.country(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      latitude: faker.location.latitude().toString(),
      longitude: faker.location.longitude().toString(),
      isHeadquarters: index === 0,
      isActive: faker.datatype.boolean({ probability: 0.95 }),
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
    }))
  );

  return await db.insert(businessLocations).values(locationsData).returning();
}

async function createExpenseCategories(businesses: BusinessProfile[]) {
  const expenseCategoryTypes = expenseCategoryEnum.enumValues;

  const categoriesData = businesses.flatMap((business) =>
    expenseCategoryTypes
      .slice(0, SEED_CONFIG.expenseCategoriesPerBusiness)
      .map((categoryType) => ({
        id: faker.string.uuid(),
        businessProfileId: business.id,
        name: categoryType,
        status: faker.helpers.arrayElement(['active', 'inactive']),
        lastUpdated: faker.date.recent(),
        createdAt: faker.date.recent({ days: EXPENSE_CATEGORY_DAYS }),
        updatedAt: faker.date.recent(),
      }))
  );

  return await db.insert(expenseCategories).values(categoriesData).returning();
}

async function createExpenses(expenseCategoriesData: ExpenseCategory[]) {
  const expensesData = expenseCategoriesData.flatMap((category) =>
    Array.from({ length: SEED_CONFIG.expensesPerCategory }, () => ({
      id: faker.string.uuid(),
      expenseCategoryId: category.id,
      name: faker.commerce.productName(),
      frequency: faker.helpers.arrayElement([
        'monthly',
        'weekly',
        'yearly',
        'one-time',
      ]),
      status: faker.helpers.arrayElement(['active', 'inactive']),
      createdAt: faker.date.recent({ days: EXPENSE_CATEGORY_DAYS }),
      updatedAt: faker.date.recent(),
    }))
  );

  return await db.insert(expenses).values(expensesData).returning();
}

async function createPaymentMethods(businesses: BusinessProfile[]) {
  const paymentMethodsData = businesses.flatMap((business) =>
    Array.from({ length: SEED_CONFIG.paymentMethodsPerBusiness }, () => {
      const type = faker.helpers.arrayElement([
        'BANK',
        'CASH',
        'CARD_CREDIT',
        'DIGITAL_WALLET',
        'OTHER',
      ]);

      let details: PaymentMethodDetails = {};

      switch (type) {
        case 'BANK':
          details = {
            provider: `${faker.company.name()} Bank`,
            accountNumber: faker.finance.accountNumber(),
            description: 'Business checking account',
          };
          break;
        case 'CARD_CREDIT':
          details = {
            provider: faker.helpers.arrayElement([
              'Visa',
              'Mastercard',
              'Amex',
            ]),
            // biome-ignore lint/style/noMagicNumbers: To getLast for
            last4: faker.finance.creditCardNumber().slice(-4),
            description: 'Business credit card',
          };
          break;
        case 'DIGITAL_WALLET':
          details = {
            provider: faker.helpers.arrayElement([
              'PayPal',
              'Stripe',
              'Square',
            ]),
            accountEmail: faker.internet.email(),
            description: 'Digital payment account',
          };
          break;
        case 'OTHER':
          details = {
            description: faker.lorem.sentence(),
          };
          break;
        default:
          details = {
            description: faker.lorem.sentence(),
          };
      }

      return {
        id: faker.string.uuid(),
        businessProfileId: business.id,
        type,
        details,
        isActive: faker.datatype.boolean({ probability: 0.9 }),
        createdAt: faker.date.recent({ days: PAYMENT_METHOD_DAYS }),
        updatedAt: faker.date.recent(),
      };
    })
  );

  return await db.insert(paymentMethods).values(paymentMethodsData).returning();
}

async function createTransactions(
  businesses: BusinessProfile[],
  paymentMethodsData: PaymentMethod[],
  expenseCategoriesData: ExpenseCategory[]
) {
  const transactionsData = businesses.flatMap((business) => {
    const businessPaymentMethods = paymentMethodsData.filter(
      (pm) => pm.businessProfileId === business.id
    );
    const businessExpenseCategories = expenseCategoriesData.filter(
      (ec) => ec.businessProfileId === business.id
    );

    return Array.from({ length: SEED_CONFIG.transactionsPerBusiness }, () => ({
      id: faker.string.uuid(),
      businessProfileId: business.id,
      paymentMethodId:
        faker.helpers.arrayElement(businessPaymentMethods)?.id || null,
      expenseCategoryId:
        faker.helpers.arrayElement(businessExpenseCategories)?.id || null,
      type: faker.helpers.arrayElement(['PAYMENT', 'PAYOUT']),
      amount: faker.finance.amount({ min: 10, max: 5000, dec: 2 }),
      description: faker.commerce.productDescription(),
      transactionDate: faker.date.recent({ days: TRANSACTION_DAYS }),
      reference: faker.string.alphanumeric(10).toUpperCase(),
      createdAt: faker.date.recent({ days: TRANSACTION_DAYS }),
      updatedAt: faker.date.recent(),
    }));
  });

  return await db.insert(transactions).values(transactionsData).returning();
}

async function createCashFlows(transactionsData: Transaction[]) {
  const cashFlowsData = transactionsData.map((transaction) => ({
    id: faker.string.uuid(),
    businessProfileId: transaction.businessProfileId,
    transactionId: transaction.id,
    direction: faker.helpers.arrayElement(['INCOMING', 'OUTGOING']),
    amount: transaction.amount,
    flowDate: transaction.transactionDate,
    createdAt: transaction.createdAt,
    updatedAt: faker.date.recent(),
  }));

  return await db.insert(cashFlows).values(cashFlowsData).returning();
}

async function createBudgets(businesses: BusinessProfile[]) {
  const budgetCategories = budgetCategoryEnum.enumValues;

  const budgetsData = businesses.flatMap((business) =>
    budgetCategories
      .slice(0, SEED_CONFIG.budgetsPerBusiness)
      .map((category) => {
        const allocatedAmount = faker.number.float({
          min: BUDGET_AMOUNT_MIN,
          max: BUDGET_AMOUNT_MAX,
          fractionDigits: 2,
        });
        const spentAmount = faker.number.float({
          min: 0,
          max: allocatedAmount * BUDGET_AMOUNT_MULTIPLIER,
          fractionDigits: 2,
        });

        return {
          id: faker.string.uuid(),
          businessProfileId: business.id,
          category,
          allocatedAmount: allocatedAmount.toString(),
          spentAmount: spentAmount.toString(),
          periodStart: faker.date.recent({ days: EXPENSE_CATEGORY_DAYS }),
          periodEnd: faker.date.future({ years: 1 }),
          createdAt: faker.date.recent({ days: EXPENSE_CATEGORY_DAYS }),
          updatedAt: faker.date.recent(),
        };
      })
  );

  return await db.insert(budgets).values(budgetsData).returning();
}

async function createGoals(businesses: BusinessProfile[]) {
  const goalsData = businesses.flatMap((business) =>
    Array.from({ length: SEED_CONFIG.goalsPerBusiness }, () => {
      const targetAmount = faker.number.float({
        min: GOAL_AMOUNT_MIN,
        max: GOAL_AMOUNT_MAX,
        fractionDigits: 2,
      });
      const currentAmount = faker.number.float({
        min: 0,
        max: targetAmount * GOAL_CURRENT_AMOUNT_MULTIPLIER,
        fractionDigits: 2,
      });

      return {
        id: faker.string.uuid(),
        businessProfileId: business.id,
        title: faker.helpers.arrayElement([
          'Increase Monthly Revenue',
          'Reduce Operating Costs',
          'Expand to New Market',
          'Improve Cash Flow',
          'Build Emergency Fund',
        ]),
        targetAmount: targetAmount.toString(),
        currentAmount: currentAmount.toString(),
        deadline: faker.date.future({ years: 1 }),
        status: faker.helpers.arrayElement(['active', 'completed', 'paused']),
        category: faker.helpers.arrayElement([
          'Revenue',
          'Cost Reduction',
          'Growth',
          'Financial Health',
        ]),
        createdAt: faker.date.recent({ days: GOAL_DAYS }),
        updatedAt: faker.date.recent(),
      };
    })
  );

  return await db.insert(goals).values(goalsData).returning();
}

async function createInvoices(businesses: BusinessProfile[]) {
  const invoicesData = businesses.flatMap((business) =>
    Array.from({ length: SEED_CONFIG.invoicesPerBusiness }, () => {
      const issueDate = faker.date.recent({ days: INVOICE_DAYS });
      const dueDate = new Date(issueDate);
      dueDate.setDate(
        dueDate.getDate() +
          faker.number.int({
            min: INVOICE_DUE_DAYS_MIN,
            max: INVOICE_DUE_DAYS_MAX,
          })
      );

      return {
        id: faker.string.uuid(),
        businessProfileId: business.id,
        invoiceNumber: `INV-${
          // biome-ignore lint/style/noMagicNumbers: To generate a invoice num
          faker.string.numeric(6)
        }`,
        customer: faker.company.name(),
        amount: faker.finance.amount({
          min: INVOICE_AMOUNT_MIN,
          max: INVOICE_AMOUNT_MAX,
          dec: 2,
        }),
        status: faker.helpers.arrayElement([
          'pending',
          'paid',
          'overdue',
          'cancelled',
        ]),
        issueDate,
        dueDate,
        createdAt: issueDate,
        updatedAt: faker.date.recent(),
      };
    })
  );

  return await db.insert(invoices).values(invoicesData).returning();
}

async function createProducts(businesses: BusinessProfile[]) {
  const productsData = businesses.flatMap((business) =>
    Array.from({ length: SEED_CONFIG.productsPerBusiness }, () => ({
      id: faker.string.uuid(),
      businessProfileId: business.id,
      name: faker.commerce.productName(),
      price: faker.commerce.price({
        min: PRODUCT_PRICE_MIN,
        max: PRODUCT_PRICE_MAX,
        dec: 2,
      }),
      category: faker.commerce.department(),
      type: faker.helpers.arrayElement(['Product', 'Service']),
      status: faker.helpers.arrayElement([
        'active',
        'inactive',
        'discontinued',
      ]),
      description: faker.commerce.productDescription(),
      createdAt: faker.date.recent({ days: PRODUCT_DAYS }),
      updatedAt: faker.date.recent(),
    }))
  );

  return await db.insert(products).values(productsData).returning();
}

async function createSuppliers(businesses: BusinessProfile[]) {
  const suppliersData = businesses.flatMap((business) =>
    Array.from({ length: SEED_CONFIG.suppliersPerBusiness }, () => ({
      id: faker.string.uuid(),
      businessProfileId: business.id,
      name: faker.company.name(),
      contactPerson: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress({ useFullAddress: true }),
      status: faker.helpers.arrayElement(['active', 'inactive']),
      createdAt: faker.date.recent({ days: SUPPLIER_DAYS }),
      updatedAt: faker.date.recent(),
    }))
  );

  return await db.insert(suppliers).values(suppliersData).returning();
}

async function createInventory(
  businesses: BusinessProfile[],
  productsData: Product[]
) {
  const inventoryData = businesses.flatMap((business) => {
    const businessProducts = productsData
      .filter((product) => product.businessProfileId === business.id)
      .slice(0, SEED_CONFIG.inventoryItemsPerBusiness);

    return businessProducts.map((product) => {
      const quantity = faker.number.int({
        min: 0,
        max: INVENTORY_QUANTITY_MAX,
      });
      const minStockLevel = faker.number.int({
        min: INVENTORY_MIN_STOCK_MIN,
        max: INVENTORY_MIN_STOCK_MAX,
      });
      const maxStockLevel = faker.number.int({
        min: minStockLevel + INVENTORY_MAX_STOCK_OFFSET,
        max: INVENTORY_MAX_STOCK_MAX,
      });

      return {
        id: faker.string.uuid(),
        businessProfileId: business.id,
        productId: product.id,
        quantity,
        minStockLevel,
        maxStockLevel,
        unitCost: faker.commerce.price({
          min: INVENTORY_UNIT_COST_MIN,
          max: INVENTORY_UNIT_COST_MAX,
          dec: 2,
        }),
        location: faker.helpers.arrayElement([
          'Warehouse A',
          'Warehouse B',
          'Store Floor',
        ]),
        createdAt: faker.date.recent({ days: INVENTORY_DAYS }),
        updatedAt: faker.date.recent(),
      };
    });
  });

  return await db.insert(inventory).values(inventoryData).returning();
}

async function createPurchaseOrders(
  businesses: BusinessProfile[],
  suppliersData: Supplier[]
) {
  const purchaseOrdersData = businesses.flatMap((business) => {
    const businessSuppliers = suppliersData.filter(
      (supplier) => supplier.businessProfileId === business.id
    );

    return Array.from({ length: SEED_CONFIG.purchaseOrdersPerBusiness }, () => {
      const orderDate = faker.date.recent({ days: PURCHASE_ORDER_DAYS });
      const expectedDelivery = new Date(orderDate);
      expectedDelivery.setDate(
        expectedDelivery.getDate() +
          faker.number.int({
            min: PURCHASE_ORDER_DELIVERY_DAYS_MIN,
            max: PURCHASE_ORDER_DELIVERY_DAYS_MAX,
          })
      );

      return {
        id: faker.string.uuid(),
        businessProfileId: business.id,
        supplierId: faker.helpers.arrayElement(businessSuppliers).id,
        orderNumber: `PO-${
          // biome-ignore lint/style/noMagicNumbers: To generate a order
          faker.string.numeric(6)
        }`,
        totalAmount: faker.finance.amount({
          min: PURCHASE_ORDER_AMOUNT_MIN,
          max: PURCHASE_ORDER_AMOUNT_MAX,
          dec: 2,
        }),
        status: faker.helpers.arrayElement([
          'pending',
          'confirmed',
          'shipped',
          'delivered',
          'cancelled',
        ]),
        orderDate,
        expectedDelivery,
        createdAt: orderDate,
        updatedAt: faker.date.recent(),
      };
    });
  });

  return await db.insert(purchaseOrders).values(purchaseOrdersData).returning();
}

async function createBalanceSheetItems(businesses: BusinessProfile[]) {
  const balanceSheetTypes = balanceSheetItemTypeEnum.enumValues;

  const balanceSheetData = businesses.flatMap((business) =>
    Array.from({ length: SEED_CONFIG.balanceSheetItemsPerBusiness }, () => {
      const type = faker.helpers.arrayElement(balanceSheetTypes);
      let title = '';

      switch (type) {
        case 'ASSET':
          title = faker.helpers.arrayElement([
            'Cash and Cash Equivalents',
            'Accounts Receivable',
            'Inventory',
            'Equipment',
            'Property',
          ]);
          break;
        case 'LIABILITY':
          title = faker.helpers.arrayElement([
            'Accounts Payable',
            'Short-term Debt',
            'Long-term Debt',
            'Accrued Expenses',
          ]);
          break;
        case 'EQUITY':
          title = faker.helpers.arrayElement([
            "Owner's Equity",
            'Retained Earnings',
            'Common Stock',
          ]);
          break;
        default:
          title = 'Unknown';
      }

      return {
        id: faker.string.uuid(),
        businessProfileId: business.id,
        title,
        description: faker.lorem.sentence(),
        amount: faker.finance.amount({
          min: BALANCE_SHEET_AMOUNT_MIN,
          max: BALANCE_SHEET_AMOUNT_MAX,
          dec: 2,
        }),
        type,
        createdAt: faker.date.recent({ days: BALANCE_SHEET_DAYS }),
        updatedAt: faker.date.recent(),
      };
    })
  );

  return await db
    .insert(balanceSheetItems)
    .values(balanceSheetData)
    .returning();
}

// Execute the seeding
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };
