/** biome-ignore-all lint/suspicious/noConsole: Required */
import { faker } from '@faker-js/faker';
import {
  balanceSheetItems,
  budgets,
  businessContacts,
  businessInformation,
  businessLocations,
  businessProfile,
  cashFlows,
  expenseCategories,
  expenses,
  goals,
  inventory,
  invoices,
  paymentMethods,
  products,
  purchaseOrders,
  suppliers,
  transactions,
  user,
} from '@repo/db/schema/primary';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';

const MIN_EMPLOYEES = 1;
const MAX_EMPLOYEES = 500;
const MIN_QUANTITY = 1;
const MAX_QUANTITY = 100;
const MIN_STOCK = 5;
const MAX_STOCK = 200;
const DEFAULT_UNIT_COST = '50.00';
const DEFAULT_ALLOCATED_BUDGET = '5000';
const DEFAULT_SPENT_BUDGET = '1200';
const DEFAULT_INVOICE_AMOUNT = '1500';
const DEFAULT_PURCHASE_ORDER_AMOUNT = '2500';
const DEFAULT_BALANCE_SHEET_AMOUNT = '5000';
const DEFAULT_PRODUCT_PRICE = '99.99';
const CONTACTS_PER_PROFILE = 3;
const LOCATIONS_PER_PROFILE = 2;
const PRODUCTS_PER_PROFILE = 5;
const SUPPLIERS_PER_PROFILE = 3;
const TRANSACTIONS_PER_CATEGORY = 4;
const GOALS_PER_PROFILE = 2;
const BUDGETS_PER_PROFILE = 2;
const INVOICES_PER_PROFILE = 3;

const VALID_EXPENSE_CATEGORIES = [
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
] as const;
const VALID_BUDGET_CATEGORIES = [
  'MARKETING',
  'OPERATIONS',
  'PAYROLL',
  'UTILITIES',
  'MISCELLANEOUS',
] as const;

