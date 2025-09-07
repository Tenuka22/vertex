import { useQuery } from '@tanstack/react-query';
import { getUserExpenseCategories } from '@/actions/expense-categories';
import { getUserExpenses } from '@/actions/expenses';

export const useUserExpenseCategories = () =>
  useQuery({
    queryFn: async () => await getUserExpenseCategories(),
    queryKey: ['user', 'expenseCategories'],
  });

export const useUserExpenses = () =>
  useQuery({
    queryFn: async () => await getUserExpenses(),
    queryKey: ['user', 'expenses'],
  });
