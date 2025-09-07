import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: '../../packages/db/src/schema/primary.ts',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
  out: '../../packages/db/src/migrations',
});
