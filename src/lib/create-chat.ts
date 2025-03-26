import { downloadFileToVector } from "./file-to-vector";

export async function createChat(fileName: string, fileKey: string) {
  "use server";
  try {
    const pages = await downloadFileToVector(fileKey);
    console.log("PAGES:", pages);
  } catch (err) {
    console.error(err);
  }

}
