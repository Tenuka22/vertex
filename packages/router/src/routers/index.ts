import type { AnyRouter } from '@orpc/server';
import { publicProcedure } from '../domain/orpc';
import {
  createUpdateBusinessProfile,
  deleteBusinessProfile,
  getUserBusinessProfile,
  reactivateBusinessProfile,
  softDeleteBusinessProfile,
} from './business';

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
} satisfies AnyRouter;

export type AppRouter = typeof appRouter;
