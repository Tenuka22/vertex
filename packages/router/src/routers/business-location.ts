import { ORPCError } from '@orpc/client';
import {
  BusinessLocationInsert,
  businessLocations,
} from '@repo/db/schema/primary';
import { and, eq } from 'drizzle-orm';
import z from 'zod';
import { db } from '../db';
import { protectedProcedure } from '../domain/orpc';
import { getBusinessProfileId } from './business-information';

export const createUpdateBusinessLocation = protectedProcedure
  .input(
    z.object({
      locationData: BusinessLocationInsert,
    })
  )
  .handler(async ({ input }) => {
    const provided = input.locationData;

    const insertedUpdated = await db
      .insert(businessLocations)
      .values({ ...provided })
      .onConflictDoUpdate({
        target: businessLocations.id,
        set: {
          ...provided,
          updatedAt: new Date(),
        },
      })
      .returning()
      .then((v) => v[0]);

    return insertedUpdated;
  });

export const getBusinessLocations = protectedProcedure.handler(
  async ({ context }) => {
    const businessProfileId = await getBusinessProfileId(context);
    if (!businessProfileId) {
      return [];
    }
    const locations = await db
      .select()
      .from(businessLocations)
      .where(eq(businessLocations.businessProfileId, businessProfileId));

    return locations;
  }
);

export const getBusinessLocationById = protectedProcedure
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    const location = await db
      .select()
      .from(businessLocations)
      .where(eq(businessLocations.id, input.id))
      .then((v) => v[0]);

    if (!location) {
      throw new ORPCError('Location not found');
    }
    return location;
  });

export const deleteBusinessLocation = protectedProcedure
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    const deleted = await db
      .delete(businessLocations)
      .where(eq(businessLocations.id, input.id))
      .returning()
      .then((v) => v[0]);

    if (!deleted) {
      throw new ORPCError('No location found to delete');
    }
    return {
      success: true,
      message: 'Location deleted successfully',
      deletedLocation: deleted,
    };
  });

export const softDeleteBusinessLocation = protectedProcedure
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    const existing = await db
      .select()
      .from(businessLocations)
      .where(
        and(
          eq(businessLocations.id, input.id),
          eq(businessLocations.isActive, true)
        )
      )
      .then((v) => v[0]);

    if (!existing) {
      throw new ORPCError('No active location found');
    }
    const softDeleted = await db
      .update(businessLocations)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(businessLocations.id, input.id))
      .returning()
      .then((v) => v[0]);

    return {
      success: true,
      message: 'Location deactivated successfully',
      deletedLocation: softDeleted,
    };
  });

export const reactivateBusinessLocation = protectedProcedure
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    const existing = await db
      .select()
      .from(businessLocations)
      .where(
        and(
          eq(businessLocations.id, input.id),
          eq(businessLocations.isActive, false)
        )
      )
      .then((v) => v[0]);

    if (!existing) {
      throw new ORPCError('No inactive location found');
    }

    const reactivated = await db
      .update(businessLocations)
      .set({
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(businessLocations.id, input.id))
      .returning()
      .then((v) => v[0]);

    return {
      success: true,
      message: 'Location reactivated successfully',
      reactivatedLocation: reactivated,
    };
  });
