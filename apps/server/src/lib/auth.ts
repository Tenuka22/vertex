import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { openAPI } from 'better-auth/plugins';
import { drizzle } from 'drizzle-orm/node-postgres';
// biome-ignore lint/performance/noNamespaceImport: Drizzle Rule
import * as schema from '../db/schema/auth';

export const auth = betterAuth({
  database: drizzleAdapter(drizzle(process.env.DATABASE_URL), {
    provider: 'pg',

    schema,
  }),
  trustedOrigins: [process.env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  advanced: {
    defaultCookieAttributes: {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    },
  },
  plugins: [
    openAPI({
      path: '/docs',
    }),
  ],
});
