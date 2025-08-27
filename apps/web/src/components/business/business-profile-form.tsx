'use client';

import { ORPCError } from '@orpc/client';
import { type ReactFormExtendedApi, useForm } from '@tanstack/react-form';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';
import { orpc } from '@/utils/orpc';
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
import { businessProfileInsertSchema } from '@repo/db/schema/primary';

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
            <RadioGroupItem
              aria-label="Blue"
              className="size-6 border-[#3b82f6] bg-[#3b82f6] shadow-none data-[state=checked]:border-[#3b82f6] data-[state=checked]:bg-[#3b82f6]"
              value="#3b82f6"
            />
            <RadioGroupItem
              aria-label="Indigo"
              className="size-6 border-[#6366f1] bg-[#6366f1] shadow-none data-[state=checked]:border-[#6366f1] data-[state=checked]:bg-[#6366f1]"
              value="#6366f1"
            />
            <RadioGroupItem
              aria-label="Pink"
              className="size-6 border-[#ec4899] bg-[#ec4899] shadow-none data-[state=checked]:border-[#ec4899] data-[state=checked]:bg-[#ec4899]"
              value="#ec4899"
            />
            <RadioGroupItem
              aria-label="Red"
              className="size-6 border-[#ef4444] bg-[#ef4444] shadow-none data-[state=checked]:border-[#ef4444] data-[state=checked]:bg-[#ef4444]"
              value="#ef4444"
            />
            <RadioGroupItem
              aria-label="Orange"
              className="size-6 border-[#f97316] bg-[#f97316] shadow-none data-[state=checked]:border-[#f97316] data-[state=checked]:bg-[#f97316]"
              value="#f97316"
            />
            <RadioGroupItem
              aria-label="Amber"
              className="size-6 border-[#f59e0b] bg-[#f59e0b] shadow-none data-[state=checked]:border-[#f59e0b] data-[state=checked]:bg-[#f59e0b]"
              value="#f59e0b"
            />
            <RadioGroupItem
              aria-label="Emerald"
              className="size-6 border-[#10b981] bg-[#10b981] shadow-none data-[state=checked]:border-[#10b981] data-[state=checked]:bg-[#10b981]"
              value="#10b981"
            />
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
      ...defaultData,
    } satisfies FormValues as FormValues,
    validators: { onSubmit: businessProfileInsertSchema },
    onSubmit: async ({ value }) => {
      try {
        const serverReturn = await orpc.businessProfile.createUpdate.call({
          businessData: value,
        });
        toast.success(`${serverReturn.companyName} Business profile created!`);
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
