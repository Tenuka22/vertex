'use server';

import { inventory, products } from '@repo/db/schema/primary';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { getUserBusinessProfile } from './business';

const getBusinessProfileId = async () => {
  const business = await getUserBusinessProfile();
  return business.id;
};

export async function createUpdateInventory(input: {
  id?: string;
  productId: string;
  quantity?: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  unitCost?: number;
  location?: string;
}) {
  const businessProfileId = await getBusinessProfileId();

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
}

export async function getUserInventory() {
  const businessProfileId = await getBusinessProfileId();

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

export async function deleteInventory(id: string) {
  return await db.delete(inventory).where(eq(inventory.id, id)).returning();
}
