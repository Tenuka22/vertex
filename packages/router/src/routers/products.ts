import { products } from '@repo/db/schema/primary';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { protectedProcedure } from '../domain/orpc';
import { getBusinessProfileId } from './business-information';

export const createUpdateProduct = protectedProcedure
  .input(
    z.object({
      id: z.string().optional(),
      name: z.string(),
      type: z.string(),
      price: z.number(),
      category: z.string(),
      status: z.string().default('active'),
      description: z.string().optional(),
    })
  )
  .handler(async ({ input, context }) => {
    const businessProfileId = await getBusinessProfileId(context);

    if (input.id) {
      return await db
        .update(products)
        .set({
          name: input.name,
          type: input.type,
          price: input.price.toString(),
          category: input.category,
          status: input.status,
          description: input.description,
          updatedAt: new Date(),
        })
        .where(eq(products.id, input.id))
        .returning();
    }

    return await db
      .insert(products)
      .values({
        businessProfileId,
        name: input.name,
        type: input.type,
        price: input.price.toString(),
        category: input.category,
        status: input.status,
        description: input.description,
      })
      .returning();
  });

export const getUserProducts = protectedProcedure.handler(
  async ({ context }) => {
    const businessProfileId = await getBusinessProfileId(context);

    return await db
      .select()
      .from(products)
      .where(eq(products.businessProfileId, businessProfileId));
  }
);

export const deleteProduct = protectedProcedure
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    return await db
      .delete(products)
      .where(eq(products.id, input.id))
      .returning();
  });
