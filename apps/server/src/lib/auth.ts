import { authClient } from './auth-client';

export const auth = authClient({ ...process.env });
