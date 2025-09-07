'use server';

import { products } from '@repo/db/schema/primary';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { getUserBusinessProfile } from './business';

const getBusinessProfileId = async () => {
  const business = await getUserBusinessProfile();
  return business.id;
};

export async function createUpdateProduct(input: {
  id?: string;
  name: string;
  type: string;
  price: number;
  category: string;
  status?: string;
  description?: string;
}) {
  const businessProfileId = await getBusinessProfileId();

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
}

export async function getUserProducts() {
  const businessProfileId = await getBusinessProfileId();

  return await db
    .select()
    .from(products)
    .where(eq(products.businessProfileId, businessProfileId));
}

export async function deleteProduct(id: string) {
  return await db.delete(products).where(eq(products.id, id)).returning();
}
