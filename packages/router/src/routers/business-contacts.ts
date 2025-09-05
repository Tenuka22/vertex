import { businessContacts } from '@repo/db/schema/primary';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { protectedProcedure } from '../domain/orpc';
import { getBusinessProfileId } from './business-information';

export const createUpdateBusinessContact = protectedProcedure
  .input(
    z.object({
      id: z.string().optional(),
      contactType: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      title: z.string().optional(),
      department: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      mobile: z.string().optional(),
      isPrimary: z.boolean().default(false),
      isActive: z.boolean().default(true),
    })
  )
  .handler(async ({ input, context }) => {
    const businessProfileId = await getBusinessProfileId(context);
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
  });

export const getUserBusinessContacts = protectedProcedure.handler(
  async ({ context }) => {
    const businessProfileId = await getBusinessProfileId(context);
    if (!businessProfileId) {
      return [];
    }
    const data = await db
      .select()
      .from(businessContacts)
      .where(eq(businessContacts.businessProfileId, businessProfileId));

    return data;
  }
);

export const deleteBusinessContact = protectedProcedure
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    return await db
      .delete(businessContacts)
      .where(eq(businessContacts.id, input.id))
      .returning();
  });
