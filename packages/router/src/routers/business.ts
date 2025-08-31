import { ORPCError } from '@orpc/client';
import {
  BusinessProfileInsert,
  businessProfile,
} from '@repo/db/schema/primary';
import { and, eq } from 'drizzle-orm';
import z from 'zod';
import { db } from '../db';
import { protectedProcedure } from '../domain/orpc';

export const createUpdateBusinessProfile = protectedProcedure
  .input(
    z.object({
      businessData: BusinessProfileInsert.omit({ userId: true }),
    })
  )
  .handler(async ({ input, context }) => {
    const { user } = context.session;
    const providedBusiness = input.businessData;

    const existingBusiness = await db
      .select()
      .from(businessProfile)
      .where(eq(businessProfile.userId, user.id))
      .then((v) => v[0]);

    if (!providedBusiness.id && existingBusiness) {
      throw new ORPCError(
        'User can only have one business profile. Use update instead.'
      );
    }

    if (
      providedBusiness.id &&
      existingBusiness &&
      providedBusiness.id !== existingBusiness.id
    ) {
      throw new ORPCError(
        'Business ID does not match your existing business profile'
      );
    }

    if (providedBusiness.id && !existingBusiness) {
      throw new ORPCError('Business profile not found');
    }

    const insertedUpdatedData = await db
      .insert(businessProfile)
      .values({ ...providedBusiness, userId: user.id })
      .onConflictDoUpdate({
        target: businessProfile.id,
        set: {
          ...providedBusiness,
          userId: user.id,
          updatedAt: new Date(),
        },
      })
      .returning()
      .then((v) => v[0]);

    return insertedUpdatedData;
  });

export const getUserBusinessProfile = protectedProcedure.handler(
  async ({ context }) => {
    const { user } = context.session;

    const businessData = await db
      .select()
      .from(businessProfile)
      .where(eq(businessProfile.userId, user.id))
      .then((v) => v[0]);

    return businessData;
  }
);

export const deleteBusinessProfile = protectedProcedure.handler(
  async ({ context }) => {
    const { user } = context.session;

    const existingBusiness = await db
      .select()
      .from(businessProfile)
      .where(eq(businessProfile.userId, user.id))
      .then((v) => v[0]);

    if (!existingBusiness) {
      throw new ORPCError('No business profile found to delete');
    }

    const deletedData = await db
      .delete(businessProfile)
      .where(eq(businessProfile.userId, user.id))
      .returning()
      .then((v) => v[0]);

    return {
      success: true,
      message: 'Business profile deleted successfully',
      deletedBusiness: deletedData,
    };
  }
);

export const softDeleteBusinessProfile = protectedProcedure.handler(
  async ({ context }) => {
    const { user } = context.session;

    const existingBusiness = await db
      .select()
      .from(businessProfile)
      .where(
        and(
          eq(businessProfile.userId, user.id),
          eq(businessProfile.isActive, true)
        )
      )
      .then((v) => v[0]);

    if (!existingBusiness) {
      throw new ORPCError('No active business profile found to delete');
    }

    const softDeletedData = await db
      .update(businessProfile)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(businessProfile.userId, user.id))
      .returning()
      .then((v) => v[0]);

    return {
      success: true,
      message: 'Business profile deactivated successfully',
      deletedBusiness: softDeletedData,
    };
  }
);

export const reactivateBusinessProfile = protectedProcedure.handler(
  async ({ context }) => {
    const { user } = context.session;

    const existingBusiness = await db
      .select()
      .from(businessProfile)
      .where(
        and(
          eq(businessProfile.userId, user.id),
          eq(businessProfile.isActive, false)
        )
      )
      .then((v) => v[0]);

    if (!existingBusiness) {
      throw new ORPCError('No inactive business profile found to reactivate');
    }

    const reactivatedData = await db
      .update(businessProfile)
      .set({
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(businessProfile.userId, user.id))
      .returning()
      .then((v) => v[0]);

    return {
      success: true,
      message: 'Business profile reactivated successfully',
      reactivatedBusiness: reactivatedData,
    };
  }
);
