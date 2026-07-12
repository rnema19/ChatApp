import { config } from "dotenv"
import { PutBucketCorsCommand, S3Client } from "@aws-sdk/client-s3"

config({ path: ".env.local" })

const bucketName = process.env.NEXT_PUBLIC_S3_AWS_BUCKET_NAME!

async function configureBucketCors() {
  const client = new S3Client({
    region: process.env.NEXT_PUBLIC_S3_AWS_REGION!,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_S3_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_AWS_SECRET_ACCESS_KEY!,
    },
  })

  await client.send(
    new PutBucketCorsCommand({
      Bucket: bucketName,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedOrigins: ["*"],
            AllowedMethods: ["GET", "HEAD"],
            AllowedHeaders: ["*"],
            ExposeHeaders: [
              "Content-Length",
              "Content-Range",
              "Content-Type",
              "Accept-Ranges",
              "ETag",
            ],
            MaxAgeSeconds: 3000,
          },
        ],
      },
    }),
  )

  console.log(`CORS policy applied to bucket "${bucketName}".`)
}

configureBucketCors().catch((error) => {
  console.error("Failed to configure bucket CORS:", error)
  process.exit(1)
})
