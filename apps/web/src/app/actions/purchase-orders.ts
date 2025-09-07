'use server';

import { purchaseOrders, suppliers } from '@repo/db/schema/primary';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { getUserBusinessProfile } from './business';

const getBusinessProfileId = async () => {
  const business = await getUserBusinessProfile();
  return business.id;
};

export async function createUpdatePurchaseOrder(input: {
  id?: string;
  supplierId: string;
  orderNumber: string;
  totalAmount: number;
  status?: string;
  orderDate: string;
  expectedDelivery?: string;
}) {
  const businessProfileId = await getBusinessProfileId();

  if (input.id) {
    return await db
      .update(purchaseOrders)
      .set({
        supplierId: input.supplierId,
        orderNumber: input.orderNumber,
        totalAmount: input.totalAmount.toString(),
        status: input.status,
        orderDate: new Date(input.orderDate),
        expectedDelivery: input.expectedDelivery
          ? new Date(input.expectedDelivery)
          : null,
        updatedAt: new Date(),
      })
      .where(eq(purchaseOrders.id, input.id))
      .returning();
  }

  return await db
    .insert(purchaseOrders)
    .values({
      businessProfileId,
      supplierId: input.supplierId,
      orderNumber: input.orderNumber,
      totalAmount: input.totalAmount.toString(),
      status: input.status,
      orderDate: new Date(input.orderDate),
      expectedDelivery: input.expectedDelivery
        ? new Date(input.expectedDelivery)
        : null,
    })
    .returning();
}

export async function getUserPurchaseOrders() {
  const businessProfileId = await getBusinessProfileId();

  return await db
    .select({
      id: purchaseOrders.id,
      orderNumber: purchaseOrders.orderNumber,
      totalAmount: purchaseOrders.totalAmount,
      status: purchaseOrders.status,
      orderDate: purchaseOrders.orderDate,
      expectedDelivery: purchaseOrders.expectedDelivery,
      createdAt: purchaseOrders.createdAt,
      updatedAt: purchaseOrders.updatedAt,
      supplier: {
        id: suppliers.id,
        name: suppliers.name,
        contactPerson: suppliers.contactPerson,
        email: suppliers.email,
        phone: suppliers.phone,
      },
    })
    .from(purchaseOrders)
    .innerJoin(suppliers, eq(purchaseOrders.supplierId, suppliers.id))
    .where(eq(purchaseOrders.businessProfileId, businessProfileId));
}

export async function deletePurchaseOrder(id: string) {
  return await db
    .delete(purchaseOrders)
    .where(eq(purchaseOrders.id, id))
    .returning();
}
