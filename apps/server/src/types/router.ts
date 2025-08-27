import type { RouterClient } from '@orpc/server';
import type { appRouter } from '@/routers';

export type AppRouterClient = RouterClient<typeof appRouter>;
