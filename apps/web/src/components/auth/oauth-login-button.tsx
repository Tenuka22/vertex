'use client';

import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { Button } from '../ui/button';

export const OAuthLoginButton = () => {
  const loginWithGoogle = async () => {
    await authClient.signIn.social(
      {
        provider: 'google',
      },
      {
        onError: (error) => {
          toast.error(error.error.message || error.error.statusText);
        },
      }
    );
  };
  return (
    <Button
      className="w-full"
      onClick={() => loginWithGoogle()}
      type="button"
      variant="outline"
    >
      Proceed with Google
    </Button>
  );
};
