import { useQuery } from '@tanstack/react-query';
import { client } from '@/utils/orpc';

export const useUserExpenseCategories = () =>
  useQuery({
    queryFn: async () => await client.expenseCategory.get(),
    queryKey: ['user', 'expenseCategories'],
  });

export const useUserExpenses = () =>
  useQuery({
    queryFn: async () => await client.expense.get(),
    queryKey: ['user', 'expenses'],
  });
