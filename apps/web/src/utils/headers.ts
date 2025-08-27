'use server';

import { headers } from 'next/headers';

export const getHeaders = async () => (await headers()).entries();
