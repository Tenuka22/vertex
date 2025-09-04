import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/utils/orpc';

export const useUserInvoices = () =>
  useQuery({
    queryFn: async () => await orpc.invoice.get.call(),
    queryKey: ['user', 'invoices'],
    initialData: [],
  });
