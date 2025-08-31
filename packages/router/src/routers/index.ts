import type { AnyRouter } from '@orpc/server';
import { publicProcedure } from '../domain/orpc';
import {
  createUpdateBusinessProfile,
  deleteBusinessProfile,
  getUserBusinessProfile,
  reactivateBusinessProfile,
  softDeleteBusinessProfile,
} from './business';

import {
  createUpdateBusinessInformation,
  deleteBusinessInformation,
  getUserBusinessInformation,
} from './businessInformation';

import {
  createUpdateBusinessLocation,
  deleteBusinessLocation,
  getBusinessLocations,
} from './businessLocation';

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return 'OK';
  }),
  businessProfile: {
    createUpdate: createUpdateBusinessProfile,
    get: getUserBusinessProfile,
    delete: deleteBusinessProfile,
    softDelete: softDeleteBusinessProfile,
    reactivate: reactivateBusinessProfile,
  },
  businessInformation: {
    createUpdate: createUpdateBusinessInformation,
    get: getUserBusinessInformation,
    delete: deleteBusinessInformation,
  },
  businessLocation: {
    createUpdate: createUpdateBusinessLocation,
    get: getBusinessLocations,
    delete: deleteBusinessLocation,
  },
} satisfies AnyRouter;

export type AppRouter = typeof appRouter;
