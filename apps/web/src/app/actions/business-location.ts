'use server';

import {
  BusinessLocationInsert,
  businessLocations,
} from '@repo/db/schema/primary';
import { and, eq } from 'drizzle-orm';
import type { z } from 'zod';
import { db } from '@/lib/db';
import { getUserBusinessProfile } from './business';

const getBusinessProfileId = async () => {
  const business = await getUserBusinessProfile();
  return business.id;
};

export async function createUpdateBusinessLocation(
  locationData: z.infer<typeof BusinessLocationInsert>
) {
  const provided = BusinessLocationInsert.parse(locationData);

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
}

export async function getBusinessLocations() {
  const businessProfileId = await getBusinessProfileId();
  if (!businessProfileId) {
    return [];
  }
  const locations = await db
    .select()
    .from(businessLocations)
    .where(eq(businessLocations.businessProfileId, businessProfileId));

  return locations;
}

export async function getBusinessLocationById(id: string) {
  const location = await db
    .select()
    .from(businessLocations)
    .where(eq(businessLocations.id, id))
    .then((v) => v[0]);

  if (!location) {
    throw new Error('Location not found');
  }
  return location;
}

export async function deleteBusinessLocation(id: string) {
  const deleted = await db
    .delete(businessLocations)
    .where(eq(businessLocations.id, id))
    .returning()
    .then((v) => v[0]);

  if (!deleted) {
    throw new Error('No location found to delete');
  }
  return {
    success: true,
    message: 'Location deleted successfully',
    deletedLocation: deleted,
  };
}

export async function softDeleteBusinessLocation(id: string) {
  const existing = await db
    .select()
    .from(businessLocations)
    .where(
      and(eq(businessLocations.id, id), eq(businessLocations.isActive, true))
    )
    .then((v) => v[0]);

  if (!existing) {
    throw new Error('No active location found');
  }
  const softDeleted = await db
    .update(businessLocations)
    .set({
      isActive: false,
      updatedAt: new Date(),
    })
    .where(eq(businessLocations.id, id))
    .returning()
    .then((v) => v[0]);

  return {
    success: true,
    message: 'Location deactivated successfully',
    deletedLocation: softDeleted,
  };
}

export async function reactivateBusinessLocation(id: string) {
  const existing = await db
    .select()
    .from(businessLocations)
    .where(
      and(eq(businessLocations.id, id), eq(businessLocations.isActive, false))
    )
    .then((v) => v[0]);

  if (!existing) {
    throw new Error('No inactive location found');
  }

  const reactivated = await db
    .update(businessLocations)
    .set({
      isActive: true,
      updatedAt: new Date(),
    })
    .where(eq(businessLocations.id, id))
    .returning()
    .then((v) => v[0]);

  return {
    success: true,
    message: 'Location reactivated successfully',
    reactivatedLocation: reactivated,
  };
}
