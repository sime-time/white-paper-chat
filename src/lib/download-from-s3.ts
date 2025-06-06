"use server";
import { S3, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import fs from "fs";

// instantiate s3
const bucketRegion = process.env.AWS_S3_REGION!;
const s3 = new S3({
  region: bucketRegion,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
  },
});

export async function downloadFromS3(fileKey: string) {
  try {
    // retrieve from S3
    const obj = await s3.getObject({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileKey,
    });

    // download the file to the system
    const fileName = `/tmp/pdf-${Date.now()}.pdf`;
    const body = await obj.Body?.transformToByteArray(); // for binary data like PDFs
    if (body) {
      fs.writeFileSync(fileName, Buffer.from(body));
      return fileName;
    } else {
      throw new Error("PDF could not be transformed into byte array")
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}

export function getS3Url(fileKey: string) {
  const bucket = process.env.AWS_S3_BUCKET_NAME!;
  const region = process.env.AWS_S3_REGION!;
  const url = `https://${bucket}.s3.${region}.amazonaws.com/${fileKey}`
  return url;
}

export async function getSignedPdfUrl(fileKey: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: fileKey,
  });

  // URL with expiration
  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return signedUrl;
}
