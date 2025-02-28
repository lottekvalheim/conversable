import { db } from "@/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { privateProcedure, publicProcedure, router } from "./trpc"

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession()
    const user = getUser()

    if (!(await user).id || !(await user).email) throw new TRPCError({ code: "UNAUTHORIZED" })
    // check if the user is in the database
    const dbUser = await db.user.findFirst({
      where: {
        id: (await user).id,
      },
    })

    if (!dbUser) {
      // create user in db
      await db.user.create({
        data: {
          id: (await user).id,
          email: (await user).email!,
        },
      })
    }
    return { success: true }
  }),
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId, user } = ctx
    return await db.file.findMany({
      where: {
        userId: userId,
      },
    })
  }),
  getFileUploadStatus: privateProcedure.input(z.object({ fileId: z.string() })).query(async ({ input, ctx }) => {
    const file = await db.file.findFirst({
      where: {
        id: input.fileId,
        userId: ctx.userId,
      },
    })
    if (!file) return { status: "PENDING" as const }
    return { status: file.uploadStatus }
  }),

  getFile: privateProcedure.input(z.object({ key: z.string() })).mutation(async ({ ctx, input }) => {
    const { userId } = ctx
    const file = await db.file.findFirst({
      where: {
        key: input.key,
        userId,
      },
    })
    if (!file) throw new TRPCError({ code: "NOT_FOUND" })
    return file
  }),

  deleteFile: privateProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const { userId } = ctx

    const file = await db.file.findFirst({
      where: {
        id: input.id,
        userId,
      },
    })
    if (!file) throw new TRPCError({ code: "NOT_FOUND" })

    await db.file.delete({
      where: {
        id: input.id,
      },
    })
    return file
  }),
})

export type AppRouter = typeof appRouter
