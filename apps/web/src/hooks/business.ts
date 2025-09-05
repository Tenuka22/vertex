import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/utils/orpc';

export const useUserBusinessInformation = () =>
  useQuery(orpc.businessInformation.get.queryOptions({}));

export const useUserBusinessProfile = () =>
  useQuery(orpc.businessProfile.get.queryOptions({}));

export const useUserBusinessLocations = (businessProfileId?: string) =>
  useQuery(
    orpc.businessLocation.get.queryOptions({ input: { businessProfileId } })
  );
