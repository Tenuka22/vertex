'use server';

import {
  BusinessProfileInsert,
  businessProfile,
} from '@repo/db/schema/primary';
import { and, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import type { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

const getUserId = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  return session.user.id;
};

export async function createUpdateBusinessProfile(
  businessData: z.infer<typeof BusinessProfileInsert.omit<{ userId: true }>>
) {
  const userId = await getUserId();
  const providedBusiness = BusinessProfileInsert.omit({ userId: true }).parse(
    businessData
  );

  const existingBusiness = await db
    .select()
    .from(businessProfile)
    .where(eq(businessProfile.userId, userId))
    .then((v) => v[0]);

  if (!providedBusiness.id && existingBusiness) {
    throw new Error(
      'User can only have one business profile. Use update instead.'
    );
  }

  if (
    providedBusiness.id &&
    existingBusiness &&
    providedBusiness.id !== existingBusiness.id
  ) {
    throw new Error(
      'Business ID does not match your existing business profile'
    );
  }

  if (providedBusiness.id && !existingBusiness) {
    throw new Error('Business profile not found');
  }

  const insertedUpdatedData = await db
    .insert(businessProfile)
    .values({ ...providedBusiness, userId })
    .onConflictDoUpdate({
      target: businessProfile.id,
      set: {
        ...providedBusiness,
        userId,
        updatedAt: new Date(),
      },
    })
    .returning()
    .then((v) => v[0]);

  return insertedUpdatedData;
}

export async function getUserBusinessProfile() {
  const userId = await getUserId();

  const businessData = await db
    .select()
    .from(businessProfile)
    .where(eq(businessProfile.userId, userId))
    .then((v) => v[0]);

  if (!businessData) {
    const business = await createUpdateBusinessProfile({});

    if (!business) {
      throw new Error('No Business profile found');
    }
  }
  return businessData;
}

export async function deleteBusinessProfile() {
  const userId = await getUserId();

  const existingBusiness = await db
    .select()
    .from(businessProfile)
    .where(eq(businessProfile.userId, userId))
    .then((v) => v[0]);

  if (!existingBusiness) {
    throw new Error('No business profile found to delete');
  }

  const deletedData = await db
    .delete(businessProfile)
    .where(eq(businessProfile.userId, userId))
    .returning()
    .then((v) => v[0]);

  return {
    success: true,
    message: 'Business profile deleted successfully',
    deletedBusiness: deletedData,
  };
}

export async function softDeleteBusinessProfile() {
  const userId = await getUserId();

  const existingBusiness = await db
    .select()
    .from(businessProfile)
    .where(
      and(
        eq(businessProfile.userId, userId),
        eq(businessProfile.isActive, true)
      )
    )
    .then((v) => v[0]);

  if (!existingBusiness) {
    throw new Error('No active business profile found to delete');
  }

  const softDeletedData = await db
    .update(businessProfile)
    .set({
      isActive: false,
      updatedAt: new Date(),
    })
    .where(eq(businessProfile.userId, userId))
    .returning()
    .then((v) => v[0]);

  return {
    success: true,
    message: 'Business profile deactivated successfully',
    deletedBusiness: softDeletedData,
  };
}

export async function reactivateBusinessProfile() {
  const userId = await getUserId();

  const existingBusiness = await db
    .select()
    .from(businessProfile)
    .where(
      and(
        eq(businessProfile.userId, userId),
        eq(businessProfile.isActive, false)
      )
    )
    .then((v) => v[0]);

  if (!existingBusiness) {
    throw new Error('No inactive business profile found to reactivate');
  }

  const reactivatedData = await db
    .update(businessProfile)
    .set({
      isActive: true,
      updatedAt: new Date(),
    })
    .where(eq(businessProfile.userId, userId))
    .returning()
    .then((v) => v[0]);

  return {
    success: true,
    message: 'Business profile reactivated successfully',
    reactivatedBusiness: reactivatedData,
  };
}
