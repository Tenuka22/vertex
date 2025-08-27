import { eq } from 'drizzle-orm';
import z from 'zod';
import { db } from '@/db';
import { BusinessProfileInsert, businessProfile } from '@/db/schema/primary';
import { protectedProcedure } from '@/lib/orpc';

export const createUpdateBusinessProfile = protectedProcedure
  .input(
    z.object({
      businessData: BusinessProfileInsert,
    })
  )
  .handler(async ({ input }) => {
    const providedbusiness = input.businessData;

    const insertedUpdatedData = await db
      .insert(businessProfile)
      .values({ ...providedbusiness })
      .onConflictDoUpdate({
        target: businessProfile.id,
        set: businessProfile,
      })
      .returning()
      .then((v) => v[0]);

    return insertedUpdatedData;
  });

export const getBusinessProfile = protectedProcedure
  .input(
    z.object({
      businessId: z.string(),
    })
  )
  .handler(async ({ input }) => {
    const providedbusinessId = input.businessId;

    const selectedData = await db
      .select()
      .from(businessProfile)
      .where(eq(businessProfile.id, providedbusinessId))
      .then((v) => v[0]);

    return selectedData;
  });
