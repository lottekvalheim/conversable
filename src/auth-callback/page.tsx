import { trpc } from "@/app/_trpc/client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

const Page = async () => {
  const router = useRouter()

  const searchParams = useSearchParams()
  const origin = searchParams.get("origin")

  const{data, isLoading} = trpc.authCallback.useQuery()

  // Use useEffect to handle redirect after successful authentication
  useEffect(() => {
    if (data?.success) {
      router.push(origin ? `/${origin}` : "/dashboard")
    }
  }, [data, origin, router]) // Dependencies: re-run when `data` or `origin` changes

  return isLoading ? <p>Loading...</p> : <p>Redirecting...</p>

}
export default Page
