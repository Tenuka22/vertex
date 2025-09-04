import { ORPCError } from '@orpc/client';
import { call } from '@orpc/server';
import { PaymentMethodInsert, paymentMethods } from '@repo/db/schema/primary';
import { eq } from 'drizzle-orm';
import z from 'zod';
import type { Context } from '../../../../apps/server/src/lib/context';
import { db } from '../db';
import { protectedProcedure } from '../domain/orpc';
import { getUserBusinessProfile } from './business';

const getBusinessProfileId = async (context: Context) => {
  const business = await call(getUserBusinessProfile, {}, { context });
  return business.id;
};

export const createUpdatePaymentMethod = protectedProcedure
  .input(
    z.object({
      methodData: PaymentMethodInsert.omit({ businessProfileId: true }),
    })
  )
  .handler(async ({ input, context }) => {
    const providedMethod = input.methodData;
    const businessProfileId = await getBusinessProfileId(context);

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
      throw new ORPCError(
        'Payment method ID does not match your business profile'
      );
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
  });

export const getUserPaymentMethods = protectedProcedure.handler(
  async ({ context }) => {
    const businessProfileId = await getBusinessProfileId(context);
    const methods = await db
      .select()
      .from(paymentMethods)
      .where(eq(paymentMethods.businessProfileId, businessProfileId));

    return methods;
  }
);

export const deletePaymentMethod = protectedProcedure
  .input(z.object({ id: z.string() }))
  .handler(async ({ input, context }) => {
    const businessProfileId = await getBusinessProfileId(context);

    const existingMethod = await db
      .select()
      .from(paymentMethods)
      .where(eq(paymentMethods.id, input.id))
      .then((v) => v[0]);

    if (
      !existingMethod ||
      existingMethod.businessProfileId !== businessProfileId
    ) {
      throw new ORPCError('No payment method found or unauthorized to delete');
    }

    const deletedMethod = await db
      .delete(paymentMethods)
      .where(eq(paymentMethods.id, input.id))
      .returning()
      .then((v) => v[0]);

    return {
      success: true,
      message: 'Payment method deleted successfully',
      deletedMethod,
    };
  });
