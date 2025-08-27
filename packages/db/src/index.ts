import { drizzle } from 'drizzle-orm/node-postgres';

export const db =({DATABASE_URL}:{DATABASE_URL:string}) => drizzle(DATABASE_URL);
