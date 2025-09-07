import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteInvoice, getUserInvoices } from '@/actions/invoices';

export const useUserInvoices = () =>
  useQuery({
    queryFn: async () => await getUserInvoices(),
    queryKey: ['user', 'invoices'],
  });

export const useUserInvoiceDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string }) =>
      await deleteInvoice(params.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', 'invoices'],
      });
    },
  });
};
