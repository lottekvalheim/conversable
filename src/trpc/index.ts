import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { publicProcedure, router } from "./trpc"
import { TRPCError } from "@trpc/server"
export const appRouter = router({
  authCallback: publicProcedure.query(async () =>{
    const {getUser} = getKindeServerSession()
    const user = getUser()

    if(!(await user).id || !(await user).email) 
      throw new TRPCError({code: "UNAUTHORIZED"})
    // check if the user is in the database
    return {success: true}
  })
})

export type AppRouter = typeof appRouter
