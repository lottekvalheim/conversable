"use client"

import { trpc } from "@/app/_trpc/client"
import { Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

const Page = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const origin = searchParams.get("origin")

  const query = trpc.authCallback.useQuery(undefined, {
    retry: true,
    retryDelay: 500,
  })

  // Perform side effects in `useEffect`
  useEffect(() => {
    if (query.error) {
      const errData = query.error.data
      if (errData?.code === "UNAUTHORIZED") {
        router.push("/sign-in")
      } else {
        console.error("An error occurred:", query.error)
      }
    }
  }, [query.error, router])

  useEffect(() => {
    if (query.data?.success) {
      router.push(origin ? `/${origin}` : "/dashboard")
    }
  }, [query.data, origin, router])

  // Show loader while loading
  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  )
}

export default Page
