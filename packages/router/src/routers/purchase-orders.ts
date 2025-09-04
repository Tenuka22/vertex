import { purchaseOrders, suppliers } from '@repo/db/schema/primary';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { protectedProcedure } from '../domain/orpc';
import { getBusinessProfileId } from './business-information';

export const createUpdatePurchaseOrder = protectedProcedure
  .input(
    z.object({
      id: z.string().optional(),
      supplierId: z.string(),
      orderNumber: z.string(),
      totalAmount: z.number(),
      status: z.string().default('pending'),
      orderDate: z.string(),
      expectedDelivery: z.string().optional(),
    })
  )
  .handler(async ({ input, context }) => {
    const businessProfileId = await getBusinessProfileId(context);

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
  });

export const getUserPurchaseOrders = protectedProcedure.handler(
  async ({ context }) => {
    const businessProfileId = await getBusinessProfileId(context);

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
);

export const deletePurchaseOrder = protectedProcedure
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    return await db
      .delete(purchaseOrders)
      .where(eq(purchaseOrders.id, input.id))
      .returning();
  });
