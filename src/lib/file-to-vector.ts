"use server";
import { downloadFromS3 } from "~/lib/download-from-s3";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import OpenAI from "openai";
import { Document } from "@langchain/core/documents";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number }
  }
};

export async function downloadFileToVector(fileKey: string) {
  // obtain the pdf -> download and read from pdf
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


}

function truncateStringByBytes(str: string, bytes: number) {
  const encoding = new TextEncoder();
  return new TextDecoder("utf-8").decode(encoding.encode(str).slice(0, bytes));
}

async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, ''); // replace all newlines with empty string

  const textSplitter = new CharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 0,
  });

  const docs = await textSplitter.splitDocuments([
    new Document({
      pageContent: pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000);
      },
    })
  ]);

  return docs;
}
