import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteBusinessContact,
  getUserBusinessContacts,
} from '@/actions/business-contacts';

export const useUserBusinessContacts = () =>
  useQuery({
    queryFn: async () => await getUserBusinessContacts(),
    queryKey: ['user', 'businessContacts'],
  });

export const useUserBusinessContactDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string }) =>
      await deleteBusinessContact(params.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', 'businessContacts'],
      });
    },
  });
};
