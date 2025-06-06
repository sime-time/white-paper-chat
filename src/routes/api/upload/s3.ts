import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { APIEvent } from "@solidjs/start/server";
import { createChat } from "~/lib/create-chat";
import { auth } from "~/lib/auth";

export async function POST(event: APIEvent) {
  try {
    // get the user id from the header
    const session = await auth.api.getSession({
      headers: event.request.headers,
    });
    if (!session) {
      throw new Error("User not authorized");
    }
    const userId = session.user.id;

    const formData = await event.request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
        headers: { "Content-type": "application/json" },
      });
    }

    const bucketRegion = process.env.AWS_S3_REGION!;

    const s3 = new S3({
      region: bucketRegion,
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
      },
      endpoint: `https://s3.${bucketRegion}.amazonaws.com`,
      forcePathStyle: true
    });

    // generate a unique file key
    const fileKey = `uploads/${Date.now().toString()}-${file.name.replaceAll(" ", "-")}`;

    // read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // upload to S3
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileKey,
      Body: buffer,
      ContentType: file.type
    });

    await s3.send(command);

    const chatId = await createChat(file.name, fileKey, userId);
    if (!chatId) {
      throw new Error("Chat creation failed")
    }

    return new Response(JSON.stringify({
      fileKey,
      fileName: file.name,
      chatId: chatId,
    }), {
      status: 200,
      headers: { "Content-type": "application/json" }
    });

  } catch (err) {
    console.log("S3 Upload Error:", err);
    return new Response(JSON.stringify({
      error: 'Upload failed',
      details: err instanceof Error ? err.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
