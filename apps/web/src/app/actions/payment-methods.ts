'use server';

import { PaymentMethodInsert, paymentMethods } from '@repo/db/schema/primary';
import { eq } from 'drizzle-orm';
import type { z } from 'zod';
import { db } from '@/lib/db';
import { getUserBusinessProfile } from './business';

const getBusinessProfileId = async () => {
  const business = await getUserBusinessProfile();
  return business.id;
};

export async function createUpdatePaymentMethod(
  methodData: z.infer<
    typeof PaymentMethodInsert.omit<{ businessProfileId: true }>
  >
) {
  const providedMethod = PaymentMethodInsert.omit({
    businessProfileId: true,
  }).parse(methodData);
  const businessProfileId = await getBusinessProfileId();

  const existingMethod = providedMethod.id
    ? await db
        .select()
        .from(paymentMethods)
        .where(eq(paymentMethods.id, providedMethod.id))
        .then((v) => v[0])
    : null;

  if (
    providedMethod.id &&
    existingMethod &&
    existingMethod.businessProfileId !== businessProfileId
  ) {
    throw new Error('Payment method ID does not match your business profile');
  }

  const insertedUpdatedMethod = await db
    .insert(paymentMethods)
    .values({ ...providedMethod, businessProfileId })
    .onConflictDoUpdate({
      target: paymentMethods.id,
      set: {
        ...providedMethod,
        businessProfileId,
        updatedAt: new Date(),
      },
    })
    .returning()
    .then((v) => v[0]);

  return insertedUpdatedMethod;
}

export async function getUserPaymentMethods() {
  const businessProfileId = await getBusinessProfileId();
  const methods = await db
    .select()
    .from(paymentMethods)
    .where(eq(paymentMethods.businessProfileId, businessProfileId));

  return methods;
}

export async function deletePaymentMethod(id: string) {
  const businessProfileId = await getBusinessProfileId();

  const existingMethod = await db
    .select()
    .from(paymentMethods)
    .where(eq(paymentMethods.id, id))
    .then((v) => v[0]);

  if (
    !existingMethod ||
    existingMethod.businessProfileId !== businessProfileId
  ) {
    throw new Error('No payment method found or unauthorized to delete');
  }

  const deletedMethod = await db
    .delete(paymentMethods)
    .where(eq(paymentMethods.id, id))
    .returning()
    .then((v) => v[0]);

  return {
    success: true,
    message: 'Payment method deleted successfully',
    deletedMethod,
  };
}
