import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateEmbedding(text: string) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text.replace(/\n/g, ' '), // replace newlines with space
    });
    return response.data[0].embedding as number[];

  } catch (err) {
    console.error("Error calling Open AI embeddings api", err);
    throw err;
  }
}
