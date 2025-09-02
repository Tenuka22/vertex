import { ORPCError } from '@orpc/client';
import { call } from '@orpc/server';
import {
  BusinessInformationInsert,
  businessInformation,
} from '@repo/db/schema/primary';
import { eq } from 'drizzle-orm';
import z from 'zod';
import type { Context } from '../../../../apps/server/src/lib/context';
import { db } from '../db';
import { protectedProcedure } from '../domain/orpc';
import { getUserBusinessProfile } from './business';

const getBusinessProfileId = async (context: Context) => {
  const business = await call(
    getUserBusinessProfile,
    {},
    {
      context,
    }
  );

  return business.id;
};
export const createUpdateBusinessInformation = protectedProcedure
  .input(
    z.object({
      infoData: BusinessInformationInsert.omit({ businessProfileId: true }),
    })
  )
  .handler(async ({ input, context }) => {
    const providedInfo = input.infoData;

    const businessProfileId = await getBusinessProfileId(context);

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
    const businessProfileId = await getBusinessProfileId(context);
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
);

export const deleteBusinessInformation = protectedProcedure.handler(
  async ({ context }) => {
    const businessProfileId = await getBusinessProfileId(context);

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
