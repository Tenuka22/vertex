'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const CALLBACK_PAGE = () => {
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
    return <div>Loading...</div>;
  }

  return null;
};

export default CALLBACK_PAGE;
