import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createUpdateBusinessProfile,
  getUserBusinessProfile,
} from '@/actions/business';
import {
  createUpdateBusinessInformation,
  getUserBusinessInformation,
} from '@/actions/business-information';
import {
  createUpdateBusinessLocation,
  deleteBusinessLocation,
  getBusinessLocations,
} from '@/actions/business-location';

export const useUserBusinessInformation = () =>
  useQuery({
    queryFn: async () => await getUserBusinessInformation(),
    queryKey: ['user', 'businessInformation'],
  });

export const useUserBusinessProfile = () =>
  useQuery({
    queryFn: async () => await getUserBusinessProfile(),
    queryKey: ['user', 'businessProfile'],
  });

export const useUserBusinessLocations = () =>
  useQuery({
    queryFn: async () => await getBusinessLocations(),
    queryKey: ['user', 'businessLocations'],
  });

export const useUserBusinessLocationDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string }) =>
      await deleteBusinessLocation(params.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', 'businessLocations'],
      });
    },
  });
};

export const useUpdateCreateUserBusinessInformation = () =>
  useMutation({
    mutationFn: createUpdateBusinessInformation,
    mutationKey: ['user', 'businessInformation', 'update'],
  });

export const useUpdateCreateUserBusinessLocation = () =>
  useMutation({
    mutationFn: createUpdateBusinessLocation,
    mutationKey: ['user', 'businessLocation', 'update'],
  });

export const useUpdateCreateUserBusinessProfile = () =>
  useMutation({
    mutationFn: createUpdateBusinessProfile,
    mutationKey: ['user', 'businessProfile', 'update'],
  });
