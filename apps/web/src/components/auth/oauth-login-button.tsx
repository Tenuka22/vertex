'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { Loader } from '../global/loader';
import { Button } from '../ui/button';

export const OAuthLoginButton = () => {
  const [isFetching, setisFetching] = useState(false);

  const loginWithGoogle = async () => {
    setisFetching(true);
    await authClient.signIn.social(
      {
        provider: 'google',
        callbackURL: '/client-redirect',
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
          setisFetching(false);
        },
      }
    );
  };

  return (
    <Button
      className="w-full"
      disabled={isFetching}
      onClick={loginWithGoogle}
      type="button"
      variant="outline"
    >
      {isFetching ? (
        <div className="flex flex-row items-center gap-2">
          <Loader /> Signing in...
        </div>
      ) : (
        'Proceed with Google'
      )}
    </Button>
  );
};
