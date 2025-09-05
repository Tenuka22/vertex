import { goals } from '@repo/db/schema/primary';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { protectedProcedure } from '../domain/orpc';
import { getBusinessProfileId } from './business-information';

export const createUpdateGoal = protectedProcedure
  .input(
    z.object({
      id: z.string().optional(),
      title: z.string(),
      targetAmount: z.number(),
      currentAmount: z.number().default(0),
      deadline: z.string(),
      status: z.string().default('active'),
      category: z.string(),
    })
  )
  .handler(async ({ input, context }) => {
    const businessProfileId = await getBusinessProfileId(context);

    if (input.id) {
      return await db
        .update(goals)
        .set({
          title: input.title,
          targetAmount: input.targetAmount.toString(),
          currentAmount: input.currentAmount.toString(),
          deadline: new Date(input.deadline),
          status: input.status,
          category: input.category,
          updatedAt: new Date(),
        })
        .where(eq(goals.id, input.id))
        .returning();
    }

    return await db
      .insert(goals)
      .values({
        businessProfileId,
        title: input.title,
        targetAmount: input.targetAmount.toString(),
        currentAmount: input.currentAmount.toString(),
        deadline: new Date(input.deadline),
        status: input.status,
        category: input.category,
      })
      .returning();
  });

export const getUserGoals = protectedProcedure.handler(async ({ context }) => {
  const businessProfileId = await getBusinessProfileId(context);

  return await db
    .select()
    .from(goals)
    .where(eq(goals.businessProfileId, businessProfileId));
});

export const deleteGoal = protectedProcedure
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    return await db.delete(goals).where(eq(goals.id, input.id)).returning();
  });
