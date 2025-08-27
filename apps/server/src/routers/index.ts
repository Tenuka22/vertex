import type { AnyRouter, RouterClient } from '@orpc/server';
import { publicProcedure } from '../lib/orpc';
import { createUpdateBusinessProfile, getBusinessProfile } from './business';

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return 'OK';
  }),
  businessProfile: {
    createUpdate: createUpdateBusinessProfile,
    select: getBusinessProfile,
  },
} satisfies AnyRouter;
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
