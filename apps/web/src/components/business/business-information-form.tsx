'use client';

import { ORPCError } from '@orpc/client';
import { BusinessInformationInsert } from '@repo/db/schema/primary';
import { type ReactFormExtendedApi, useForm } from '@tanstack/react-form';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';
import { orpc } from '@/utils/orpc';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
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
import { Textarea } from '../ui/textarea';

type FormValues = z.infer<typeof BusinessInformationInsert>;
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

const BasicInfoFields = ({ form }: { form: FormType }) => (
  <div className="grid gap-4 sm:grid-cols-2">
    <form.Field name="taxId">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Tax ID</Label>
          <Input
            id={field.name}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="123-456-789"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="registrationNumber">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Registration Number</Label>
          <Input
            id={field.name}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="REG-12345"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="businessLicense">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Business License</Label>
          <Input
            id={field.name}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="LIC-1234"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="baseCurrency">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Base Currency</Label>
          <Input
            id={field.name}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="USD"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>
  </div>
);

const BusinessHoursFields = ({ form }: { form: FormType }) => (
  <div className="grid gap-4 sm:grid-cols-2">
    <form.Field name="businessHoursStart">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Business Hours Start</Label>
          <Input
            id={field.name}
            onChange={(e) => field.handleChange(e.target.value)}
            type="time"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="businessHoursEnd">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Business Hours End</Label>
          <Input
            id={field.name}
            onChange={(e) => field.handleChange(e.target.value)}
            type="time"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="operatingDays">
      {(field) => (
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={field.name}>Operating Days</Label>
          <Input
            id={field.name}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="Mon-Fri"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>
  </div>
);

const AdvancedSettingsFields = ({ form }: { form: FormType }) => (
  <div className="grid gap-4 sm:grid-cols-2">
    <form.Field name="timezone">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Timezone</Label>
          <Input
            id={field.name}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="UTC"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="dateFormat">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Date Format</Label>
          <Input
            id={field.name}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="MM/dd/yyyy"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="numberFormat">
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Number Format</Label>
          <Input
            id={field.name}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="en-US"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="certifications">
      {(field) => (
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={field.name}>Certifications</Label>
          <Textarea
            id={field.name}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="Certifications..."
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="complianceNotes">
      {(field) => (
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={field.name}>Compliance Notes</Label>
          <Textarea
            id={field.name}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="Compliance notes..."
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="internalNotes">
      {(field) => (
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={field.name}>Internal Notes</Label>
          <Textarea
            id={field.name}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="Internal notes..."
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>

    <form.Field name="socialMediaLinks">
      {(field) => (
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={field.name}>Other Social Media Links</Label>
          <Textarea
            id={field.name}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="JSON or comma separated URLs"
            value={field.state.value ?? ''}
          />
        </div>
      )}
    </form.Field>
  </div>
);

export const BusinessInformationForm = <TDefaultData extends { id: string }>({
  defaultData,
}: {
  defaultData?: TDefaultData;
}) => {
  const [currentStep, setCurrentStep] = useState(FIRST_STEP);

  const form = useForm({
    defaultValues: {
      businessProfileId: '',
      taxId: '',
      registrationNumber: '',
      businessLicense: '',
      baseCurrency: '',
      timezone: '',
      dateFormat: '',
      numberFormat: '',
      businessHoursStart: '',
      businessHoursEnd: '',
      operatingDays: '',
      certifications: '',
      complianceNotes: '',
      internalNotes: '',
      socialMediaLinks: '',
      ...defaultData,
    } satisfies FormValues as FormValues,
    validators: { onSubmit: BusinessInformationInsert },
    onSubmit: async ({ value }) => {
      try {
        await orpc.businessInformation.createUpdate.call({ infoData: value });
        toast.success('Business information saved!');
      } catch (error) {
        toast.error(
          error instanceof ORPCError ? error.message : 'Error saving info.'
        );
      }
    },
  });

  const steps = [
    {
      step: 1,
      title: 'Basic Info',
      component: <BasicInfoFields form={form as FormType} />,
    },
    {
      step: 2,
      title: 'Business Hours',
      component: <BusinessHoursFields form={form as FormType} />,
    },
    {
      step: 3,
      title: 'Advanced',
      component: <AdvancedSettingsFields form={form as FormType} />,
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
              <StepperTrigger className="flex-col gap-1 rounded">
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
                {(state) => {
                  let buttonContent: React.ReactNode;
                  if (state.isSubmitting) {
                    buttonContent = 'Saving...';
                  } else if (currentStep === steps.length) {
                    buttonContent = 'Save Info';
                  } else {
                    buttonContent = (
                      <>
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    );
                  }
                  return (
                    <Button
                      disabled={state.isSubmitting}
                      size="sm"
                      type="submit"
                    >
                      {buttonContent}
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
