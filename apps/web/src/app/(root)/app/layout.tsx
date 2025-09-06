'use client';
import { useRouter } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';
import LoadingSpinner from '@/components/global/page-loader';
import { Sidebar } from '@/components/navigation/app/sidebar';
import { authClient } from '@/lib/auth-client';

const APP_LAYOUT = ({ children }: { children: ReactNode }) => {
  const { data: userSession, isPending } = authClient.useSession();
  const router = useRouter();
  useEffect(() => {
    if (!(userSession?.user || isPending)) {
      router.push('/login');
    }
  }, [userSession, router, isPending]);

  if (isPending) {
    return <LoadingSpinner />;
  }

  return <Sidebar>{children}</Sidebar>;
};

export default APP_LAYOUT;
