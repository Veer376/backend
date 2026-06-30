// Import the Pinecone library
import { Pinecone } from '@pinecone-database/pinecone'
import { Document } from "@langchain/core/documents";
import dotenv from 'dotenv';

dotenv.config();
// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' });
const indexName = 'rag-project';
const namespace = 'Anuj';

export const ensureIndexAndUpsertDocs = async (docs: Document[]) => {
    const existingIndexes = await pc.listIndexes();

    const indexExists = existingIndexes.indexes?.map((index) => index.name).includes(indexName);

    // Create the index if it doesn't exist
    if (!indexExists) {
        await pc.createIndexForModel({
          name: indexName,
          cloud: 'aws',
          region: 'us-east-1',
          embed: {
            model: 'llama-text-embed-v2',
            fieldMap: { text: 'chunk_text' },
          },
          waitUntilReady: true,
        });
    }

    // Get the index
    const index = pc.index(indexName).namespace(namespace);

    // Convert the documents into records suitable for upserting into Pinecone

    const pineconeRecords = docs.map((doc, index) => {
        return {
            id: `${index}`, // Unique ID for the record
            chunk_text: doc.pageContent,
            category: doc.metadata?.source || 'unknown'
        }
    })

    // upsert the documents into the index.
    await index.upsertRecords({
        records: pineconeRecords,
    });

}
export const queryDocs = async (query: string) => {
    // Get the index.
    const index = pc.index(indexName).namespace(namespace);

    const results = await index.searchRecords({
        query: {
            topK: 1,
            inputs: { text: query },
        }
    })

    // Print the results
    results.result.hits.forEach(hit => {
      console.log(`id: ${hit._id}, score: ${hit._score.toFixed(2)}, category: ${hit.fields.category}, text: ${hit.fields.chunk_text}`);
    });

    return results
}


