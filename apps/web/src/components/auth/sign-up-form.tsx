import { useForm } from '@tanstack/react-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { H3, Muted, P } from '../design/typography';
import { Loader } from '../global/loader';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { signUpSchema } from './herpers';
import { OAuthLoginButton } from './oauth-login-button';

export const SignUpForm = ({
  onSwitchToSignIn,
}: {
  onSwitchToSignIn: () => void;
}) => {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: () => {
            toast.success('Sign up successful');
            router.push('/');
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        }
      );
    },
    validators: {
      onSubmit: signUpSchema,
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <H3 className="text-center">Create Account</H3>
          <P className="text-center text-muted-foreground">
            Enter your details to create your new account
          </P>
        </CardHeader>

        <CardContent className="space-y-4">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div className="space-y-2">
              <form.Field name="name">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Full Name</Label>
                    <Input
                      className={
                        field.state.meta.errors.length > 0
                          ? 'border-destructive'
                          : ''
                      }
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter your full name"
                      value={field.state.value}
                    />
                    {field.state.meta.errors.map((error) => (
                      <P
                        className="!mt-1 text-destructive text-sm"
                        key={error?.message}
                      >
                        {error?.message}
                      </P>
                    ))}
                  </div>
                )}
              </form.Field>
            </div>

            <div className="space-y-2">
              <form.Field name="email">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Email</Label>
                    <Input
                      className={
                        field.state.meta.errors.length > 0
                          ? 'border-destructive'
                          : ''
                      }
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="name@example.com"
                      type="email"
                      value={field.state.value}
                    />
                    {field.state.meta.errors.map((error) => (
                      <P
                        className="!mt-1 text-destructive text-sm"
                        key={error?.message}
                      >
                        {error?.message}
                      </P>
                    ))}
                  </div>
                )}
              </form.Field>
            </div>

            <div className="space-y-2">
              <form.Field name="password">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Password</Label>
                    <Input
                      className={
                        field.state.meta.errors.length > 0
                          ? 'border-destructive'
                          : ''
                      }
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Create a secure password"
                      type="password"
                      value={field.state.value}
                    />
                    {field.state.meta.errors.map((error) => (
                      <P
                        className="!mt-1 text-destructive text-sm"
                        key={error?.message}
                      >
                        {error?.message}
                      </P>
                    ))}
                  </div>
                )}
              </form.Field>
            </div>

            <OAuthLoginButton />

            <form.Subscribe>
              {(state) => (
                <Button
                  className="w-full"
                  disabled={!state.canSubmit || state.isSubmitting}
                  type="submit"
                >
                  {state.isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader /> Creating Account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              )}
            </form.Subscribe>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <Muted>Or</Muted>
            </div>
          </div>

          <div className="text-center text-sm">
            <Muted>Already have an account? </Muted>
            <Button
              className="px-0 font-medium"
              onClick={onSwitchToSignIn}
              variant="link"
            >
              Sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
