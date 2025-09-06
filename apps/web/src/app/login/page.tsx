'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SignInForm } from '@/components/auth/sign-in-form';
import { SignUpForm } from '@/components/auth/sign-up-form';
import LoadingSpinner from '@/components/global/page-loader';
import { authClient } from '@/lib/auth-client';

const LOGIN_PAGE = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const { data: userSession, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (userSession?.user && !isPending) {
      router.push('/');
    }
  }, [userSession, router, isPending]);

  if (isPending) {
    return <LoadingSpinner />;
  }

  return showSignIn ? (
    <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
  ) : (
    <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
  );
};

export default LOGIN_PAGE;
