import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { client } from '@/utils/orpc';

export const useUserBusinessContacts = () =>
  useQuery({
    queryFn: async () => await client.businessContact.get(),
    queryKey: ['user', 'businessContacts'],
  });

export const useUserBusinessContactDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string }) =>
      await client.businessContact.delete(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', 'businessContacts'],
      });
    },
  });
};
