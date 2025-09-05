import { suppliers } from '@repo/db/schema/primary';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { protectedProcedure } from '../domain/orpc';
import { getBusinessProfileId } from './business-information';

export const createUpdateSupplier = protectedProcedure
  .input(
    z.object({
      id: z.string().optional(),
      name: z.string(),
      contactPerson: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
      status: z.string().default('active'),
    })
  )
  .handler(async ({ input, context }) => {
    const businessProfileId = await getBusinessProfileId(context);

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
  });

export const getUserSuppliers = protectedProcedure.handler(
  async ({ context }) => {
    const businessProfileId = await getBusinessProfileId(context);

    return await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.businessProfileId, businessProfileId));
  }
);

export const deleteSupplier = protectedProcedure
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    return await db
      .delete(suppliers)
      .where(eq(suppliers.id, input.id))
      .returning();
  });
