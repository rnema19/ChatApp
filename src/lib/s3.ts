import {  PutObjectCommand,  S3Client,  S3ServiceException} from "@aws-sdk/client-s3";

const bucketName = process.env.NEXT_PUBLIC_S3_AWS_BUCKET_NAME!

export async function uploadToS3(file:File){
  try {
    const client = new S3Client({
      region:process.env.NEXT_PUBLIC_S3_AWS_REGION!,
      credentials:{
          accessKeyId: process.env.NEXT_PUBLIC_S3_AWS_ACCESS_KEY_ID!,
          secretAccessKey : process.env.NEXT_PUBLIC_S3_AWS_SECRET_ACCESS_KEY!
      }
    });

    const file_key = "uploads/"+Date.now().toString()+file.name.replace(' ','-')

    // create array buffer for aws-sdk v3 readability
    const fileBuffer = await file.arrayBuffer()

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: file_key,
      Body: new Uint8Array(fileBuffer),
      ContentType : file.type
    });

      const response = await client.send(command);
      console.log("Upload Successful!",response);
      return {file_key,file_name:file.name}
  } 
  catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file to S3");
  }
};

export function getS3Uri(file_key:string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_AWS_REGION}.amazonaws.com/${file_key}`
  return url
}