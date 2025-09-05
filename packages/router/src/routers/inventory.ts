import { inventory, products } from '@repo/db/schema/primary';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { protectedProcedure } from '../domain/orpc';
import { getBusinessProfileId } from './business-information';

export const createUpdateInventory = protectedProcedure
  .input(
    z.object({
      id: z.string().optional(),
      productId: z.string(),
      quantity: z.number().default(0),
      minStockLevel: z.number().default(0),
      maxStockLevel: z.number().default(0),
      unitCost: z.number().optional(),
      location: z.string().optional(),
    })
  )
  .handler(async ({ input, context }) => {
    const businessProfileId = await getBusinessProfileId(context);

    if (input.id) {
      return await db
        .update(inventory)
        .set({
          productId: input.productId,
          quantity: input.quantity,
          minStockLevel: input.minStockLevel,
          maxStockLevel: input.maxStockLevel,
          unitCost: input.unitCost?.toString(),
          location: input.location,
          updatedAt: new Date(),
        })
        .where(eq(inventory.id, input.id))
        .returning();
    }

    return await db
      .insert(inventory)
      .values({
        businessProfileId,
        productId: input.productId,
        quantity: input.quantity,
        minStockLevel: input.minStockLevel,
        maxStockLevel: input.maxStockLevel,
        unitCost: input.unitCost?.toString(),
        location: input.location,
      })
      .returning();
  });

export const getUserInventory = protectedProcedure.handler(
  async ({ context }) => {
    const businessProfileId = await getBusinessProfileId(context);

    return await db
      .select({
        id: inventory.id,
        quantity: inventory.quantity,
        minStockLevel: inventory.minStockLevel,
        maxStockLevel: inventory.maxStockLevel,
        unitCost: inventory.unitCost,
        location: inventory.location,
        createdAt: inventory.createdAt,
        updatedAt: inventory.updatedAt,
        product: {
          id: products.id,
          name: products.name,
          type: products.type,
          price: products.price,
          category: products.category,
          status: products.status,
        },
      })
      .from(inventory)
      .innerJoin(products, eq(inventory.productId, products.id))
      .where(eq(inventory.businessProfileId, businessProfileId));
  }
);

export const deleteInventory = protectedProcedure
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    return await db
      .delete(inventory)
      .where(eq(inventory.id, input.id))
      .returning();
  });
