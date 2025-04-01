"use server";
import { downloadFromS3 } from "~/lib/download-from-s3";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import { generateEmbedding } from "./embeddings";
import md5 from "md5";
import { db } from "~/drizzle/db";
import { segment } from "~/drizzle/schema/chat-schema";

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number }
  }
};

export async function downloadFileToVector(fileKey: string) {
  // download and read the pdf from s3
  console.log("downloading s3 into file system...");
  const fileName = await downloadFromS3(fileKey);
  if (!fileName) {
    throw new Error("Could not download from S3");
  }
  const loader = new PDFLoader(fileName);
  const pages = (await loader.load()) as PDFPage[]; // returns the pages of the pdf

  // split and segment the pdf into sections
  const documents = await Promise.all(pages.map(prepareDocument));

  // vectorize and embed into individual sections
  const vectors = await Promise.all(documents.flat().map(embedDocument));

  // upload the array of vector sections into database
  console.log("inserting vectors into database...");
  await db.insert(segment).values(vectors);

  return documents[0]; // just return the first doc for now
}

async function embedDocument(doc: Document) {
  try {
    const embedding = await generateEmbedding(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      content: doc.metadata.text,
      embedding: embedding,
      pageNumber: doc.metadata.pageNumber,
    };
  } catch (err) {
    console.error("Error embedding document", err);
    throw err;
  }
}

function truncateStringByBytes(str: string, bytes: number) {
  const encoding = new TextEncoder();
  return new TextDecoder("utf-8").decode(encoding.encode(str).slice(0, bytes));
}

async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, ''); // replace all newlines with empty string

  const textSplitter = new CharacterTextSplitter({
    chunkSize: 10,
    chunkOverlap: 0,
  });

  const docs = await textSplitter.splitDocuments([
    new Document({
      pageContent: pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    })
  ]);

  return docs;
}
