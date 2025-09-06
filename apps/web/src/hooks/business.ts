import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { client } from '@/utils/orpc';

export const useUserBusinessInformation = () =>
  useQuery({
    queryFn: async () => await client.businessLocation.get(),
    queryKey: ['user', 'businessInformation'],
  });

export const useUserBusinessProfile = () =>
  useQuery({
    queryFn: async () => await client.businessProfile.get(),
    queryKey: ['user', 'businessProfile'],
  });

export const useUserBusinessLocations = () =>
  useQuery({
    queryFn: async () => await client.businessLocation.get(),
    queryKey: ['user', 'businessLocations'],
  });

export const useUserBusinessLocationDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string }) =>
      await client.businessLocation.delete(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', 'businessLocations'],
      });
    },
  });
};

export const useUpdateCreateUserBusinessInformation = () =>
  useMutation({
    mutationFn: client.businessInformation.createUpdate,
    mutationKey: ['user', 'businessInformation', 'update'],
  });

export const useUpdateCreateUserBusinessLocation = () =>
  useMutation({
    mutationFn: client.businessLocation.createUpdate,
    mutationKey: ['user', 'businessLocation', 'update'],
  });

export const useUpdateCreateUserBusinessProfile = () =>
  useMutation({
    mutationFn: client.businessProfile.createUpdate,
    mutationKey: ['user', 'businessProfile', 'update'],
  });
