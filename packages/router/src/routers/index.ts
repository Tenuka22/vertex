import type { AnyRouter } from '@orpc/server';
import { publicProcedure } from '../domain/orpc';
import {
  createUpdateBalanceSheetItem,
  deleteBalanceSheetItem,
  getUserBalanceSheetItems,
} from './balance-sheet';
import { createUpdateBudget, deleteBudget, getUserBudgets } from './budgets';
import {
  createUpdateBusinessProfile,
  deleteBusinessProfile,
  getUserBusinessProfile,
  reactivateBusinessProfile,
  softDeleteBusinessProfile,
} from './business';
import {
  createUpdateBusinessContact,
  deleteBusinessContact,
  getUserBusinessContacts,
} from './business-contacts';
import {
  createUpdateBusinessInformation,
  deleteBusinessInformation,
  getUserBusinessInformation,
} from './business-information';
import {
  createUpdateBusinessLocation,
  deleteBusinessLocation,
  getBusinessLocations,
} from './business-location';
import {
  createUpdateCashFlow,
  deleteCashFlow,
  getUserCashFlows,
} from './cash-flows';

import {
  createUpdateExpenseCategory,
  deleteExpenseCategory,
  getUserExpenseCategories,
} from './expense-categories';

import {
  createUpdateExpense,
  deleteExpense,
  getUserExpenses,
} from './expenses';
import { createUpdateGoal, deleteGoal, getUserGoals } from './goals';
import {
  createUpdateInventory,
  deleteInventory,
  getUserInventory,
} from './inventory';
import {
  createUpdateInvoice,
  deleteInvoice,
  getUserInvoices,
} from './invoices';
import {
  createUpdatePaymentMethod,
  deletePaymentMethod,
  getUserPaymentMethods,
} from './payment-methods';
import {
  createUpdateProduct,
  deleteProduct,
  getUserProducts,
} from './products';
import { getProfitLossData, getProfitLossSummary } from './profit-loss';
import {
  createUpdatePurchaseOrder,
  deletePurchaseOrder,
  getUserPurchaseOrders,
} from './purchase-orders';
import {
  createUpdateSupplier,
  deleteSupplier,
  getUserSuppliers,
} from './suppliers';
import {
  createUpdateTransaction,
  deleteTransaction,
  getUserTransactions,
} from './transactions';

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return 'OK';
  }),
  transaction: {
    createUpdate: createUpdateTransaction,
    get: getUserTransactions,
    delete: deleteTransaction,
  },
  payment: {
    createUpdate: createUpdatePaymentMethod,
    get: getUserPaymentMethods,
    delete: deletePaymentMethod,
  },
  businessProfile: {
    createUpdate: createUpdateBusinessProfile,
    get: getUserBusinessProfile,
    delete: deleteBusinessProfile,
    softDelete: softDeleteBusinessProfile,
    reactivate: reactivateBusinessProfile,
  },
  businessInformation: {
    createUpdate: createUpdateBusinessInformation,
    get: getUserBusinessInformation,
    delete: deleteBusinessInformation,
  },
  businessLocation: {
    createUpdate: createUpdateBusinessLocation,
    get: getBusinessLocations,
    delete: deleteBusinessLocation,
  },
  budget: {
    createUpdate: createUpdateBudget,
    get: getUserBudgets,
    delete: deleteBudget,
  },
  expenseCategory: {
    createUpdate: createUpdateExpenseCategory,
    get: getUserExpenseCategories,
    delete: deleteExpenseCategory,
  },
  expense: {
    createUpdate: createUpdateExpense,
    get: getUserExpenses,
    delete: deleteExpense,
  },
  cashFlow: {
    createUpdate: createUpdateCashFlow,
    get: getUserCashFlows,
    delete: deleteCashFlow,
  },
  businessContact: {
    createUpdate: createUpdateBusinessContact,
    get: getUserBusinessContacts,
    delete: deleteBusinessContact,
  },
  goal: {
    createUpdate: createUpdateGoal,
    get: getUserGoals,
    delete: deleteGoal,
  },
  invoice: {
    createUpdate: createUpdateInvoice,
    get: getUserInvoices,
    delete: deleteInvoice,
  },
  product: {
    createUpdate: createUpdateProduct,
    get: getUserProducts,
    delete: deleteProduct,
  },
  supplier: {
    createUpdate: createUpdateSupplier,
    get: getUserSuppliers,
    delete: deleteSupplier,
  },
  inventory: {
    createUpdate: createUpdateInventory,
    get: getUserInventory,
    delete: deleteInventory,
  },
  purchaseOrder: {
    createUpdate: createUpdatePurchaseOrder,
    get: getUserPurchaseOrders,
    delete: deletePurchaseOrder,
  },
  profitLoss: {
    getData: getProfitLossData,
    getSummary: getProfitLossSummary,
  },
  balanceSheet: {
    createUpdate: createUpdateBalanceSheetItem,
    get: getUserBalanceSheetItems,
    delete: deleteBalanceSheetItem,
  },
} satisfies AnyRouter;

export type AppRouter = typeof appRouter;
