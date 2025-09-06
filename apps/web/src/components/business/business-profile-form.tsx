'use client';

import { ORPCError } from '@orpc/client';
import { businessProfileInsertSchema } from '@repo/db/schema/primary';
import { type ReactFormExtendedApi, useForm } from '@tanstack/react-form';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';
import { useUpdateCreateUserBusinessProfile } from '@/hooks/business';
import { Loader } from '../global/loader';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '../ui/stepper';
import { Textarea } from '../ui/textarea';

type FormValues = z.infer<typeof businessProfileInsertSchema>;

const FIRST_STEP = 1;

type FormType = ReactFormExtendedApi<
  FormValues,
  // biome-ignore lint/suspicious/noExplicitAny: RUle
  any,
  // biome-ignore lint/suspicious/noExplicitAny: RUle
  any,
  // biome-ignore lint/suspicious/noExplicitAny: RUle
  any,
  // biome-ignore lint/suspicious/noExplicitAny: RUle
  any,
  // biome-ignore lint/suspicious/noExplicitAny: RUle
  any,
  // biome-ignore lint/suspicious/noExplicitAny: RUle
  any,
  // biome-ignore lint/suspicious/noExplicitAny: RUle
  any,
  // biome-ignore lint/suspicious/noExplicitAny: RUle
  any,
  // biome-ignore lint/suspicious/noExplicitAny: RUle
  any,
  // biome-ignore lint/suspicious/noExplicitAny: RUle
  any,
  // biome-ignore lint/suspicious/noExplicitAny: RUle
  any
