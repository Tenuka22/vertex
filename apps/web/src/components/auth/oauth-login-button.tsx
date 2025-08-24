'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { Loader } from '../global/loader';
import { Button } from '../ui/button';

export const OAuthLoginButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    await authClient.signIn.social(
      {
        provider: 'google',
      },
      {
        onError: (error) => {
          toast.error(error.error.message || error.error.statusText);
        },
        onSettled: () => {
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <Button
      className="w-full"
      disabled={isLoading}
      onClick={loginWithGoogle}
      type="button"
      variant="outline"
    >
      {isLoading ? (
        <div className="flex flex-row items-center gap-2">
          <Loader /> Signing in...
        </div>
      ) : (
        'Proceed with Google'
      )}
    </Button>
  );
};
