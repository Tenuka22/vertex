// biome-ignore lint/performance/noNamespaceImport:  WholeSchema Required
import * as schema from '@repo/db/schema/primary';
import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle(process.env.DATABASE_URL as string, {
  schema,
});
