'use server';

import { businessContacts } from '@repo/db/schema/primary';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { getUserBusinessProfile } from './business';

const getBusinessProfileId = async () => {
  const business = await getUserBusinessProfile();
  return business.id;
};

export async function createUpdateBusinessContact(input: {
  id?: string;
  contactType: string;
  firstName: string;
  lastName: string;
  title?: string;
  department?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  isPrimary?: boolean;
  isActive?: boolean;
}) {
  const businessProfileId = await getBusinessProfileId();
  if (!businessProfileId) {
    throw new Error('Business profile not found');
  }

  if (input.id) {
    return await db
      .update(businessContacts)
      .set({
        contactType: input.contactType,
        firstName: input.firstName,
        lastName: input.lastName,
        title: input.title,
        department: input.department,
        email: input.email,
        phone: input.phone,
        mobile: input.mobile,
        isPrimary: input.isPrimary,
        isActive: input.isActive,
        updatedAt: new Date(),
      })
      .where(eq(businessContacts.id, input.id))
      .returning();
  }

  return await db
    .insert(businessContacts)
    .values({
      businessProfileId,
      contactType: input.contactType,
      firstName: input.firstName,
      lastName: input.lastName,
      title: input.title,
      department: input.department,
      email: input.email,
      phone: input.phone,
      mobile: input.mobile,
      isPrimary: input.isPrimary,
      isActive: input.isActive,
    })
    .returning();
}

export async function getUserBusinessContacts() {
  const businessProfileId = await getBusinessProfileId();
  if (!businessProfileId) {
    return [];
  }
  const data = await db
    .select()
    .from(businessContacts)
    .where(eq(businessContacts.businessProfileId, businessProfileId));

  return data;
}

export async function deleteBusinessContact(id: string) {
  return await db
    .delete(businessContacts)
    .where(eq(businessContacts.id, id))
    .returning();
}
