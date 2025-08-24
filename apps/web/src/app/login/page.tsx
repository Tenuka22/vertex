'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SignInForm } from '@/components/auth/sign-in-form';
import { SignUpForm } from '@/components/auth/sign-up-form';
import { authClient } from '@/lib/auth-client';

export default function LoginPage() {
  const [showSignIn, setShowSignIn] = useState(false);
  const { data: userSession } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (userSession?.user) {
      router.push('/');
    }
  }, [userSession, router]);

  return showSignIn ? (
    <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
  ) : (
    <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
  );
}
