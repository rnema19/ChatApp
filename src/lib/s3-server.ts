import { GetObjectCommand,  S3,  S3Client} from "@aws-sdk/client-s3";
import fs from "fs"
const bucketName = process.env.NEXT_PUBLIC_S3_AWS_BUCKET_NAME!

export async function downloadFromS3(file_key:string){
  try {
    const client = new S3Client({
      region:process.env.NEXT_PUBLIC_S3_AWS_REGION!,
      credentials:{
          accessKeyId: process.env.NEXT_PUBLIC_S3_AWS_ACCESS_KEY_ID!,
          secretAccessKey : process.env.NEXT_PUBLIC_S3_AWS_SECRET_ACCESS_KEY!
      }
    });

/*
    const { ObjectLockConfiguration } = await client.send(
      new GetObjectLockConfigurationCommand({
        Bucket: bucketName
      }),
    );
*/
    const obj = await client.send(
      new GetObjectCommand(
        { Bucket: bucketName, Key: file_key }
        ),
    );
    const file_name = `/tmp/pdf_name-${Date.now()}.pdf`

    const data = await obj.Body?.transformToByteArray()!
    fs.writeFileSync(
      file_name, data
    );
    console.log("Files downloaded successfully.\n");
    return file_name
  } catch (caught) {
      console.error(
        `Error from S3 while getting object lock configuration for ${bucketName}.`,
      );
      throw caught
  } 
};