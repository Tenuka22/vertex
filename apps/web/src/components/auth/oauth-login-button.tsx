'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { Loader } from '../global/loader';
import { Button } from '../ui/button';

export const OAuthLoginButton = () => {
  const [isLoading, setisLoading] = useState(false);

  const loginWithGoogle = async () => {
    setisLoading(true);
    await authClient.signIn.social(
      {
        provider: 'google',
        callbackURL: '/app',
      },
      {
        onError: (error) => {
          toast.error(
            error.error.message ||
              error.error.statusText ||
              'Unknown error occured while connecting to the google provider.'
          );
        },
        onSettled: () => {
          setisLoading(false);
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
