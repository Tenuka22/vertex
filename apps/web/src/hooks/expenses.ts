import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/utils/orpc';

export const useUserExpenseCategories = () =>
  useQuery({
    queryFn: async () => await orpc.expenseCategory.get.call(),
    queryKey: ['user', 'expenseCategories'],
    initialData: [],
  });

export const useUserExpenses = () =>
  useQuery({
    queryFn: async () => await orpc.expense.get.call(),
    queryKey: ['user', 'expenses'],
    initialData: [],
  });
