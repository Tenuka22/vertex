import { useQuery } from '@tanstack/react-query';
import { client } from '@/utils/orpc';

export const useUserInvoices = () =>
  useQuery({
    queryFn: async () => await client.invoice.get(),
    queryKey: ['user', 'invoices'],
  });
