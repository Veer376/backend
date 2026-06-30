import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";

export async function splitDocuments(docs: Document[]) {

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 200,
    });

    const allSplits = await splitter.splitDocuments(docs);

    return allSplits;
}
