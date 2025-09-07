'use server';

import {
  BusinessInformationInsert,
  businessInformation,
} from '@repo/db/schema/primary';
import { eq } from 'drizzle-orm';
import type { z } from 'zod';
import { db } from '@/lib/db';
import { getUserBusinessProfile } from './business';

const getBusinessProfileId = async () => {
  const business = await getUserBusinessProfile();
  return business.id;
};

export async function createUpdateBusinessInformation(
  infoData: z.infer<
    typeof BusinessInformationInsert.omit<{ businessProfileId: true }>
  >
) {
  const providedInfo = BusinessInformationInsert.omit({
    businessProfileId: true,
  }).parse(infoData);
  const businessProfileId = await getBusinessProfileId();

  const existingInfo = await db
    .select()
    .from(businessInformation)
    .where(eq(businessInformation.businessProfileId, businessProfileId))
    .then((v) => v[0]);

  if (!providedInfo.id && existingInfo) {
    throw new Error('Business information already exists. Use update instead.');
  }

  if (providedInfo.id && existingInfo && providedInfo.id !== existingInfo.id) {
    throw new Error(
      'Business Information ID does not match your existing record'
    );
  }

  const insertedUpdatedData = await db
    .insert(businessInformation)
    .values({ ...providedInfo, businessProfileId })
    .onConflictDoUpdate({
      target: businessInformation.id,
      set: {
        ...providedInfo,
        businessProfileId,
        updatedAt: new Date(),
      },
    })
    .returning()
    .then((v) => v[0]);

  return insertedUpdatedData;
}

export async function getUserBusinessInformation() {
  const businessProfileId = await getBusinessProfileId();
  const infoData = await db
    .select()
    .from(businessInformation)
    .where(eq(businessInformation.businessProfileId, businessProfileId))
    .then((v) => v[0]);

  if (!infoData) {
    const createInfo = await db
      .insert(businessInformation)
      .values({
        businessProfileId,
      })
      .returning()
      .then((v) => v[0]);

    if (!createInfo) {
      throw new Error(
        'User do not have a business information and cannnot be created'
      );
    }
    return createInfo;
  }
  return infoData;
}

export async function deleteBusinessInformation() {
  const businessProfileId = await getBusinessProfileId();

  const existingInfo = await db
    .select()
    .from(businessInformation)
    .where(eq(businessInformation.businessProfileId, businessProfileId))
    .then((v) => v[0]);

  if (!existingInfo) {
    throw new Error('No business information found to delete');
  }

  const deletedData = await db
    .delete(businessInformation)
    .where(eq(businessInformation.businessProfileId, businessProfileId))
    .returning()
    .then((v) => v[0]);

  return {
    success: true,
    message: 'Business information deleted successfully',
    deletedInfo: deletedData,
  };
}
