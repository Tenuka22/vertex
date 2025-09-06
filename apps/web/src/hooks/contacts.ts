import { useQuery } from '@tanstack/react-query';
import { client } from '@/utils/orpc';

export const useUserBusinessContacts = () =>
  useQuery({
    queryFn: async () => await client.businessContact.get(),
    queryKey: ['user', 'businessContacts'],
  });
