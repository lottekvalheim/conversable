import { db } from "@/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"

const f = createUploadthing()
export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession()
      const user = getUser()

      if (!user || !(await user).id) throw new UploadThingError("Unauthorized")

      return { userId: (await user).id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile =  await db.file.create(
        { data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
          uploadStatus: "PROCESSING",
        }
        }
      )
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
