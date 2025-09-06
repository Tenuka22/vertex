import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { client } from '@/utils/orpc';

export const useUserInvoices = () =>
  useQuery({
    queryFn: async () => await client.invoice.get(),
    queryKey: ['user', 'invoices'],
  });

export const useUserInvoiceDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string }) =>
      await client.invoice.delete(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', 'invoices'],
      });
    },
  });
};
