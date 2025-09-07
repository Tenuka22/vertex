'use server';

import { suppliers } from '@repo/db/schema/primary';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { getUserBusinessProfile } from './business';

const getBusinessProfileId = async () => {
  const business = await getUserBusinessProfile();
  return business.id;
};

export async function createUpdateSupplier(input: {
  id?: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: string;
}) {
  const businessProfileId = await getBusinessProfileId();

  if (input.id) {
    return await db
      .update(suppliers)
      .set({
        name: input.name,
        contactPerson: input.contactPerson,
        email: input.email,
        phone: input.phone,
        address: input.address,
        status: input.status,
        updatedAt: new Date(),
      })
      .where(eq(suppliers.id, input.id))
      .returning();
  }

  return await db
    .insert(suppliers)
    .values({
      businessProfileId,
      name: input.name,
      contactPerson: input.contactPerson,
      email: input.email,
      phone: input.phone,
      address: input.address,
      status: input.status,
    })
    .returning();
}

export async function getUserSuppliers() {
  const businessProfileId = await getBusinessProfileId();

  return await db
    .select()
    .from(suppliers)
    .where(eq(suppliers.businessProfileId, businessProfileId));
}

export async function deleteSupplier(id: string) {
  return await db.delete(suppliers).where(eq(suppliers.id, id)).returning();
}
