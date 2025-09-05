import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/utils/orpc';

export const useUserExpenseCategories = () =>
  useQuery(orpc.expenseCategory.get.queryOptions({}));

export const useUserExpenses = () =>
  useQuery(orpc.expense.get.queryOptions({}));
