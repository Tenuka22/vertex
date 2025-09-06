'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import LoadingSpinner from '@/components/global/page-loader';

const CallbackHandler = () => {
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      localStorage.setItem('bearer_token', token);
    }
    setLoading(false);
    router.replace('/app');
  }, [params, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return null;
};

export default function CALLBACK_PAGE() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CallbackHandler />
    </Suspense>
  );
}
