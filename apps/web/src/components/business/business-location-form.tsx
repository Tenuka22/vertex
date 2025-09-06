'use client';

import { ORPCError } from '@orpc/client';
import { BusinessLocationInsert } from '@repo/db/schema/primary';
import { type ReactFormExtendedApi, useForm } from '@tanstack/react-form';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';
import { useUpdateCreateUserBusinessLocation } from '@/hooks/business';
import { Loader } from '../global/loader';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '../ui/stepper';

type FormValues = z.infer<typeof BusinessLocationInsert>;
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

const BasicLocationFields = ({ form }: { form: FormType }) => (
  <div className="grid gap-4 sm:grid-cols-2">
    <form.Field name="locationName">
      {(field) => (
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={field.name}>Location Name</Label>
          <Input
            id={field.name}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="Main Branch"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="locationType">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Location Type</Label>
          <Input
            id={field.name}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="Office, Warehouse..."
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="isHeadquarters">
      {(field) => (
        <div className="flex items-center gap-2 sm:col-span-2">
          <Checkbox
            checked={field.state.value ?? false}
            id={field.name}
            onCheckedChange={(v) => field.handleChange(!!v)}
          />
          <Label htmlFor={field.name}>Is Headquarters</Label>
        </div>
      )}
    </form.Field>

    <form.Field name="isActive">
      {(field) => (
        <div className="flex items-center gap-2 sm:col-span-2">
          <Checkbox
            checked={field.state.value ?? true}
            id={field.name}
            onCheckedChange={(v) => field.handleChange(!!v)}
          />
          <Label htmlFor={field.name}>Active</Label>
        </div>
      )}
    </form.Field>
  </div>
);

//
// Step 2 - Address Info
//
const AddressFields = ({ form }: { form: FormType }) => (
  <div className="grid gap-4 sm:grid-cols-2">
    <form.Field name="addressLine1">
      {(field) => (
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={field.name}>Address Line 1</Label>
          <Input
            id={field.name}
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
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="Suite 100"
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
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="USA"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>
  </div>
);

//
// Step 3 - Contact & Coordinates
//
const ContactFields = ({ form }: { form: FormType }) => (
  <div className="grid gap-4 sm:grid-cols-2">
    <form.Field name="phone">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Phone</Label>
          <Input
            id={field.name}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="+1 555 555 5555"
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
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="location@example.com"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="latitude">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Latitude</Label>
          <Input
            id={field.name}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="40.7128"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="longitude">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Longitude</Label>
          <Input
            id={field.name}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="-74.0060"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>
  </div>
);

export const BusinessLocationForm = <TDefaultData extends { id: string }>({
  defaultData,
}: {
  defaultData: TDefaultData;
}) => {
  const [currentStep, setCurrentStep] = useState(FIRST_STEP);
  const { mutate: updateCreateLocation } =
    useUpdateCreateUserBusinessLocation();
  const form = useForm({
    defaultValues: {
      businessProfileId: '',
      locationName: '',
      locationType: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phone: '',
      email: '',
      latitude: '',
      longitude: '',
      isHeadquarters: false,
      isActive: true,
      ...defaultData,
    } satisfies FormValues as FormValues,
    validators: { onSubmit: BusinessLocationInsert },
    onSubmit: async ({ value }) => {
      try {
        await updateCreateLocation({
          locationData: value,
        });
        toast.success('Location saved!');
      } catch (error) {
        toast.error(
          error instanceof ORPCError ? error.message : 'Error saving location.'
        );
      }
    },
  });

  const steps = [
    {
      step: 1,
      title: 'Info',
      component: <BasicLocationFields form={form as FormType} />,
    },
    {
      step: 2,
      title: 'Address',
      component: <AddressFields form={form as FormType} />,
    },
    {
      step: 3,
      title: 'Additional',
      component: <ContactFields form={form as FormType} />,
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
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
            )}
            <div className={currentStep === FIRST_STEP ? 'ml-auto' : ''}>
              <form.Subscribe>
                {(state) => (
                  <Button disabled={state.isSubmitting} size="sm" type="submit">
                    {(() => {
                      if (state.isSubmitting) {
                        return (
                          <>
                            <Loader /> Saving...
                          </>
                        );
                      }
                      if (currentStep === steps.length) {
                        return 'Save Location';
                      }
                      return (
                        <>
                          Next <ChevronRight className="ml-2 h-4 w-4" />
                        </>
                      );
                    })()}
                  </Button>
                )}
              </form.Subscribe>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