>;
const FirstStepFields = ({ form }: { form: FormType }) => (
  <div className="grid gap-4 sm:grid-cols-2">
    <form.Field name="companyName">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Company Name</Label>
          <Input
            id={field.name}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="Acme Inc."
            value={field.state.value}
          />
          {field.state.meta.errors.map((err) => (
            <p className="text-destructive text-sm" key={err?.message}>
              {err?.message}
            </p>
          ))}
        </div>
      )}
    </form.Field>

    <form.Field name="legalName">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Legal Name</Label>
          <Input
            id={field.name}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="Acme Corporation"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="tradingName">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Trading Name</Label>
          <Input
            id={field.name}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="Acme Trading"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="email">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Email</Label>
          <Input
            id={field.name}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="info@acme.com"
            type="email"
            value={field.state.value}
          />
          {field.state.meta.errors.map((err) => (
            <p className="text-destructive text-sm" key={err?.message}>
              {err?.message}
            </p>
          ))}
        </div>
      )}
    </form.Field>

    <form.Field name="phone">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Phone</Label>
          <Input
            id={field.name}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="+1 555 555 5555"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="website">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Website</Label>
          <Input
            id={field.name}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="https://example.com"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="industry">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Industry</Label>
          <Input
            id={field.name}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="Software"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="businessType">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Business Type</Label>
          <Input
            id={field.name}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="Private"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="employeeCount">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Employee Count</Label>
          <Input
            id={field.name}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(Number(e.target.value))}
            placeholder="100"
            type="number"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="foundedYear">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Founded Year</Label>
          <Input
            id={field.name}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(Number(e.target.value))}
            placeholder="2020"
            type="number"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="addressLine1">
      {(field) => (
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={field.name}>Address Line 1</Label>
          <Input
            id={field.name}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="123 Main St"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="addressLine2">
      {(field) => (
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={field.name}>Address Line 2</Label>
          <Input
            id={field.name}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="Apt, Suite, etc."
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="city">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>City</Label>
          <Input
            id={field.name}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="New York"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="state">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>State</Label>
          <Input
            id={field.name}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="NY"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="postalCode">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Postal Code</Label>
          <Input
            id={field.name}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="10001"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="country">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Country</Label>
          <Input
            id={field.name}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="USA"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>
  </div>
);

const SecondStepFields = ({ form }: { form: FormType }) => (
  <div className="grid gap-4 sm:grid-cols-2">
    <form.Field name="logoUrl">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Logo URL</Label>
          <Input
            id={field.name}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="https://logo.com/acme.png"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="brandColor">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Brand Color</Label>
          <RadioGroup
            className="flex h-9 items-center gap-1.5"
            defaultValue={field.state.value ?? '#3b82f6'}
            onValueChange={field.handleChange}
          >
            {[
              '#3b82f6',
              '#6366f1',
              '#ec4899',
              '#ef4444',
              '#f97316',
              '#f59e0b',
              '#10b981',
            ].map((color) => (
              <RadioGroupItem
                aria-label={color}
                className={`size-6 border-[${color}] bg-[${color}] shadow-none data-[state=checked]:border-[${color}] data-[state=checked]:bg-[${color}]`}
                key={color}
                value={color}
              />
            ))}
          </RadioGroup>
        </div>
      )}
    </form.Field>

    <form.Field name="description">
      {(field) => (
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={field.name}>Description</Label>
          <Textarea
            className="min-h-32"
            id={field.name}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="Brief description of your company"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="mission">
      {(field) => (
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={field.name}>Mission</Label>
          <Textarea
            className="min-h-24"
            id={field.name}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="Company mission"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="vision">
      {(field) => (
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={field.name}>Vision</Label>
          <Textarea
            className="min-h-24"
            id={field.name}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="Company vision"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="twitter">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Twitter</Label>
          <Input
            id={field.name}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="@acme"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="linkedin">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>LinkedIn</Label>
          <Input
            id={field.name}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="https://linkedin.com/company/acme"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="isActive">
      {(field) => (
        <div className="flex items-center gap-2 sm:col-span-2">
          <Checkbox
            checked={field.state.value ?? false}
            id={field.name}
            onBlur={field.handleBlur}
            onCheckedChange={(v) => field.handleChange(!!v)}
          />
          <Label htmlFor={field.name}>Active</Label>
        </div>
      )}
    </form.Field>
  </div>
);

export const BusinessProfileForm = <TDefaultData extends { id: string }>({
  defaultData,
}: {
  defaultData?: TDefaultData;
}) => {
  const [currentStep, setCurrentStep] = useState(FIRST_STEP);
  const { mutate: updateCreateBusinessProfile, data } =
    useUpdateCreateUserBusinessProfile();
  const form = useForm({
    defaultValues: {
      companyName: '',
      userId: '',
      email: '',
      phone: '',
      website: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      logoUrl: '',
      brandColor: '',
      description: '',
      isActive: true,
      twitter: '',
      linkedin: '',
      ...defaultData,
    } satisfies FormValues as FormValues,
    validators: { onSubmit: businessProfileInsertSchema },
    onSubmit: async ({ value }) => {
      try {
        await updateCreateBusinessProfile({
          businessData: value,
        });
        toast.success(`${data?.companyName} Business profile created!`);
      } catch (error) {
        if (error instanceof ORPCError) {
          toast.error(error.message);
        } else {
          toast.error('Creating or updating the business thorwed an error.');
        }
      }
    },
  });

  const steps = [
    {
      step: 1,
      title: 'Business Info',
      component: <FirstStepFields form={form as FormType} />,
    },
    {
      step: 2,
      title: 'Contact & Branding',
      component: <SecondStepFields form={form as FormType} />,
    },
  ];

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () =>
    setCurrentStep((prev) => Math.max(prev - 1, FIRST_STEP));

  const currentComponent = steps.find((s) => s.step === currentStep)?.component;

  return (
    <Card className="h-fit w-full">
      <CardHeader>
        <Stepper onValueChange={setCurrentStep} value={currentStep}>
          {steps.map(({ step, title }) => (
            <StepperItem
              className="not-last:flex-1 max-md:items-start"
              key={step}
              step={step}
            >
              <StepperTrigger className="flex-col gap-3 rounded">
                <StepperIndicator />
                <div className="px-2">
                  <StepperTitle>{title}</StepperTitle>
                </div>
              </StepperTrigger>
              {step < steps.length && (
                <StepperSeparator className="max-md:mt-3.5 md:mx-2" />
              )}
            </StepperItem>
          ))}
        </Stepper>
      </CardHeader>

      <CardContent>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (currentStep < steps.length) {
              nextStep();
            } else {
              form.handleSubmit();
            }
          }}
        >
          {currentComponent}

          <div className="flex justify-between">
            {currentStep > FIRST_STEP && (
              <Button
                onClick={prevStep}
                size="sm"
                type="button"
                variant="outline"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            )}

            <div className={currentStep === FIRST_STEP ? 'ml-auto' : ''}>
              <form.Subscribe>
                {(state) => {
                  const isLastStep = currentStep === steps.length;
                  const isSubmitting = state.isSubmitting;

                  return (
                    <Button disabled={isSubmitting} size="sm" type="submit">
                      {isSubmitting && (
                        <>
                          <Loader />
                          Creating...
                        </>
                      )}

                      {!isSubmitting && isLastStep && 'Create Profile'}

                      {!(isSubmitting || isLastStep) && (
                        <>
                          Next
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  );
                }}
              </form.Subscribe>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
