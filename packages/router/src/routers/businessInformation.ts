import { ORPCError } from '@orpc/client';
import {
  BusinessInformationInsert,
  businessInformation,
  businessProfile,
} from '@repo/db/schema/primary';
import { eq } from 'drizzle-orm';
import z from 'zod';
import { db } from '../db';
import { protectedProcedure } from '../domain/orpc';

async function getBusinessProfileId(userId: string) {
  const profile = await db
    .select()
    .from(businessProfile)
    .where(eq(businessProfile.userId, userId))
    .then((v) => v[0]);

  if (!profile) {
    throw new ORPCError('User does not have a business profile');
  }
  return profile.id;
}

export const createUpdateBusinessInformation = protectedProcedure
  .input(
    z.object({
      infoData: BusinessInformationInsert.omit({ businessProfileId: true }),
    })
  )
  .handler(async ({ input, context }) => {
    const { user } = context.session;
    const providedInfo = input.infoData;

    const businessProfileId = await getBusinessProfileId(user.id);

    const existingInfo = await db
      .select()
      .from(businessInformation)
      .where(eq(businessInformation.businessProfileId, businessProfileId))
      .then((v) => v[0]);

    if (!providedInfo.id && existingInfo) {
      throw new ORPCError(
        'Business information already exists. Use update instead.'
      );
    }

    if (
      providedInfo.id &&
      existingInfo &&
      providedInfo.id !== existingInfo.id
    ) {
      throw new ORPCError(
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
  });

export const getUserBusinessInformation = protectedProcedure.handler(
  async ({ context }) => {
    const { user } = context.session;
    const businessProfileId = await getBusinessProfileId(user.id);

    const infoData = await db
      .select()
      .from(businessInformation)
      .where(eq(businessInformation.businessProfileId, businessProfileId))
      .then((v) => v[0]);

    return infoData;
  }
);

export const deleteBusinessInformation = protectedProcedure.handler(
  async ({ context }) => {
    const { user } = context.session;
    const businessProfileId = await getBusinessProfileId(user.id);

    const existingInfo = await db
      .select()
      .from(businessInformation)
      .where(eq(businessInformation.businessProfileId, businessProfileId))
      .then((v) => v[0]);

    if (!existingInfo) {
      throw new ORPCError('No business information found to delete');
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
);