// Logger utility
const logger = {
  info: (message: string, data?: any) => {
    console.log(
      `[SEED INFO] ${message}`,
      data ? JSON.stringify(data, null, 2) : ''
    );
  },
  error: (message: string, error?: any) => {
    console.error(`[SEED ERROR] ${message}`, error);
  },
  success: (message: string, data?: any) => {
    console.log(
      `[SEED SUCCESS] ✅ ${message}`,
      data ? JSON.stringify(data, null, 2) : ''
    );
  },
  warn: (message: string, data?: any) => {
    console.warn(
      `[SEED WARN] ⚠️  ${message}`,
      data ? JSON.stringify(data, null, 2) : ''
    );
  },
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Okay to have complexity
export async function seedAll() {
  logger.info('🌱 Starting seed process...');

  try {
    // Explicitly select columns to ensure proper typing
    const users = await db
      .select({
        id: user.id,
        email: user.email,
      })
      .from(user);
    logger.info(`Found ${users.length} users to seed data for`);

    if (users.length === 0) {
      logger.warn('No users found in database. Please create users first.');
      return;
    }

    for (const [userIndex, u] of users.entries()) {
      logger.info(`Processing user ${userIndex + 1}/${users.length}`, {
        userId: u.id,
        email: u.email,
      });

      try {
        // Check for existing business profile
        const existing = await db
          .select({ id: businessProfile.id })
          .from(businessProfile)
          .where(eq(businessProfile.userId, u.id));

        if (existing.length > 0) {
          logger.info(`User ${u.id} already has business profile, skipping...`);
          continue;
        }

        // Create business profile
        logger.info(`Creating business profile for user ${u.id}...`);
        const providedBusiness = {
          userId: u.id,
          companyName: faker.company.name(),
          legalName: faker.company.name(),
          tradingName: faker.company.name(),
          email: faker.internet.email(),
          twitter: faker.internet.url(),
          linkedin: faker.internet.url(),
          phone: faker.phone.number(),
          website: faker.internet.url(),
          addressLine1: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          postalCode: faker.location.zipCode(),
          country: faker.location.country(),
          industry: faker.commerce.department(),
          businessType: faker.company.buzzPhrase(),
          employeeCount: faker.number.int({
            min: MIN_EMPLOYEES,
            max: MAX_EMPLOYEES,
          }),
          foundedYear: faker.number.int({ min: 1990, max: 2023 }),
          description: faker.company.catchPhrase(),
          mission: faker.lorem.sentence(),
          vision: faker.lorem.sentence(),
        };

        const [bp] = await db
          .insert(businessProfile)
          .values({
            ...providedBusiness,
          })
          .onConflictDoUpdate({
            target: [businessProfile.id], // Use array for target
            set: {
              ...providedBusiness,
              userId: u.id,
              updatedAt: new Date(),
            },
          })
          .returning();

        logger.success('Business profile created', {
          businessProfileId: bp.id,
          companyName: bp.companyName,
        });

        // Create business information
        logger.info(`Creating business information for profile ${bp.id}...`);
        const businessInfo = await db
          .insert(businessInformation)
          .values({
            businessProfileId: bp.id,
            taxId: faker.string.alphanumeric(10),
            registrationNumber: faker.string.alphanumeric(8),
            businessLicense: faker.string.alphanumeric(6),
            baseCurrency: 'USD',
            fiscalYearEnd: '12-31',
            defaultBankAccount: faker.finance.accountNumber(),
            timezone: 'UTC',
            dateFormat: 'MM/dd/yyyy',
            numberFormat: 'en-US',
            businessHoursStart: '09:00',
            businessHoursEnd: '17:00',
            operatingDays: 'Mon-Fri',
            certifications: faker.lorem.words(3),
            complianceNotes: faker.lorem.sentence(),
            socialMediaLinks: faker.internet.url(),
            internalNotes: faker.lorem.sentence(),
          })
          .returning();

        logger.success(`Business information created for profile ${bp.id}`);

        // Create business contacts
        logger.info(`Creating ${CONTACTS_PER_PROFILE} business contacts...`);
        const contactsCreated = [];
        for (let i = 0; i < CONTACTS_PER_PROFILE; i++) {
          const contactData = {
            businessProfileId: bp.id,
            contactType: i === 0 ? 'Primary' : 'Secondary',
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            title: faker.person.jobTitle(),
            department: faker.commerce.department(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            mobile: faker.phone.number(),
            isPrimary: i === 0,
            isActive: true,
          };

          const [contact] = await db
            .insert(businessContacts)
            .values(contactData)
            .returning();
          contactsCreated.push(contact);
        }
        logger.success(`Created ${contactsCreated.length} business contacts`);

        // Create business locations
        logger.info(`Creating ${LOCATIONS_PER_PROFILE} business locations...`);
        const locationsCreated = [];
        for (let i = 0; i < LOCATIONS_PER_PROFILE; i++) {
          const locationData = {
            businessProfileId: bp.id, // Verify this field exists in schema
            locationName: faker.company.name(),
            locationType: i === 0 ? 'Office' : 'Warehouse',
            addressLine1: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            postalCode: faker.location.zipCode(),
            country: faker.location.country(),
            phone: faker.phone.number(),
            email: faker.internet.email(),
            latitude: faker.location.latitude(),
            longitude: faker.location.longitude(),
            isHeadquarters: i === 0,
            isActive: true,
          };

          try {
            const [location] = await db
              .insert(businessLocations)
              .values(locationData)
              .returning();
            locationsCreated.push(location);
          } catch (error) {
            logger.error(`Failed to create business location ${i + 1}`, error);
            // Fallback without businessProfileId
            try {
              logger.warn(
                'Retrying location creation without businessProfileId...'
              );
              const { businessProfileId, ...locationDataWithoutProfileId } =
                locationData;
              const [location] = await db
                .insert(businessLocations)
                .values(locationDataWithoutProfileId)
                .returning();
              locationsCreated.push(location);
              logger.success(
                'Location created without businessProfileId field'
              );
            } catch (retryError) {
              logger.error(
                'Failed to create location even without businessProfileId',
                retryError
              );
              throw retryError;
            }
          }
        }
        logger.success(`Created ${locationsCreated.length} business locations`);

        // Create expense categories and related data
        logger.info('Creating expense categories and transactions...');
        const categoriesCreated = [];
        for (
          let catIndex = 0;
          catIndex < Math.min(4, VALID_EXPENSE_CATEGORIES.length);
          catIndex++
        ) {
          const catName = VALID_EXPENSE_CATEGORIES[catIndex];
          logger.info(`Creating expense category: ${catName}`);

          const [cat] = await db
            .insert(expenseCategories)
            .values({
              businessProfileId: bp.id,
              name: catName,
              status: 'active',
            })
            .returning();

          categoriesCreated.push(cat);

          // Create transactions for this category
          const transactionsCreated = [];
          for (let i = 0; i < TRANSACTIONS_PER_CATEGORY; i++) {
            const [pm] = await db
              .insert(paymentMethods)
              .values({
                businessProfileId: bp.id,
                type: 'BANK',
                details: {
                  provider: 'Bank',
                  accountNumber: faker.finance.accountNumber(),
                },
                isActive: true,
              })
              .returning();

            const [tx] = await db
              .insert(transactions)
              .values({
                businessProfileId: bp.id,
                paymentMethodId: pm.id,
                expenseCategoryId: cat.id,
                type: 'EXPENSE',
                amount: faker.finance.amount({ min: 100, max: 1000, dec: 2 }),
                description: faker.commerce.productDescription(),
                reference: faker.string.alphanumeric(8),
              })
              .returning();

            transactionsCreated.push(tx);

            await db.insert(cashFlows).values({
              businessProfileId: bp.id,
              transactionId: tx.id,
              direction: 'OUTGOING',
              amount: tx.amount,
            });

            await db.insert(expenses).values({
              expenseCategoryId: cat.id,
              name: faker.commerce.productName(),
              frequency: 'Monthly',
              status: 'active',
            });
          }
          logger.success(
            `Created ${transactionsCreated.length} transactions for category ${catName}`
          );
        }
        logger.success(
          `Created ${categoriesCreated.length} expense categories with transactions`
        );

        // Create budgets
        logger.info(`Creating ${BUDGETS_PER_PROFILE} budgets...`);
        const budgetsCreated = [];
        for (let i = 0; i < BUDGETS_PER_PROFILE; i++) {
          const [budget] = await db
            .insert(budgets)
            .values({
              businessProfileId: bp.id,
              category:
                VALID_BUDGET_CATEGORIES[i % VALID_BUDGET_CATEGORIES.length],
              allocatedAmount: DEFAULT_ALLOCATED_BUDGET,
              spentAmount: DEFAULT_SPENT_BUDGET,
              periodStart: faker.date.past(),
              periodEnd: faker.date.future(),
            })
            .returning();
          budgetsCreated.push(budget);
        }
        logger.success(`Created ${budgetsCreated.length} budgets`);

        // Create goals
        logger.info(`Creating ${GOALS_PER_PROFILE} goals...`);
        const goalsCreated = [];
        for (let i = 0; i < GOALS_PER_PROFILE; i++) {
          const [goal] = await db
            .insert(goals)
            .values({
              businessProfileId: bp.id,
              title: faker.company.catchPhrase(),
              targetAmount: faker.finance.amount({ min: 5000, max: 20_000 }),
              currentAmount: faker.finance.amount({ min: 1000, max: 5000 }),
              deadline: faker.date.future(),
              category: faker.commerce.department(),
            })
            .returning();
          goalsCreated.push(goal);
        }
        logger.success(`Created ${goalsCreated.length} goals`);

        // Create invoices
        logger.info(`Creating ${INVOICES_PER_PROFILE} invoices...`);
        const invoicesCreated = [];
        for (let i = 0; i < INVOICES_PER_PROFILE; i++) {
          const [invoice] = await db
            .insert(invoices)
            .values({
              businessProfileId: bp.id,
              invoiceNumber: faker.string.alphanumeric(8),
              customer: faker.company.name(),
              amount: DEFAULT_INVOICE_AMOUNT,
              dueDate: faker.date.future(),
            })
            .returning();
          invoicesCreated.push(invoice);
        }
        logger.success(`Created ${invoicesCreated.length} invoices`);

        // Create products
        logger.info(`Creating ${PRODUCTS_PER_PROFILE} products...`);
        const productsInserted = [];
        for (let i = 0; i < PRODUCTS_PER_PROFILE; i++) {
          const [prod] = await db
            .insert(products)
            .values({
              businessProfileId: bp.id,
              name: faker.commerce.productName(),
              price: DEFAULT_PRODUCT_PRICE,
              category: faker.commerce.department(),
              description: faker.commerce.productDescription(),
            })
            .returning();
          productsInserted.push(prod);
        }
        logger.success(`Created ${productsInserted.length} products`);

        // Create suppliers
        logger.info(`Creating ${SUPPLIERS_PER_PROFILE} suppliers...`);
        const suppliersInserted = [];
        for (let i = 0; i < SUPPLIERS_PER_PROFILE; i++) {
          const [sup] = await db
            .insert(suppliers)
            .values({
              businessProfileId: bp.id,
              name: faker.company.name(),
              contactPerson: faker.person.fullName(),
              email: faker.internet.email(),
              phone: faker.phone.number(),
              address: faker.location.streetAddress(),
            })
            .returning();
          suppliersInserted.push(sup);
        }
        logger.success(`Created ${suppliersInserted.length} suppliers`);

        // Create inventory for each product
        logger.info(
          `Creating inventory records for ${productsInserted.length} products...`
        );
        const inventoryCreated = [];
        for (const prod of productsInserted) {
          const [inventoryItem] = await db
            .insert(inventory)
            .values({
              businessProfileId: bp.id,
              productId: prod.id,
              quantity: faker.number.int({
                min: MIN_QUANTITY,
                max: MAX_QUANTITY,
              }),
              minStockLevel: MIN_STOCK,
              maxStockLevel: MAX_STOCK,
              unitCost: DEFAULT_UNIT_COST,
              location: faker.location.city(),
            })
            .returning();
          inventoryCreated.push(inventoryItem);
        }
        logger.success(`Created ${inventoryCreated.length} inventory records`);

        // Create purchase orders for each supplier
        logger.info(
          `Creating purchase orders for ${suppliersInserted.length} suppliers...`
        );
        const purchaseOrdersCreated = [];
        for (const sup of suppliersInserted) {
          const [po] = await db
            .insert(purchaseOrders)
            .values({
              businessProfileId: bp.id,
              supplierId: sup.id,
              orderNumber: faker.string.alphanumeric(8),
              totalAmount: DEFAULT_PURCHASE_ORDER_AMOUNT,
              expectedDelivery: faker.date.future(),
            })
            .returning();
          purchaseOrdersCreated.push(po);
        }
        logger.success(
          `Created ${purchaseOrdersCreated.length} purchase orders`
        );

        // Create balance sheet item
        logger.info('Creating balance sheet item...');
        const [balanceSheetItem] = await db
          .insert(balanceSheetItems)
          .values({
            businessProfileId: bp.id,
            title: 'Cash',
            description: 'Cash on hand',
            amount: DEFAULT_BALANCE_SHEET_AMOUNT,
            type: 'ASSET',
          })
          .returning();
        logger.success('Created balance sheet item', {
          id: balanceSheetItem.id,
        });

        logger.success(
          `✅ Completed seeding for user ${u.id} (${userIndex + 1}/${users.length})`
        );
      } catch (error) {
        logger.error(`Failed to seed data for user ${u.id}`, error);
        throw error;
      }
    }

    logger.success(
      `🎉 Seed process completed successfully for ${users.length} users!`
    );
  } catch (error) {
    logger.error('Seed process failed', error);
    throw error;
  }
}

await seedAll();
